from flask import Blueprint, jsonify
import threading
from app.services.speech_service import recognize_audio, stop_recognition, is_recognizing

speech_bp = Blueprint('speech', __name__)

@speech_bp.route('/play/talk-start', methods=['POST'])
def start_recognition():
    global keep_listening
    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    keep_listening = True

    threading.Thread(target=recognize_audio, daemon=True).start()
    return jsonify({"status": "started"}), 200


@speech_bp.route('/play/talk-stop', methods=['POST'])
def stop_recognition_route():
    stop_recognition()
    return jsonify({"status": "stopped"}), 200
