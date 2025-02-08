from flask import Blueprint, jsonify, request
import threading
from app.services.speech_service import recognize_audio, stop_recognition, is_recognizing, initialize_conversation, get_child_info
from gtts import gTTS
import base64
from io import BytesIO

speech_bp = Blueprint('speech', __name__)

# 대화 상태 플래그
conversation_started = False

# 텍스트를 음성으로 변환하는 함수
def text_to_speech(text):
    tts = gTTS(text, lang='ko')
    audio_data = BytesIO()
    tts.write_to_fp(audio_data)
    audio_data.seek(0)
    audio_base64 = base64.b64encode(audio_data.read()).decode('utf-8')
    return audio_base64

@speech_bp.route('/play/talk-start', methods=['POST'])
def start_recognition():
    global conversation_started, keep_listening

    data = request.get_json()
    child_id = data.get('childId')
    child_info = get_child_info(child_id)

    if not child_info:
        return jsonify({"error": "Child not found"}), 404

    # 대화가 시작되지 않았다면 인사말 반환 후 음성 인식 시작
    if not conversation_started:
        conversation_started = True
        initialize_conversation(child_id)  # 대화 초기화 및 인사말 설정

        # 인사말을 클라이언트로 전송
        greeting_message = f"{child_info['child_name']}아, 안녕! 준비가 되면 말을 시작해봐."
        audio_base64 = text_to_speech(greeting_message)

        threading.Thread(target=recognize_audio, args=(child_id,), daemon=True).start()  # 인사말 후 바로 음성 인식 시작
        return jsonify({
            "message": greeting_message,
            "audio": audio_base64,
        }), 200

    # 음성 인식이 이미 실행 중인 경우
    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    # 음성 인식 시작
    keep_listening = True
    threading.Thread(target=recognize_audio, args=(child_id,), daemon=True).start()
    return jsonify({"status": "recognition started"}), 200

@speech_bp.route('/play/talk-stop', methods=['POST'])
def stop_recognition_route():
    global conversation_started

    data = request.get_json()
    child_id = data.get('childId')
    child_info = get_child_info(child_id)

    if not child_info:
        return jsonify({"error": "Child not found"}), 404

    # 음성 인식 중지
    stop_recognition(child_id)
    conversation_started = False  # 대화 종료 시 상태 초기화
    return jsonify({"status": "recognition stopped"}), 200
