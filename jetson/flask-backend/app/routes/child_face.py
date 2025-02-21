from flask import Blueprint, jsonify, request
from app.services.child_face_recognition import register_child_face, verify_child_face
from flask_cors import CORS  # ✅ CORS 적용

child_face_bp = Blueprint("child_face", __name__)
CORS(child_face_bp)  # ✅ Blueprint 전체에 CORS 적용

@child_face_bp.route("/child/face-regist", methods=["POST"])
def child_face_regist():
    """ 아동 Face ID 등록 API """
    print("[DEBUG] 요청 받음")  # 요청 도착 여부 확인
    data = request.get_json()
    print(f"[DEBUG] 요청 데이터: {data}")

    if not data:
        return jsonify({"status": 400, "message": "요청 데이터가 비어 있습니다."}), 400

    child_id = data.get("child_id")
    child_name = data.get("child_name")

    if child_id is None or not isinstance(child_id, int):
        print(f"[ERROR] child_id 값이 올바르지 않음: {child_id}")
        return jsonify({"status": 400, "message": "올바른 child_id(int)가 필요합니다."}), 400

    if not child_name or not isinstance(child_name, str):
        print(f"[ERROR] child_name 값이 올바르지 않음: {child_name}")
        return jsonify({"status": 400, "message": "올바른 child_name(str)이 필요합니다."}), 400

    result = register_child_face(child_id, child_name)  # ✅ 인자 추가
    return jsonify(result), result["status"]

@child_face_bp.route("/child/face-choice", methods=["POST"])
def child_face_choice():
    """ 아동 Face ID 로그인 API (child_id 없이 얼굴 자동 매칭) """
    print("[DEBUG] 얼굴 로그인 요청 받음")
    result = verify_child_face()

    if "child_id" in result:
        result["child_id"] = int(result["child_id"])

    return jsonify(result), result["status"]
