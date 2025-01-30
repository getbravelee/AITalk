from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
import pyaudio
import numpy as np
import whisper
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
model = whisper.load_model("large")  # 더 정확한 모델 사용

is_recognizing = False  # 음성 인식 활성화 여부


def recognize_audio():
    global is_recognizing

    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    RECORD_SECONDS = 0.5  # 짧게 설정하여 실시간 분석

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("🎤 실시간 음성 인식 시작...")

    audio_buffer = []  # 음성 데이터를 저장할 리스트
    silence_threshold = 0.002  # 무음 감지 기준
    silence_duration = 1.0  # 사용자가 말 안 할 경우 변환하는 시간
    last_speech_time = time.time()

    while is_recognizing:
        frames = []
        for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK, exception_on_overflow=False)
            frames.append(data)

        audio_data = b''.join(frames)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # 🔹 음성이 있는지 감지 (너무 작은 소리는 무음으로 간주)
        if np.abs(audio_np).mean() > silence_threshold:
            print("🎙 음성 감지됨, 녹음 중...")
            audio_buffer.append(audio_data)
            last_speech_time = time.time()  # 마지막으로 말을 한 시점 저장
        else:
            # 사용자가 1초 이상 말하지 않으면 변환
            if time.time() - last_speech_time > silence_duration and audio_buffer:
                print("🛑 말 끝남 → 텍스트 변환 시작...")

                full_audio = b''.join(audio_buffer)
                audio_buffer = []  # 버퍼 초기화

                # 음성 데이터를 Whisper로 변환
                try:
                    audio_np = np.frombuffer(full_audio, dtype=np.int16).astype(np.float32) / 32768.0
                    result = model.transcribe(audio_np, language="korean", temperature=0)  # 더 정확한 변환
                    text = result["text"].strip()

                    if text:
                        print(f"📝 변환된 텍스트: {text}")
                        socketio.emit('recognized_text', {'text': text})  # React로 전송
                except Exception as e:
                    print("❌ 오류 발생:", str(e))

    stream.stop_stream()
    stream.close()
    p.terminate()
    print("🛑 음성 인식 종료")


@app.route('/start-recognition', methods=['POST'])
def start_recognition():
    global is_recognizing

    if is_recognizing:
        return jsonify({"status": "already running"})

    is_recognizing = True
    threading.Thread(target=recognize_audio, daemon=True).start()
    return jsonify({"status": "started"})


@app.route('/stop-recognition', methods=['POST'])
def stop_recognition():
    global is_recognizing
    is_recognizing = False
    return jsonify({"status": "stopped"})


if __name__ == '__main__':
    socketio.run(app, host="localhost", port=5000, debug=True)
