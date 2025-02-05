from flask import Blueprint, jsonify, request
from app.services.user_face_recognition import register_user_face, verify_user_face

user_face_bp = Blueprint("user_face", __name__)


@user_face_bp.route("/user/face-regist", methods=["POST"])
def user_face_regist():

    # """ 유저 Face ID 등록 API """

    result = register_user_face() # therapistId를 JSON에서 받지 않고 내부에서 생성
    return jsonify(result), result["status"]

@user_face_bp.route("/user/face-login", methods=["POST"])
def user_face_login():
    """ Face ID 로그인 API """
    result = verify_user_face()
    return jsonify(result), result["status"]
