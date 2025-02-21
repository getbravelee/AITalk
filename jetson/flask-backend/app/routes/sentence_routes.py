from flask import Blueprint, request, jsonify
from app.services.sentence_service import generate_three_word_sentence

sentence_bp = Blueprint('sentence_bp', __name__)

@sentence_bp.route('/generate-sentence', methods=['POST'])
def generate_sentence():
    data = request.get_json()
    prompt = data.get('word')
    schedule_id = data.get('schedule_id')  # 스케줄 ID 추가

    if not prompt:
        return jsonify({"error": "word is required"}), 400

    sentence_data = generate_three_word_sentence(schedule_id, prompt)

    if sentence_data:
        return jsonify(sentence_data), 200
    else:
        return jsonify({"error": "Failed to generate sentence"}), 500
