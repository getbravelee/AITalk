from flask import Blueprint, jsonify, request, session
from app.models.child_model import Child
from app.services.child_choice_service import get_all_children

child_bp = Blueprint('child_bp', __name__)


# 아동 목록 조회 API
@child_bp.route('/child/list', methods=['GET'])
def list_children():
    children = get_all_children()
    return jsonify(children), 200


# 선택된 아동 정보를 세션에 저장하는 API
@child_bp.route('/child/select', methods=['POST'])
def select_child():
    data = request.get_json()
    child_id = data.get('child_id')

    if not child_id:
        return jsonify({'error': 'child_id is required'}), 400

    # child_id에 해당하는 아동 정보 조회
    child = Child.query.filter_by(child_id=child_id).first()
    if not child:
        return jsonify({'error': 'Child not found'}), 404

    # 선택한 아동 정보를 세션에 저장 (애플리케이션 설정에 SECRET_KEY가 필요)
    session['selected_child'] = {
        "child_id": child.child_id,
        "therapist_id": child.therapist_id,
        "child_name": child.child_name,
        "profile_image": child.profile_image,
        "disability_type": child.disability_type,
        "age": child.age
    }

    return jsonify({'message': 'Child selected successfully'}), 200
