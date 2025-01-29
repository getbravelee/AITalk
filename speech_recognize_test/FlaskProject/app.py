from flask import Flask, jsonify
import pyaudio
import numpy as np
import whisper
# ... other imports

app = Flask(__name__)
model = whisper.load_model("small")

def recognize_audio():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    RECORD_SECONDS = 5

    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("Listening...")

    frames = []

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    print("Finished listening.")

    stream.stop_stream()
    stream.close()
    p.terminate()

    audio_data = b''.join(frames)
    audio_np = np.frombuffer(audio_data, dtype=np.int16)

    if len(audio_np) == 0:
        return "No audio captured."

    audio_np = audio_np.astype(np.float32) / np.iinfo(audio_np.dtype).max

    print("Audio shape:", audio_np.shape)
    print("Audio dtype:", audio_np.dtype)

    try:
        text = model.transcribe(audio_np)
        return text["text"]
    except Exception as e:
        return f"Error during transcription: {e}"

@app.route('/recognize', methods=['GET'])
def recognize():
    text = recognize_audio()  # Call directly; no threading

    return jsonify({"recognized_text": text})

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)