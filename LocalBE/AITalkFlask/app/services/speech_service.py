import logging
import pyaudio
import numpy as np
import whisper
import time
import openai
from threading import Lock, Thread
import os
from gtts import gTTS
import base64
from io import BytesIO

from app.extensions import socketio, db
from app.models import Child
from dotenv import load_dotenv

load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Whisper 모델 지연 로딩용 전역 변수
model = None

def load_model():
    global model
    if model is None:
        logging.info("🔍 Whisper 모델 로딩 중...")
        model = whisper.load_model("large")
        logging.info("✅ Whisper 모델 로드 완료")
    return model

# 음성 인식 및 TTS, GPT 처리 상태 관리 전역 변수
is_recognizing = False
recognition_lock = Lock()
keep_listening = True      # 음성 인식을 계속할지 여부
gpt_processing = False     # GPT 요청 처리 중 여부
is_tts_playing = True     # TTS 재생 중임을 나타내는 플래그
current_child_id = None    # 현재 대화 중인 아동의 ID

# OpenAI API 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# 대화 내역 (초기 시스템 프롬프트 포함)
conversation_history = []

def get_child_info(child_id):
    child = Child.query.filter_by(child_id=child_id).first()
    if child:
        return {
            'child_name': child.child_name,
            'child_age': child.age,
            'disability_type': child.disability_type
        }
    return None

def text_to_speech(text):
    tts = gTTS(text, lang='ko')
    audio_data = BytesIO()
    tts.write_to_fp(audio_data)
    audio_data.seek(0)
    return base64.b64encode(audio_data.read()).decode('utf-8')

def initialize_conversation(child_id):
    child_info = get_child_info(child_id)
    if not child_info:
        return

    initial_system_prompt = f"""
    You are a language therapy chatbot designed for a child who is {child_info['child_age']} years old and has {child_info['disability_type']}.
    Your goal is to encourage the child to speak more by asking **simple, closed-ended questions** (yes/no questions or offering simple choices), but do **not** instruct the child to answer only with "yes" or "no." Allow natural, flexible responses from the child.
    Since the child may have speech difficulties and might not pronounce words clearly, try to understand the meaning based on **context** even if the words sound incorrect. If the child's speech recognition is inaccurate, interpret it in the closest possible way to what they might have intended.
    Keep the questions simple and age-appropriate. Make sure to respond **in Korean**.
    Start with the first question: "오늘 기분이 좋아요?" (Are you feeling good today?)
    """
    logging.info(f"초기 프롬프트: {initial_system_prompt}")
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": initial_system_prompt})

def recognize_audio(child_id):
    global is_recognizing, keep_listening, gpt_processing, is_tts_playing
    model = load_model()

    with recognition_lock:
        is_recognizing = True

    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    RECORD_SECONDS = 0.5

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    audio_buffer = []
    silence_threshold = 0.02  # 소음 임계치
    silence_duration = 1.0     # 침묵으로 간주할 시간
    last_speech_time = time.time()

    logging.info("🎙 음성 인식 시작")

    while keep_listening:
        # TTS 재생 중이면 음성 인식 처리 건너뜀
        if is_tts_playing:
            time.sleep(0.1)
            continue

        frames = [stream.read(CHUNK, exception_on_overflow=False)
                  for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]
        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        if np.abs(audio_np).mean() > silence_threshold:
            logging.debug("🍗 음성 감지 중...")
            audio_buffer.append(audio_data)
            last_speech_time = time.time()
        elif time.time() - last_speech_time > silence_duration and audio_buffer:
            if not gpt_processing:
                logging.info("🔁 말 중단 감지 → 텍스트 변환 시도")
                full_audio = b''.join(audio_buffer)
                audio_buffer = []

                try:
                    audio_np_full = np.frombuffer(full_audio, dtype=np.int16).astype(np.float32) / 32768.0
                    result = model.transcribe(audio_np_full, language="korean", temperature=0)
                    text = result["text"].strip()

                    if text:
                        logging.info(f"📝 텍스트 변환 완료: {text}")
                        gpt_processing = True
                        Thread(target=get_gpt_response, args=(text, child_id), daemon=True).start()
                except Exception as e:
                    logging.error(f"❌ 텍스트 변환 중 오류: {e}")
            else:
                audio_buffer = []
        time.sleep(0.01)

    stream.stop_stream()
    stream.close()
    p.terminate()
    logging.info("🔁 음성 인식 종료")
    with recognition_lock:
        is_recognizing = False

def get_gpt_response(user_input, child_id, is_summary=False):
    global gpt_processing, conversation_history, is_tts_playing
    try:
        conversation_history.append({"role": "user", "content": user_input})
        logging.info(f"🤝 GPT에 질문: {user_input}")
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=conversation_history,
            max_tokens=500
        )
        logging.debug(f"GPT 원시 응답: {response}")

        gpt_reply = response.choices[0].message['content'].strip()
        logging.info(f"🤖 GPT 응답: {gpt_reply}")
        conversation_history.append({"role": "assistant", "content": gpt_reply})

        if not is_summary:  # 일반 대화 응답일 경우
            is_tts_playing = True
            audio_base64 = text_to_speech(gpt_reply)
            socketio.emit('gpt_response', {'response': gpt_reply, 'audio': audio_base64}, namespace='/')
        else:
            logging.info("✅ 요약 완료 (클라이언트로 전송하지 않음)")

    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")
    finally:
        gpt_processing = False

def stop_recognition(child_id):
    global keep_listening, conversation_history
    keep_listening = False
    logging.info("🔁 음성 인식 중단")

    child_info = get_child_info(child_id)
    if child_info:
        summary_prompt = f"""
        You are a speech therapist reviewing a conversation with a child who is {child_info['child_age']} years old and has {child_info['disability_type']}.
        Please summarize the conversation from a speech therapist’s perspective in **3 concise sentences**. Focus on the child’s response style, speech and pronunciation, vocabulary use, and engagement, but do not list these points separately.
        Provide the summary in **Korean**.
        """
        get_gpt_response(summary_prompt, child_id, is_summary=True)

    socketio.emit('session_end', {'message': '대화가 종료되었습니다.'}, namespace='/')
    initialize_conversation(child_id)
    logging.info("✅ 대화 종료 후 리소스 정리 완료.")

@socketio.on('tts_finished', namespace='/')
def handle_tts_finished(data):
    """
    클라이언트에서 TTS 재생 완료 후 호출하는 이벤트 핸들러.
    TTS 재생 플래그(is_tts_playing)를 해제하고, 음성 인식이 실행 중이 아니면 재시작합니다.
    """
    global is_tts_playing, current_child_id, is_recognizing, keep_listening
    is_tts_playing = False
    logging.info("TTS 재생 완료 이벤트 수신: 음성 인식 재개됨")
    if not is_recognizing and current_child_id is not None:
        keep_listening = True
        Thread(target=recognize_audio, args=(current_child_id,), daemon=True).start()
