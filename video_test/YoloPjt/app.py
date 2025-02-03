from flask import Flask, Response, jsonify
import torch
import cv2

app = Flask(__name__)

# YOLOv5 모델 로드 (COCO 데이터셋 사전 학습)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# 웹캠 열기
cap = cv2.VideoCapture(0)  # 0번 카메라 (기본 웹캠)

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        # YOLO 모델 적용
        results = model(frame)

        # 감지된 객체 리스트
        df = results.pandas().xyxy[0]  # DataFrame 변환
        for _, row in df.iterrows():
            # 바운딩 박스 좌표
            x1, y1, x2, y2 = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
            confidence = row['confidence']
            label = f"{row['name']} {confidence:.2f}"

            # 🔹 객체 감지된 경우 바운딩 박스 추가
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # 프레임을 JPEG로 변환
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # 🟢 바운더리 `frame`을 올바르게 설정
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect', methods=['GET'])
def detect_objects():
    success, frame = cap.read()
    if not success:
        return jsonify({'error': 'Could not read frame'}), 500

    # YOLO 모델 실행
    results = model(frame)
    df = results.pandas().xyxy[0]  # DataFrame 변환

    # 감지된 객체 리스트 생성
    detected_objects = []
    for _, row in df.iterrows():
        detected_objects.append({
            'name': row['name'],
            'confidence': float(row['confidence']),
            'bbox': [int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])]
        })

    return jsonify({'objects': detected_objects})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
