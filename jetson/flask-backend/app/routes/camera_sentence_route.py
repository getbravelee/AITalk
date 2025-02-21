from flask import Blueprint, request, jsonify
from app.services.camera_sentence_service import generate_image

camera_sentence_bp = Blueprint('camera_sentence_bp', __name__)

@camera_sentence_bp.route('/generate-2sentence', methods=['POST'])
def generate_sentence():
    data = request.get_json()
    word = data.get("word")  # 명사 (예: cup)
    word2 = data.get("word2")  # 동사 (예: break)

    if not word or not word2:
        return jsonify({"error": "명사와 동사가 필요합니다"}), 400

    sentence_data = generate_image(word, word2)

    if sentence_data:
        return jsonify(sentence_data), 200
    else:
        return jsonify({"error": "이미지 생성 실패"}), 500
