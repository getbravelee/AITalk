from flask import Blueprint, session, jsonify

# 블루프린트 생성
session_bp = Blueprint('session_bp', __name__)

@session_bp.route('/session/clear', methods=['POST'])
def clear_session():
    """
    카드 놀이 종료 후 세션 클리어
    """
    session.clear()  # 세션 클리어
    print("세션이 초기화되었습니다.")  # 서버 로그에 표시
    return jsonify({"message": "세션 초기화 완료"}), 200
