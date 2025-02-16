from flask import Blueprint, request, jsonify
from services.detect_object import process_detected_object

detect_bp = Blueprint('detect', __name__)

@detect_bp.route('/play/camera-scan', methods=['POST'])
def receive_detected_object():
    """
    React에서 보낸 scheduleId와 word를 받아 처리하는 API
    - scheduleId는 내부적으로 사용
    - word(사물명)만 EC2로 전달
    """
    try:
        data = request.get_json()
        schedule_id = data.get('scheduleId')  # React에서 받은 scheduleId (내부적으로 사용)
        word = data.get('word')  # React에서 받은 word

        if schedule_id is None or word is None:
            return jsonify({"error": "scheduleId 또는 word 값이 없습니다."}), 400

        print(f"📥 React에서 받은 데이터 - scheduleId: {schedule_id}, word: {word}")

        # 🔹 EC2로 word만 전달 (scheduleId는 사용 X)
        response = process_detected_object(word)

        # 🔹 Flask에서 scheduleId를 활용하는 경우 (예: DB 저장, 로깅)
        # (현재는 EC2로 안 넘기지만, 필요하면 여기에 추가 가능)

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"서버 오류 발생: {str(e)}"}), 500
