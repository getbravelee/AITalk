from flask import Blueprint, jsonify, Response, request
import app.services.detect_objects as detect_objects  # 감지 모듈 import

detect_bp = Blueprint('detect', __name__)  # Blueprint 등록

@detect_bp.route("/detect", methods=['POST'])
def detect():
    """ 감지된 객체 정보를 JSON으로 반환 """
    data = request.get_json()
    schedule_id = data.get('scheduleId')
    detected_objects = detect_objects.get_detected_objects(schedule_id)



    if not detected_objects:
        return jsonify({"status": "no_object", "data": []}), 200 # 감지되지 않음

    return jsonify({"status": "success", "data": detected_objects}), 200

@detect_bp.route("/video")
def video_feed():
    """ 웹캠 실시간 스트리밍 """
    return Response(detect_objects.generate_video_frames(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")
