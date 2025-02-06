from flask import Blueprint, jsonify, request, session
import threading
from app.services.speech_service import recognize_audio, stop_recognition, is_recognizing, initialize_conversation

speech_bp = Blueprint('speech', __name__)

# 대화 상태 플래그
conversation_started = False


@speech_bp.route('/play/talk-start', methods=['POST'])
def start_recognition():
    global conversation_started, keep_listening
    child_name = session.get('selected_child', {}).get('child_name')
    print(f"Child Name: {child_name}")
    # 대화가 시작되지 않았다면 인사말 반환 후 음성 인식 시작
    if not conversation_started:
        conversation_started = True
        initialize_conversation()  # 대화 초기화 및 인사말 설정

        # 인사말을 클라이언트로 전송
        greeting_message = f"{child_name}아, 안녕! 준비가 되면 말을 시작해봐."
        threading.Thread(target=recognize_audio, daemon=True).start()  # 인사말 후 바로 음성 인식 시작
        return jsonify({"message": greeting_message, "status": "recognition started"}), 200

    # 음성 인식이 이미 실행 중인 경우
    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    # 음성 인식 시작
    keep_listening = True
    threading.Thread(target=recognize_audio, daemon=True).start()
    return jsonify({"status": "recognition started"}), 200


@speech_bp.route('/play/talk-stop', methods=['POST'])
def stop_recognition_route():
    global conversation_started

    # 음성 인식 중지
    stop_recognition()
    conversation_started = False  # 대화 종료 시 상태 초기화
    return jsonify({"status": "recognition stopped"}), 200
