from flask import Blueprint, jsonify, request
from app.services.therapist_login_service import get_card_info_after_tagging
from app.services.login_service import login_user

login_bp = Blueprint('login_bp', __name__)

# 언어치료사 카드 태깅 로그인 코드
@login_bp.route('/user/card-login', methods=['POST'])
def read_nfc_and_get_card():
    therapist_info, status_code = get_card_info_after_tagging()
    return jsonify(therapist_info), status_code

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('id')
    password = data.get('password')

    if not user_id or not password:
        return jsonify({'message': 'ID와 비밀번호를 입력하세요.'}), 400

    user = login_user(user_id, password)
    if user:
        return jsonify({
            'message': '로그인 성공',
            'therapistId': user.therapist_id,
            'therapistName': user.therapist_name  # 이름 필드 추가
        }), 200
    else:
        return jsonify({'message': 'ID 또는 비밀번호가 올바르지 않습니다.'}), 401
