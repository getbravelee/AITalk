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
    silence_threshold = 0.01    # 주변 소음 감지를 줄이기 위해 임계치 설정
    silence_duration = 1.0      # 침묵으로 간주할 시간
    last_speech_time = time.time()

    logging.info("🎤 음성 인식 시작")

    # keep_listening이 True인 동안 계속 음성을 수집합니다.
    while keep_listening:
        # 일정 시간 동안 오디오 프레임을 읽음
        frames = [stream.read(CHUNK, exception_on_overflow=False)
                  for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]
        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # 소음 임계치를 초과하면 음성이 감지되었다고 판단
        if np.abs(audio_np).mean() > silence_threshold:
            logging.debug("🎙 음성 감지 중...")
            audio_buffer.append(audio_data)
            last_speech_time = time.time()
        # 일정 시간 침묵이 지속되고 버퍼에 데이터가 있으면 전사를 시도
        elif time.time() - last_speech_time > silence_duration and audio_buffer:
            # 이미 GPT 요청이 진행 중이면 이번 입력은 무시하고 버퍼를 초기화
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
                        # GPT 처리를 위한 플래그 설정 후 별도 스레드에서 처리
                        gpt_processing = True
                        Thread(target=get_gpt_response, args=(text,), daemon=True).start()
                except Exception as e:
                    logging.error(f"❌ 텍스트 변환 중 오류: {e}")
            else:
                # GPT 요청 진행 중이면 버퍼를 비워 추가 입력 무시
                audio_buffer = []
        # 너무 빠른 루프를 피하기 위해 약간 휴식
        time.sleep(0.01)

    stream.stop_stream()
    stream.close()
    p.terminate()
    logging.info("🛑 음성 인식 종료")
    with recognition_lock:
        is_recognizing = False


def get_gpt_response(user_input):
    global gpt_processing
    try:
        logging.info(f"🧠 GPT에 질문: {user_input}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}],
            max_tokens=150
        )
        logging.debug(f"GPT 원시 응답: {response}")

        try:
            gpt_reply = response.choices[0].message['content'].strip()
        except AttributeError:
            gpt_reply = response.choices[0].text.strip()

        logging.info(f"🤖 GPT 응답: {gpt_reply}")
        socketio.emit('gpt_response', {'response': gpt_reply}, namespace='/')
    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")
    finally:
        # GPT 처리가 끝나면 플래그 리셋하여 다음 입력을 받을 수 있도록 함
        gpt_processing = False


def stop_recognition():
    global keep_listening
    keep_listening = False   # while 루프가 종료됨
    logging.info("🛑 음성 인식 중단")
    # 종료 시 대화 요약 요청 (새로운 인식은 재시작하지 않음)
    summary_prompt = "우리 대화한 대화내용 요약해서 알려줘"
    get_gpt_response(summary_prompt)
