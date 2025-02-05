import logging
import pyaudio
import numpy as np
import whisper
import time
import openai
from threading import Lock, Thread
import os
from app.extensions import socketio
from dotenv import load_dotenv

load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Whisper 모델 로드
model = whisper.load_model("large")

# 음성 인식 상태 변수 및 Lock
is_recognizing = False
recognition_lock = Lock()
keep_listening = True      # 음성 인식을 계속할지 여부
gpt_processing = False     # 현재 GPT 요청을 처리 중인지 여부

# OpenAI API 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# 초기 시스템 프롬프트 (대화 상황 설정)
initial_system_prompt = (
    "너는 언어치료사이고, 너는 발달지연장애를 가지고 있는 6세 아동과 대화를 통해 언어 치료를 하고 있다. "
    "말을 이끌어내야 하기에 주도적으로 대화를 해줘, 폐쇄형 답변을 유도하는 질문으로 해줘 "
)

# 대화 내역 저장 (초기 시스템 프롬프트 포함)
conversation_history = [
    {"role": "system", "content": initial_system_prompt}
]

def recognize_audio():
    global is_recognizing, keep_listening, gpt_processing

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
    silence_threshold = 0.01    # 소음 임계치
    silence_duration = 1.0      # 침묵으로 간주할 시간
    last_speech_time = time.time()

    logging.info("🎤 음성 인식 시작")

    while keep_listening:
        # 일정 시간 동안 오디오 프레임 읽기
        frames = [stream.read(CHUNK, exception_on_overflow=False)
                  for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]
        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        if np.abs(audio_np).mean() > silence_threshold:
            logging.debug("🎙 음성 감지 중...")
            audio_buffer.append(audio_data)
            last_speech_time = time.time()
        elif time.time() - last_speech_time > silence_duration and audio_buffer:
            if not gpt_processing:
                logging.info("🛑 말 중단 감지 → 텍스트 변환 시도")
                full_audio = b''.join(audio_buffer)
                audio_buffer = []  # 버퍼 초기화

                try:
                    audio_np = np.frombuffer(full_audio, dtype=np.int16).astype(np.float32) / 32768.0
                    result = model.transcribe(audio_np, language="korean", temperature=0)
                    text = result["text"].strip()

                    if text:
                        logging.info(f"📝 텍스트 변환 완료: {text}")
                        socketio.emit('recognized_text', {'text': text}, namespace='/')
                        # GPT 요청을 별도 스레드로 처리
                        gpt_processing = True
                        Thread(target=get_gpt_response, args=(text,), daemon=True).start()
                except Exception as e:
                    logging.error(f"❌ 텍스트 변환 중 오류: {e}")
            else:
                audio_buffer = []
        time.sleep(0.01)

    stream.stop_stream()
    stream.close()
    p.terminate()
    logging.info("🛑 음성 인식 종료")
    with recognition_lock:
        is_recognizing = False

def get_gpt_response(user_input):
    global gpt_processing, conversation_history
    try:
        # 사용자 입력을 대화 내역에 추가
        conversation_history.append({"role": "user", "content": user_input})
        logging.info(f"🧠 GPT에 질문: {user_input}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=conversation_history,
            max_tokens=150
        )
        logging.debug(f"GPT 원시 응답: {response}")

        try:
            gpt_reply = response.choices[0].message['content'].strip()
        except AttributeError:
            gpt_reply = response.choices[0].text.strip()

        logging.info(f"🤖 GPT 응답: {gpt_reply}")
        conversation_history.append({"role": "assistant", "content": gpt_reply})
        socketio.emit('gpt_response', {'response': gpt_reply}, namespace='/')
    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")
    finally:
        gpt_processing = False

def stop_recognition():
    global keep_listening, conversation_history
    keep_listening = False   # 음성 인식 루프 종료
    logging.info("🛑 음성 인식 중단")
    # 요약 요청
    summary_prompt = "우리 대화한 대화내용 요약해서 알려줘"
    get_gpt_response(summary_prompt)
    # 요약 후 대화 내역 초기화 (시스템 프롬프트 다시 포함)
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": initial_system_prompt})
