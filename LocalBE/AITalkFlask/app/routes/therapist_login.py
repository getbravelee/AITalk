from flask import Blueprint, jsonify
from app.services.therapist_login_service import get_card_info_after_tagging

login_bp = Blueprint('login_bp', __name__)

# 언어치료사 카드 태깅 로그인 코드
@login_bp.route('/user/login', methods=['POST'])
def read_nfc_and_get_card():
    therapist_info, status_code = get_card_info_after_tagging()
    return jsonify(therapist_info), status_code
