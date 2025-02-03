import cv2
import numpy as np
import colorsys
import os
from collections import Counter
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont

# YOLO 모델 로드 및 웹캠 연결
model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)
# # (원한다면 해상도를 낮춰서 처리 속도를 개선)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

# COCO 데이터셋 한글 라벨 매핑
coco_labels = {
    "person": "사람", "bicycle": "자전거", "car": "자동차", "motorcycle": "오토바이",
    "airplane": "비행기", "bus": "버스", "train": "기차", "truck": "트럭",
    "boat": "보트", "traffic light": "신호등", "fire hydrant": "소화전",
    "stop sign": "정지 표지판", "parking meter": "주차 미터기", "bench": "벤치",
    "bird": "새", "cat": "고양이", "dog": "개", "horse": "말", "sheep": "양",
    "cow": "소", "elephant": "코끼리", "bear": "곰", "zebra": "얼룩말", "giraffe": "기린",
    "backpack": "가방", "umbrella": "우산", "handbag": "핸드백", "tie": "넥타이",
    "suitcase": "여행가방", "frisbee": "프리스비", "skis": "스키", "snowboard": "스노보드",
    "sports ball": "공", "kite": "연", "baseball bat": "야구 배트",
    "baseball glove": "야구 글러브", "skateboard": "스케이트보드",
    "surfboard": "서핑보드", "tennis racket": "테니스 라켓", "bottle": "병",
    "wine glass": "와인잔", "cup": "컵", "fork": "포크", "knife": "칼", "spoon": "숟가락",
    "bowl": "그릇", "banana": "바나나", "apple": "사과", "sandwic h": "샌드위치",
    "orange": "오렌지", "broccoli": "브로콜리", "carrot": "당근", "hot dog": "핫도그",
    "pizza": "피자", "donut": "도넛", "cake": "케이크", "chair": "의자",
    "couch": "소파", "potted plant": "화분", "bed": "침대", "dining table": "식탁",
    "toilet": "변기", "tv": "텔레비전", "laptop": "노트북", "mouse": "마우스",
    "remote": "리모컨", "keyboard": "키보드", "cell phone": "휴대폰",
    "microwave": "전자레인지", "oven": "오븐", "toaster": "토스터", "sink": "싱크대",
    "refrigerator": "냉장고", "book": "책", "clock": "시계", "vase": "꽃병",
    "scissors": "가위", "teddy bear": "테디베어", "hair drier": "헤어드라이어",
    "toothbrush": "칫솔"
}

def extract_dominant_color(image, x1, y1, x2, y2, k=3):
    """ 감지된 객체 영역에서 주요 색상을 추출 """
    roi = image[y1:y2, x1:x2]
    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
    pixels = roi.reshape((-1, 3))
    pixels = np.float32(pixels)

    # ✅ 올바른 criteria 튜플 적용
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)

    # ✅ bestLabels=None을 유지해도 k-means가 정상 작동함
    _, labels, centers = cv2.kmeans(
        pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
    )

    dominant_color = centers[Counter(labels.flatten()).most_common(1)[0][0]]
    return tuple(map(int, dominant_color))  # (R, G, B) 반환

def get_color_name(rgb):
    """ RGB 값을 받아 대략적인 색상 한글명을 반환 """
    r, g, b = rgb
    r_norm, g_norm, b_norm = r/255.0, g/255.0, b/255.0
    h, s, v = colorsys.rgb_to_hsv(r_norm, g_norm, b_norm)
    h_deg = h * 360
    if v < 0.2:
        return "검정색"
    if s < 0.25:
        return "흰색" if v > 0.8 else "회색"
    if h_deg < 15 or h_deg >= 345:
        return "빨간색"
    elif 15 <= h_deg < 45:
        return "주황색"
    elif 45 <= h_deg < 75:
        return "노란색"
    elif 75 <= h_deg < 150:
        return "초록색"
    elif 150 <= h_deg < 210:
        return "청록색"
    elif 210 <= h_deg < 270:
        return "파란색"
    elif 270 <= h_deg < 330:
        return "보라색"
    else:
        return "분홍색"

# 전역에서 폰트 미리 로드 (매 프레임마다 로드하지 않음)
font_path = "NanumGothic.ttf"
if os.path.exists(font_path):
    font = ImageFont.truetype(font_path, 20)
else:
    print("NanumGothic.ttf 파일을 찾을 수 없습니다. 기본 폰트를 사용합니다.")
    font = ImageFont.load_default()

def get_detected_objects():
    """
    웹캠에서 한 프레임을 읽어,
    검출된 객체들 중 바운딩 박스 면적(크기)이 가장 큰, 즉 가장 가까운 객체 하나만 반환 (JSON용)
    """
    ret, frame = cap.read()
    if not ret:
        return []

    results = model.predict(source=frame, stream=True)
    best_candidate = None
    best_area = 0

    for result in results:
        for box in result.boxes:

            label = model.names[int(box.cls[0])]
            if label == "person":  # "person" 감지 제외
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            area = (x2 - x1) * (y2 - y1)
            if area > best_area:
                label = model.names[int(box.cls[0])]
                label_ko = coco_labels.get(label, label)
                color_rgb = extract_dominant_color(frame, x1, y1, x2, y2)
                color_name = get_color_name(color_rgb)
                best_candidate = {
                    "object": f"{color_name} {label_ko}",
                    "area": area
                }
                best_area = area

    if best_candidate is not None:
        # area 정보는 JSON에 포함하지 않고 객체 이름만 반환
        return [{"object": best_candidate["object"]}]
    else:
        return []

def generate_video_frames():
    """
    웹캠 스트리밍 시, 검출된 객체들 중 가장 가까운(가장 크게 보이는) 객체 하나만 표시
    """
    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model.predict(source=frame, stream=True)
        best_candidate = None
        best_area = 0

        for result in results:
            for box in result.boxes:

                label = model.names[int(box.cls[0])]
                if label == "person":  # "person" 감지 제외
                    continue

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                area = (x2 - x1) * (y2 - y1)
                if area > best_area:
                    label = model.names[int(box.cls[0])]
                    label_ko = coco_labels.get(label, label)
                    color_rgb = extract_dominant_color(frame, x1, y1, x2, y2)
                    color_name = get_color_name(color_rgb)
                    best_candidate = {
                        "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                        "text": f"{color_name} {label_ko}",
                        "color_rgb": color_rgb
                    }
                    best_area = area

        if best_candidate is not None:
            # 가장 가까운 객체에 대해 사각형과 텍스트 표시
            cv2.rectangle(frame,
                          (best_candidate["x1"], best_candidate["y1"]),
                          (best_candidate["x2"], best_candidate["y2"]),
                          best_candidate["color_rgb"][::-1], 2)
            # 텍스트 렌더링을 위해 PIL 이미지 변환
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(frame_rgb)
            draw = ImageDraw.Draw(pil_img)
            draw.text((best_candidate["x1"], best_candidate["y1"] - 20),
                      best_candidate["text"],
                      font=font,
                      fill=(best_candidate["color_rgb"][2],
                            best_candidate["color_rgb"][1],
                            best_candidate["color_rgb"][0]))
            frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        _, buffer = cv2.imencode(".jpg", frame)
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")
