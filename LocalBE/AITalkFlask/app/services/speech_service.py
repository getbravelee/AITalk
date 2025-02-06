from flask import session, current_app
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

# 대화 내역 저장 (초기 시스템 프롬프트 포함)
conversation_history = []


def initialize_conversation():
    with current_app.app_context():
        child_name = session.get('selected_child', {}).get('child_name')
        child_age = session.get('selected_child', {}).get('child_age')
        child_disability_type = session.get('selected_child', {}).get('disability_type')
        print(session)
        print(child_name)
        print(child_age)
        print(child_disability_type)

        initial_system_prompt = f"""
        You are a language therapy chatbot designed for a child who is {child_age} years old and has {child_disability_type}.
        Your goal is to encourage the child to speak more by asking **simple, closed-ended questions** (yes/no questions or offering simple choices), but do **not** instruct the child to answer only with "yes" or "no." Allow natural, flexible responses from the child.
        Since the child may have speech difficulties and might not pronounce words clearly, try to understand the meaning based on **context** even if the words sound incorrect. If the child's speech recognition is inaccurate, interpret it in the closest possible way to what they might have intended.
        Keep the questions simple and age-appropriate. Make sure to respond **in Korean**.
        Start with the first question: "오늘 기분이 좋아요?" (Are you feeling good today?)
        """

        conversation_history.clear()
        conversation_history.append({"role": "system", "content": initial_system_prompt})


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
    silence_threshold = 0.02  # 소음 임계치
    silence_duration = 1.0     # 친문으로 가정할 시간
    last_speech_time = time.time()

    logging.info("🎙 음성 인식 시작")

    while keep_listening:
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
                    audio_np = np.frombuffer(full_audio, dtype=np.int16).astype(np.float32) / 32768.0
                    result = model.transcribe(audio_np, language="korean", temperature=0)
                    text = result["text"].strip()

                    if text:
                        logging.info(f"📝 텍스트 변환 완료: {text}")
                        socketio.emit('recognized_text', {'text': text}, namespace='/')
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
    logging.info("🔁 음성 인식 종료")
    with recognition_lock:
        is_recognizing = False


def get_gpt_response(user_input):
    global gpt_processing, conversation_history
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
        socketio.emit('gpt_response', {'response': gpt_reply}, namespace='/')
    except Exception as e:
        logging.error(f"❌ GPT 요청 중 오류: {e}")
    finally:
        gpt_processing = False


def stop_recognition():
    global keep_listening, conversation_history
    keep_listening = False
    logging.info("🔁 음성 인식 중단")

    with current_app.app_context():
        child_age = session.get('selected_child', {}).get('child_age')
        child_disability_type = session.get('selected_child', {}).get('disability_type')

        summary_prompt = f"""
        You are a speech therapist reviewing a conversation with a child who is {child_age} years old and has {child_disability_type}.
        Please summarize the conversation from a speech therapist’s perspective in **3 concise sentences**. Focus on the child’s response style, speech and pronunciation, vocabulary use, and engagement, but do not list these points separately.
        Provide the summary in **Korean**.
        """
    get_gpt_response(summary_prompt)

    socketio.emit('session_end', {'message': '대화가 종료되었습니다.'}, namespace='/')

    # 대화 기록 초기화
    initialize_conversation()

    logging.info("✅ 대화 종료 후 리소스 정리 완료.")
