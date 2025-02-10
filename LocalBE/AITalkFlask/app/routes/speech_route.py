from flask import Blueprint, jsonify, request
import threading
from app.services.speech_service import (
    recognize_audio,
    stop_recognition,
    is_recognizing,
    initialize_conversation,
    get_child_info,
)
from gtts import gTTS
import base64
from io import BytesIO

speech_bp = Blueprint('speech', __name__)

# 대화 상태 플래그 및 현재 대화 중인 아동 ID
conversation_started = False
current_child_id = None

def text_to_speech(text):
    tts = gTTS(text, lang='ko')
    audio_data = BytesIO()
    tts.write_to_fp(audio_data)
    audio_data.seek(0)
    return base64.b64encode(audio_data.read()).decode('utf-8')

@speech_bp.route('/play/talk-start', methods=['POST'])
def start_recognition_route():
    global conversation_started, keep_listening, is_tts_playing, current_child_id

    data = request.get_json()
    child_id = data.get('childId')
    child_info = get_child_info(child_id)

    if not child_info:
        return jsonify({"error": "Child not found"}), 404

    # 처음 대화 시작 시, 인사말(TTS) 전송 후 음성 인식은 클라이언트의 tts_finished 이벤트 후 시작
    if not conversation_started:
        conversation_started = True
        initialize_conversation(child_id)

        is_tts_playing = True      # 인사말 TTS 재생 중임을 표시
        current_child_id = child_id # 현재 아동 ID 저장

        greeting_message = f"{child_info['child_name']}아, 안녕! 준비가 되면 말을 시작해봐."
        audio_base64 = text_to_speech(greeting_message)

        # 클라이언트는 인사말 재생 후 tts_finished 이벤트를 통해 음성 인식을 재개합니다.
        return jsonify({
            "message": greeting_message,
            "audio": audio_base64,
        }), 200

    # 이미 음성 인식 중이면 중복 실행 방지
    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    # 대화가 이미 시작된 경우 별도 요청으로 음성 인식을 시작
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

    stop_recognition(child_id)
    conversation_started = False  # 대화 종료 시 상태 초기화
    return jsonify({"status": "recognition stopped"}), 200
