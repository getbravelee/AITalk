from flask import Blueprint, request, jsonify
from app.services.play_start_service import create_treatment

play_start_bp = Blueprint('play_start', __name__)

@play_start_bp.route('/play-start', methods=['POST'])
def play_start():
    data = request.get_json()

    # 요청 데이터 검증
    therapist_id = data.get('therapistId')
    child_id = data.get('childId')

    if therapist_id is None or child_id is None:
        return jsonify({"error": "therapist_id와 child_id는 필수 항목입니다."}), 400

    # 서비스 로직 호출
    treatment_id = create_treatment(therapist_id, child_id)

    return jsonify({"treatmentId": treatment_id}), 200
