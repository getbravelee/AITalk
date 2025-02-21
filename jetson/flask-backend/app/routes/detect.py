from flask import Blueprint, request, jsonify
from app.services.detect_objects import generate_image

detect_bp = Blueprint('detect', __name__)

@detect_bp.route('/play/camera-scan', methods=['POST'])
def receive_detected_object():
    data = request.get_json()
    schedule_id = data.get('schedule_id')
    word = data.get("word")  # 명사 (예: cup)

    sentence_data = generate_image(word,schedule_id)

    if sentence_data:
        return jsonify(sentence_data), 200
    else:
        return jsonify({"error": "이미지 생성 실패"}), 500
