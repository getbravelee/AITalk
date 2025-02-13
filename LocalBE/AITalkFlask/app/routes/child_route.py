from flask import Blueprint, jsonify, request, session
from app.services.child_choice_service import get_all_children

child_bp = Blueprint('child_bp', __name__)


# 아동 목록 조회 API
@child_bp.route('/child/list', methods=['POST'])
def list_children():
    data = request.get_json()  # JSON 데이터로 받기
    therapist_id = data.get('therapistId')

    if not therapist_id:
        return jsonify({'error': 'therapist_id is required'}), 400

    children = get_all_children(therapist_id)
    return jsonify(children), 200

