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

# OpenAI API 설정
openai.api_key = os.getenv("OPENAI_API_KEY")


def recognize_audio():
    global is_recognizing

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
    silence_threshold = 0.002
    silence_duration = 1.0
    last_speech_time = time.time()

    logging.info("🎤 음성 인식 시작")

    while is_recognizing:
        frames = [stream.read(CHUNK, exception_on_overflow=False) for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]
        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        if np.abs(audio_np).mean() > silence_threshold:
            logging.debug("🎙 음성 감지 중...")
            audio_buffer.append(audio_data)
            last_speech_time = time.time()
        elif time.time() - last_speech_time > silence_duration and audio_buffer:
            logging.info("🛑 말 중단 감지 → 텍스트 변환 시도")
            full_audio = b''.join(audio_buffer)
            audio_buffer = []

            try:
                audio_np = np.frombuffer(full_audio, dtype=np.int16).astype(np.float32) / 32768.0
                result = model.transcribe(audio_np, language="korean", temperature=0)
                text = result["text"].strip()

                if text:
                    logging.info(f"📝 텍스트 변환 완료: {text}")
                    socketio.start_background_task(target=socketio.emit, event='recognized_text', data={'text': text})

                    # GPT 응답 처리
                    get_gpt_response(text)

            except Exception as e:
                logging.error(f"❌ 텍스트 변환 중 오류: {e}")

    stream.stop_stream()
    stream.close()
    p.terminate()
    logging.info("🛑 음성 인식 종료")


def get_gpt_response(user_input):
    global is_recognizing
    try:
        logging.info(f"🧠 GPT에 질문: {user_input}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}],
            max_tokens=150
        )

        logging.debug(f"GPT 원시 응답: {response}")  # 응답 구조 확인

        # 응답 처리
        try:
            gpt_reply = response.choices[0].message['content'].strip()
        except AttributeError:
            gpt_reply = response.choices[0].text.strip()

        logging.info(f"🤖 GPT 응답: {gpt_reply}")

        socketio.emit('gpt_response', {'response': gpt_reply}, namespace='/')

        # GPT 응답 후 음성 인식 재개
        with recognition_lock:
            is_recognizing = True

        Thread(target=recognize_audio, daemon=True).start()

    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")


def stop_recognition():
    global is_recognizing
    with recognition_lock:
        is_recognizing = False
    logging.info("🛑 음성 인식 중단")
