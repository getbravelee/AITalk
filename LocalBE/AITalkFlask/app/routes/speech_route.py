from flask import Blueprint, jsonify, request, session
import threading
from app.services.speech_service import (
    recognize_audio,
    stop_recognition,
    is_recognizing,
    initialize_conversation,
    get_child_info,
    keep_listening,
    is_tts_playing
)
from app.models import Schedule  # ✅ 추가
from app.extensions import db
from sqlalchemy.orm.attributes import flag_modified  # ✅ 변경 사항 감지용 추가
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

    if child_id:
        child_info = get_child_info(child_id)
        if not child_info:
            return jsonify({"error": "Child not found"}), 404
        greeting_message = f"{child_info['child_name']}아, 안녕! 준비가 되면 말을 시작해봐."
    else:
        greeting_message = "안녕! 준비가 되면 말을 시작해봐."

    if not conversation_started:
        conversation_started = True
        if child_id:
            initialize_conversation(child_id)
            current_child_id = child_id

        is_tts_playing = True
        audio_base64 = text_to_speech(greeting_message)

        return jsonify({
            "message": greeting_message,
            "audio": audio_base64,
        }), 200

    if is_tts_playing:
        return jsonify({"status": "TTS 재생 중, 음성 인식 대기중"}), 200

    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    keep_listening = True
    if child_id:
        threading.Thread(target=recognize_audio, args=(child_id,), daemon=True).start()

    return jsonify({"status": "recognition started"}), 200


@speech_bp.route('/play/talk-stop', methods=['POST'])
def stop_recognition_route():
    global conversation_started
    data = request.get_json()
    child_id = data.get('childId')
    schedule_id = data.get('scheduleId')  # ✅ schedule_id 받기

    child_info = get_child_info(child_id)

    if not child_info:
        return jsonify({"error": "Child not found"}), 404

    stop_recognition(child_id, schedule_id)  # ✅ schedule_id 전달
    conversation_started = False
    return jsonify({"status": "recognition stopped"}), 200