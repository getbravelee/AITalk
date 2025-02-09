from flask import Blueprint, request, jsonify
from app.services.sentence_service import generate_three_word_sentence

# Blueprint 생성
sentence_bp = Blueprint('sentence_bp', __name__)

# 3어절 문장 생성 API
@sentence_bp.route('/generate-sentence', methods=['POST'])
def generate_sentence():
    data = request.get_json()
    word = data.get('word')

    if not word:
        return jsonify({"error": "word is required"}), 400

    sentence = generate_three_word_sentence(word)

    if sentence:
        return jsonify({"sentence": sentence}), 200
    else:
        return jsonify({"error": "Failed to generate sentence"}), 500