from flask import Blueprint, jsonify, request
from app.services.user_face_recognition import register_user_face, verify_user_face
from flask_cors import CORS  # ✅ CORS 전체 적용
# from app.services.user_face_recognition import FaceAuthSystem
#
# face_auth = FaceAuthSystem()
# res_reg = face_auth.register_user_face(1, "Dr. Kim")
# res_ver = face_auth.verify_user_face()

user_face_bp = Blueprint("user_face", __name__)
CORS(user_face_bp)  # ✅ Blueprint 전체에 CORS 적용

# @user_face_bp.before_request
# def before_request():
#     """ 모든 요청이 Flask에 도착하는지 로깅 """
#     print(f"[REQUEST] {request.method} {request.url}")
#     print(f"Headers: {dict(request.headers)}")
#     print(f"Body: {request.get_data(as_text=True)}")


@user_face_bp.route("/user/face-regist", methods=["POST"])
# @cross_origin()  # ✅ CORS 문제 해결
def user_face_regist():
    """ React에서 therapist_id와 therapist_name을 받아 Face ID 등록 """

    print("[DEBUG] 요청 받음")  # 요청 도착 여부 확인
    data = request.get_json()

    # ✅ 요청 데이터 디버깅 로그 추가
    print(f"[DEBUG] 요청 데이터: {data}")

    if not data:
        return jsonify({"status": 400, "message": "요청 데이터가 비어 있습니다."}), 400

    therapist_id = data.get("therapist_id")
    therapist_name = data.get("therapist_name")  # ✅ therapist_name으로 변경

    # ✅ therapist_id와 therapist_name 값이 제대로 들어왔는지 확인
    if therapist_id is None or not isinstance(therapist_id, int):
        print(f"[ERROR] therapist_id가 올바르지 않음: {therapist_id}")
        return jsonify({"status": 400, "message": "올바른 therapist_id(int)가 필요합니다."}), 400

    if not therapist_name or not isinstance(therapist_name, str):
        print(f"[ERROR] therapist_name 값이 올바르지 않음: {therapist_name}")
        return jsonify({"status": 400, "message": "올바른 therapist_name(str)이 필요합니다."}), 400

    result = register_user_face(therapist_id, therapist_name)  # ✅ therapist_name 포함하여 등록
    return jsonify(result), result["status"]

@user_face_bp.route("/user/face-login", methods=["POST"])
def user_face_login():
    """ 유저 Face ID 로그인 API (therapist_id 없이 얼굴로 자동 매칭) """

    result = verify_user_face()  # therapist_id 없이 얼굴 비교

    if "therapist_id" in result:
        result["therapist_id"] = int(result["therapist_id"])  # ✅ NumPy int64 → Python int 변환

    return jsonify(result), result["status"]
# @user_face_bp.route("/user/face-login", methods=["POST"])
# def user_face_login():
#     """ 유저 Face ID 로그인 API """
#     try:
#         print("[DEBUG] 얼굴 로그인 요청 받음", flush=True)
#
#         print("[DEBUG] 얼굴 인증 진행 중...", flush=True)
#         result = verify_user_face()  # ✅ 얼굴 인식 수행 (토큰 필요 없음)
#         print(f"[DEBUG] 얼굴 인증 결과: {result}", flush=True)
#
#         if not isinstance(result, dict):
#             print(f"[ERROR] 서버에서 올바르지 않은 응답 반환: {result}", flush=True)
#             return jsonify({"status": 500, "message": "서버 오류: 예상치 못한 응답 형식"}), 500
#
#         return jsonify(result), result.get("status", 500)
#
#     except Exception as e:
#         print(f"[ERROR] 얼굴 로그인 중 오류 발생: {e}", flush=True)
#         return jsonify({"status": 500, "message": str(e)}), 500
