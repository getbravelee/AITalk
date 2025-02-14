import logging
import pyaudio
import numpy as np
import time
import openai
from threading import Lock, Thread
import os
from gtts import gTTS
import base64
from io import BytesIO
import wave
import tempfile
import json
import requests
from pydub import AudioSegment  # 🔥 추가 라이브러리 필요
from flask import jsonify

from app.extensions import socketio, db
from app.models import Child, Schedule
from dotenv import load_dotenv
from sqlalchemy.orm.attributes import flag_modified

load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# 음성 인식 및 TTS, GPT 처리 상태 관리 전역 변수
is_recognizing = False
recognition_lock = Lock()
keep_listening = True
gpt_processing = False
is_tts_playing = True
current_child_id = None

# OpenAI API 설정
openai.api_key = os.getenv("OPENAI_API_KEY")
TYPECAST_API_KEY = os.getenv("TYPECAST_API_KEY")
TYPECAST_ACTOR_ID = os.getenv("TYPECAST_VOICE_ID")

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


import requests
import json
import base64
import logging

TYPECAST_API_KEY = os.getenv("TYPECAST_API_KEY")
TYPECAST_ACTOR_ID = os.getenv("TYPECAST_VOICE_ID")


def text_to_speech(text):
    """
    Typecast API를 사용하여 텍스트를 음성으로 변환한 후, Base64 MP3로 변환하여 반환.
    """
    if not TYPECAST_API_KEY or not TYPECAST_ACTOR_ID:
        logging.error("❌ Typecast API Key 또는 Actor ID가 설정되지 않았습니다.")
        return None

    api_url = "https://typecast.ai/api/speak"
    headers = {
        "Authorization": f"Bearer {TYPECAST_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = json.dumps({
        "actor_id": TYPECAST_ACTOR_ID,
        "text": text,
        "lang": "auto",
        "xapi_audio_format": "mp3"
    })

    try:
        # ✅ Typecast API 요청 (음성 생성)
        response = requests.post(api_url, headers=headers, data=payload)
        if response.status_code != 200:
            logging.error(f"❌ Typecast API 오류: {response.status_code} - {response.text}")
            return None

        # ✅ 응답에서 오디오 다운로드 URL 추출
        result = response.json()
        audio_url = result["result"]["speak_url"]
        logging.info(f"📢 음성 파일 다운로드 중... URL: {audio_url}")

        # ✅ 오디오 파일 다운로드
        audio_response = requests.get(audio_url, headers=headers)
        if audio_response.status_code != 200:
            logging.error(f"❌ 음성 파일 다운로드 실패: {audio_response.status_code}")
            return None

        # ✅ Base64로 변환 후 반환
        audio_base64 = base64.b64encode(audio_response.content).decode('utf-8')
        return audio_base64

    except Exception as e:
        logging.error(f"❌ Typecast API 요청 중 오류 발생: {e}")
        return None




def initialize_conversation(child_id):
    child_info = get_child_info(child_id)
    if not child_info:
        return

    initial_system_prompt = f"""
    You are a language therapy chatbot designed for a child who is {child_info['child_age']} years old and has {child_info['disability_type']}.
    Your goal is to encourage the child to speak more by asking **simple, closed-ended questions** (yes/no questions or offering simple choices), but do **not** instruct the child to answer only with "yes" or "no." Allow natural, flexible responses from the child.
    Since the child may have speech difficulties and might not pronounce words clearly, try to understand the meaning based on **context** even if the words sound incorrect. Keep the questions simple and age-appropriate. Make sure to respond **in Korean**.
    Start with the first question: "오늘 기분이 좋아요?" (Are you feeling good today?)
    """
    logging.info(f"초기 프롬프트: {initial_system_prompt}")
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": initial_system_prompt})


def recognize_audio(child_id):
    global is_recognizing, keep_listening, gpt_processing, is_tts_playing

    with recognition_lock:
        is_recognizing = True

    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    RECORD_SECONDS = 1.5

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    # 스트림 초기화
    for _ in range(5):
        stream.read(CHUNK, exception_on_overflow=False)

    stream.stop_stream()
    stream.start_stream()

    audio_buffer = []
    silence_threshold = 0.01  # RMS 민감도 조절 (필요시 조정)
    silence_duration = 1.5  # 말 중단 감지 시간
    last_speech_time = time.time()

    # 버퍼가 너무 커지는 것을 방지하기 위한 최대 버퍼 길이 (초 단위)
    max_buffer_duration = 10  # 예: 10초
    max_buffer_count = int(max_buffer_duration / RECORD_SECONDS)

    logging.info("🎙 음성 인식 시작")
    socketio.emit("speech_ready")

    while keep_listening:
        # TTS 재생 중이면 잔여 오디오 데이터를 초기화하고 새 데이터를 받지 않음
        if is_tts_playing:
            if audio_buffer:
                logging.debug("TTS 재생 중: audio_buffer 초기화")
                audio_buffer.clear()
            time.sleep(0.1)
            continue

        frames = [stream.read(CHUNK, exception_on_overflow=False)
                  for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]
        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # RMS 계산
        rms = np.sqrt(np.mean(np.square(audio_np)))
        logging.debug(f"RMS 값: {rms:.4f}, 버퍼 길이: {len(audio_buffer)}")

        if rms > silence_threshold:
            logging.debug("🍗 음성 감지 중...")
            socketio.emit('speech_detected', {'status': 'speaking'}, namespace='/')
            audio_buffer.append(audio_data)
            last_speech_time = time.time()

            # 버퍼가 너무 길어지면 강제로 처리
            if len(audio_buffer) >= max_buffer_count:
                logging.info("버퍼 길이가 너무 깁니다. 강제로 텍스트 변환 시도")
                last_speech_time = time.time() - silence_duration - 1
        elif time.time() - last_speech_time > silence_duration and audio_buffer:
            if not gpt_processing:
                logging.info("🔁 말 중단 감지 → 텍스트 변환 시도")
                socketio.emit('speech_stopped', {'status': 'silent'}, namespace='/')

                is_tts_playing = True
                full_audio = b''.join(audio_buffer)
                audio_buffer.clear()  # 버퍼 초기화

                try:
                    # raw PCM 데이터를 WAV 파일 형식으로 변환
                    wav_io = BytesIO()
                    with wave.open(wav_io, "wb") as wf:
                        wf.setnchannels(CHANNELS)
                        wf.setsampwidth(p.get_sample_size(FORMAT))
                        wf.setframerate(RATE)
                        wf.writeframes(full_audio)
                    wav_io.seek(0)

                    # 임시 파일 생성: API가 파일 객체의 name 속성을 참조하므로 NamedTemporaryFile 사용
                    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
                        tmp.write(wav_io.getvalue())
                        tmp.seek(0)
                        result = openai.Audio.transcribe("whisper-1", tmp, language="ko", temperature=0)
                    text = result["text"].strip()

                    if text:
                        logging.info(f"📝 텍스트 변환 완료: {text}")
                        gpt_processing = True
                        Thread(target=get_gpt_response, args=(text, child_id), daemon=True).start()
                    else:
                        logging.info("⚠️ 음성에서 텍스트를 추출하지 못했습니다. 인식을 재개합니다.")
                        is_tts_playing = False
                except Exception as e:
                    logging.error(f"❌ 텍스트 변환 중 오류: {e}")
                    is_tts_playing = False
            else:
                audio_buffer.clear()  # GPT 처리 중일 때도 버퍼 비우기

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

        # 대화 이력 10개까지만 유지
        if len(conversation_history) > 10:
            conversation_history = conversation_history[-10:]

        logging.info(f"🤝 GPT에 질문: {user_input}")
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=conversation_history,
            max_tokens=500
        )

        gpt_reply = response.choices[0].message['content'].strip()
        logging.info(f"🤖 GPT 응답: {gpt_reply}")
        conversation_history.append({"role": "assistant", "content": gpt_reply})

        if not is_summary:
            is_tts_playing = True
            audio_base64 = text_to_speech(gpt_reply)
            socketio.emit('gpt_response', {'response': gpt_reply, 'audio': audio_base64}, namespace='/')
        else:
            logging.info("✅ 요약 완료 (클라이언트로 전송하지 않음)")
            return gpt_reply

    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")
    finally:
        gpt_processing = False
        socketio.emit('gpt_ready', {'status': 'ready'}, namespace='/')


def stop_recognition(child_id, schedule_id=None):
    global keep_listening, conversation_history
    keep_listening = False
    logging.info("🔁 음성 인식 중단")

    child_info = get_child_info(child_id)
    if child_info:
        summary_prompt = f"""
                You are a speech therapist reviewing a conversation with a child who is {child_info['child_age']} years old and has {child_info['disability_type']}.
                Please summarize the conversation from a speech therapist’s perspective in **3 concise sentences**. Focus on the child’s response style, speech and pronunciation, vocabulary use, and engagement, but do not list these points separately.
                Provide the summary in **Korean**, and keep the summary within **100 characters**.
                """

        # 요약 생성 및 저장
        summary = get_gpt_response(summary_prompt, child_id, is_summary=True)

        # schedule_id가 있는 경우 treatment 테이블에 저장
        if schedule_id:
            treatment = Schedule.query.filter_by(treatment_id=schedule_id).first()
            if treatment:
                treatment.conversation = summary
                flag_modified(treatment, "conversation")  # 변경 사항 강제 감지
                db.session.commit()
                logging.info(f"✅ treatment_id {schedule_id}에 요약 저장 완료: {summary}")
            else:
                logging.warning(f"❌ treatment_id {schedule_id}에 해당하는 치료 정보를 찾을 수 없습니다.")

    socketio.emit('session_end', {'message': '대화가 종료되었습니다.'}, namespace='/')
    initialize_conversation(child_id)
    logging.info("✅ 대화 종료 후 리소스 정리 완료.")


@socketio.on('tts_finished', namespace='/')
def handle_tts_finished():
    global is_tts_playing, current_child_id, is_recognizing, keep_listening
    is_tts_playing = False
    logging.info("TTS 재생 완료 이벤트 수신: 음성 인식 재개됨")
    keep_listening = True
    Thread(target=recognize_audio, args=(current_child_id,), daemon=True).start()
