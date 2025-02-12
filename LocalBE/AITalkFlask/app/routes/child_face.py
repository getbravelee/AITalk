from flask import Blueprint, jsonify, request
from app.services.child_face_recognition import register_child_face, verify_child_face

child_face_bp = Blueprint("child_face", __name__)

@child_face_bp.route("/child/face-regist", methods=["POST"])
def child_face_regist():
    """ 아동 Face ID 등록 API """
    # data = request.get_json()
    # child_id = data.get("childId")
    #
    # if not child_id:
    #     return jsonify({"status": 400, "message": "childId가 필요합니다."}), 400

    result = register_child_face()
    return jsonify(result), result["status"]

@child_face_bp.route("/child/face-choice", methods=["POST"])
def child_face_choice():
    """ 아동 Face ID 선택 API """
    result = verify_child_face()
    return jsonify(result), result["status"]
