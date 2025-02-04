from flask import Blueprint, session, jsonify

# 블루프린트 생성
session_bp = Blueprint('session_bp', __name__)

@session_bp.route('/session/clear', methods=['POST'])
def clear_session():
    """
    현재 세션의 모든 데이터를 삭제하고 성공 메시지를 반환하는 API.
    """
    session.clear()  # 세션 클리어
    print("세션이 초기화되었습니다.")  # 서버 로그에 표시
    return jsonify({"message": "세션이 성공적으로 초기화되었습니다."}), 200
