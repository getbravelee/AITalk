from flask import Blueprint, jsonify, Response
import app.services.detect_objects as detect_objects  # 감지 모듈 import

detect_bp = Blueprint('detect', __name__)  # Blueprint 등록

@detect_bp.route("/detect")
def detect():
    """ 감지된 객체 정보를 JSON으로 반환 """
    detected_objects = detect_objects.get_detected_objects()
    return jsonify(detected_objects)

@detect_bp.route("/video")
def video_feed():
    """ 웹캠 실시간 스트리밍 """
    return Response(detect_objects.generate_video_frames(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")
