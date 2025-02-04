import cv2
import numpy as np
import colorsys
import os
from collections import Counter
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont

# # YOLO 모델 로드 및 웹캠 연결
# model = YOLO("yolov8n.pt")
# cap = cv2.VideoCapture(0)

# YOLO 모델을 필요할 때만 로드하도록 수정
def load_model():
    return YOLO("yolov8n.pt")

# ✅ 웹캠을 동적으로 가져오고, 해상도 설정을 포함
def get_camera():
    cap = cv2.VideoCapture(1)  # 웹캠 활성화
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)  # 해상도 설정
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
    return cap


# # # (원한다면 해상도를 낮춰서 처리 속도를 개선)
# cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
# cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

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


def extract_dominant_color(image, x1, y1, x2, y2, k=5):
    """
    감지된 객체 영역에서 주요 색상을 추출하여 가장 많이 차지하는 색상을 반환
    개선 사항:
    1. K-means 클러스터링의 K 값을 증가 (3 → 5)
    2. ROI 내 중심 부분만 샘플링하여 배경 색상의 영향을 줄임
    3. GaussianBlur 적용하여 노이즈 감소
    4. HSV 색공간으로 변환 후 V(명도) 값이 너무 낮은 색상 제거
    """

    # ✅ 객체 중심 부분만 추출 (전체 영역이 아니라 내부 60%만 사용)
    center_x1 = int(x1 + (x2 - x1) * 0.2)
    center_y1 = int(y1 + (y2 - y1) * 0.2)
    center_x2 = int(x2 - (x2 - x1) * 0.2)
    center_y2 = int(y2 - (y2 - y1) * 0.2)

    roi = image[center_y1:center_y2, center_x1:center_x2]

    # ✅ GaussianBlur 적용 (노이즈 제거)
    roi = cv2.GaussianBlur(roi, (5, 5), 0)

    # ✅ BGR → RGB 변환
    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)

    # ✅ RGB → HSV 변환
    hsv = cv2.cvtColor(roi, cv2.COLOR_RGB2HSV)

    # ✅ HSV에서 V(명도) 값이 너무 낮은 경우 제거 (어두운 영역 무시)
    mask = hsv[:, :, 2] > 50  # 명도가 50 이상인 픽셀만 선택
    pixels = roi[mask]

    if len(pixels) == 0:
        return (128, 128, 128)  # 기본 회색 반환 (색상 인식 실패 시)

    # ✅ K-Means 클러스터링 적용 (K=5)
    pixels = np.float32(pixels.reshape(-1, 3))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    # ✅ 가장 많이 등장하는 색상 선택
    dominant_color = centers[Counter(labels.flatten()).most_common(1)[0][0]]

    return tuple(map(int, dominant_color))  # (R, G, B) 반환


def get_color_name(rgb):
    """ RGB 값을 받아 보다 정확한 한글 색상명을 반환 """
    r, g, b = rgb
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(r_norm, g_norm, b_norm)
    h_deg = h * 360

    # ✅ 어두운 색상은 검정으로 처리
    if v < 0.2:
        return "검정색"

    # ✅ 채도가 낮은 경우 흰색 or 회색, 단 연한 분홍색 예외 처리
    if s < 0.15:  # 기존보다 낮은 채도에서도 색상 구별
        if v > 0.85:
            return "흰색"
        elif 0.6 < v <= 0.85 and 300 <= h_deg <= 350:
            return "연한 분홍색"  # 연한 분홍색을 별도로 구별
        else:
            return "회색"

    # ✅ 색상 범위를 더 세밀하게 조정
    if h_deg < 10 or h_deg >= 350:
        return "빨간색"
    elif 10 <= h_deg < 30:
        return "주황색"
    elif 30 <= h_deg < 60:
        return "노란색"
    elif 60 <= h_deg < 150:
        return "초록색"
    elif 150 <= h_deg < 190:
        return "청록색"
    elif 190 <= h_deg < 250:
        return "파란색"
    elif 250 <= h_deg < 290:
        return "보라색"
    elif 290 <= h_deg < 350:
        return "분홍색"

    return "알 수 없는 색"

# 전역에서 폰트 미리 로드 (매 프레임마다 로드하지 않음)
font_path = "NanumGothic.ttf"
if os.path.exists(font_path):
    font = ImageFont.truetype(font_path, 20)
else:
    print("NanumGothic.ttf 파일을 찾을 수 없습니다. 기본 폰트를 사용합니다.")
    font = ImageFont.load_default()

# ✅ 감지된 객체 중 가장 큰 객체 하나만 JSON으로 반환
def get_detected_objects():
    cap = get_camera()  # 요청이 있을 때 웹캠 활성화
    model = load_model()  # YOLO 모델 로드

    ret, frame = cap.read()
    if not ret:
        cap.release()
        return []

    results = model.predict(source=frame, stream=True)
    best_candidate = None
    best_area = 0

    for result in results:
        for box in result.boxes:
            label = model.names[int(box.cls[0])]
            if label == "person":  # "사람" 감지 제외
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            area = (x2 - x1) * (y2 - y1)
            if area > best_area:
                label_ko = coco_labels.get(label, label)
                color_rgb = extract_dominant_color(frame, x1, y1, x2, y2)
                color_name = get_color_name(color_rgb)
                best_candidate = {"object": f"{color_name} {label_ko}", "area": area}
                best_area = area

    cap.release()  # ✅ 웹캠 사용 후 닫기
    return [{"object": best_candidate["object"]}] if best_candidate else []

# ✅ 실시간 웹캠 스트리밍 제공
def generate_video_frames():
    cap = get_camera()  # 요청이 있을 때만 웹캠 활성화
    model = load_model()

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
                if label == "person":
                    continue

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                area = (x2 - x1) * (y2 - y1)
                if area > best_area:
                    label_ko = coco_labels.get(label, label)
                    color_rgb = extract_dominant_color(frame, x1, y1, x2, y2)
                    color_name = get_color_name(color_rgb)
                    best_candidate = {"x1": x1, "y1": y1, "x2": x2, "y2": y2, "text": f"{color_name} {label_ko}", "color_rgb": color_rgb}
                    best_area = area

        if best_candidate:
            cv2.rectangle(frame, (best_candidate["x1"], best_candidate["y1"]), (best_candidate["x2"], best_candidate["y2"]), best_candidate["color_rgb"][::-1], 2)
            cv2.putText(frame, best_candidate["text"], (best_candidate["x1"], best_candidate["y1"] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, best_candidate["color_rgb"][::-1], 2)

        _, buffer = cv2.imencode(".jpg", frame)
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")

    cap.release()  # ✅ 스트리밍 종료 후 웹캠 닫기