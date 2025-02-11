import cv2
import numpy as np
from ultralytics import YOLO

# YOLO 모델 로드 및 웹캠 초기화
model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

print(model.names)


# 원하지 않는 클래스가 있으면 리스트에 추가 (예: ['person', 'bottle'])
unwanted_classes = ['person']


def detect_objects(mode="largest"):
    """
    YOLO를 이용하여 객체를 감지하는 함수.

    Args:
        mode (str): "largest" 또는 "center"
           - "largest": 면적 기준으로 가장 큰 객체의 라벨을 선택
           - "center": 프레임 중앙과 가장 가까운 객체의 라벨을 선택

    Returns:
        candidate (str or None): 선택된 객체의 영어 라벨 (없으면 None)
        frame: 미러 모드(좌우 반전)가 적용된 프레임
    """
    ret, frame = cap.read()
    if not ret:
        return None, None

    # 미러 모드 적용
    frame = cv2.flip(frame, 1)
    height, width = frame.shape[:2]
    frame_center_x = width / 2
    frame_center_y = height / 2

    results = model.predict(source=frame, stream=True)
    candidate = None

    if mode == "largest":
        best_area = 0
        for result in results:
            for box in result.boxes:
                label = model.names[int(box.cls[0])]
                if label in unwanted_classes:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                area = (x2 - x1) * (y2 - y1)
                if area > best_area:
                    best_area = area
                    candidate = label

    elif mode == "center":
        best_distance = float('inf')
        for result in results:
            for box in result.boxes:
                label = model.names[int(box.cls[0])]
                if label in unwanted_classes:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                box_center_x = (x1 + x2) / 2
                box_center_y = (y1 + y2) / 2
                distance = ((box_center_x - frame_center_x) ** 2 + (box_center_y - frame_center_y) ** 2) ** 0.5
                if distance < best_distance:
                    best_distance = distance
                    candidate = label
    else:
        candidate = None

    return candidate, frame


def get_detected_objects():
    """
    YOLO를 사용하여 감지된 객체를 리스트로 반환하는 함수.
    (예: React에 전달할 때 사용)
    """
    candidate, _ = detect_objects(mode="largest")
    return [candidate] if candidate else []


def generate_video_frames():
    """
    웹캠에서 읽은 프레임을 실시간 스트리밍으로 변환하며,
    인식된 객체의 라벨을 영상 위에 오버레이하여 반환하는 함수.
    """
    while True:
        # detect_objects()를 통해 매 프레임마다 객체 인식을 수행합니다.
        candidate, frame = detect_objects(mode="largest")
        if frame is None:
            break
        if candidate:
            # 인식된 객체 라벨을 영상 좌측 상단에 표시합니다.
            cv2.putText(frame, candidate, (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            continue
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
