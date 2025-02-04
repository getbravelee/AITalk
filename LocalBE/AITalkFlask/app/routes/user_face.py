from flask import Blueprint, jsonify, request
from app.services.user_face_recognition import register_user_face, verify_user_face

user_face_bp = Blueprint("user_face", __name__)

@user_face_bp.route("/user/face-regist", methods=["POST"])
def user_face_regist():
    """ 유저 Face ID 등록 API """
    data = request.get_json()
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"status": 400, "message": "userId가 필요합니다."}), 400

    result = register_user_face(user_id)
    return jsonify(result), result["status"]

@user_face_bp.route("/user/face-login", methods=["POST"])
def user_face_login():
    """ Face ID 로그인 API """
    result = verify_user_face()
    return jsonify(result), result["status"]
