import cv2
import numpy as np
import pandas as pd
import os
from deepface import DeepFace
from mtcnn import MTCNN

DB_PATH = "face_db.csv"  # 치료사 얼굴 DB 파일
detector = MTCNN()  # MTCNN 사용
THRESHOLD = 0.7  # 인증 임계값 (테스트에 따라 조정)
SECONDARY_THRESHOLD = 0.65  # 보조 임계값 (필요 시 활용)


def get_available_camera():
    """사용 가능한 카메라 찾기"""
    for i in range(5):  # 최대 5개 카메라 검사
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)  # V4L2 백엔드 사용
        if cap.isOpened():
            print(f"✅ 사용 가능한 카메라: {i}번")
            cap.release()
            return i
    print("🚨 사용 가능한 카메라가 없습니다!")
    return None

def warmup_camera(cap):
    """카메라 워밍업 (3프레임 스킵)"""
    for _ in range(3):
        ret, _ = cap.read()
        if ret:
            print("[INFO] 카메라 워밍업 완료")
            break


def align_face(frame, face):
    """
    얼굴 정렬 함수.
    MTCNN의 검출 결과(face dict)에서 'box'와 'keypoints'를 사용하여,
    좌우 눈의 각도를 계산하고, 해당 각도로 얼굴 영역을 회전시킵니다.
    """
    box = face['box']  # [x, y, w, h]
    keypoints = face['keypoints']
    x, y, w, h = box
    # 원본 frame에서 얼굴 영역 crop
    face_img = frame[y:y + h, x:x + w]
    # 좌우 눈 좌표 (얼굴 영역 기준으로 조정)
    left_eye = (keypoints['left_eye'][0] - x, keypoints['left_eye'][1] - y)
    right_eye = (keypoints['right_eye'][0] - x, keypoints['right_eye'][1] - y)
    dx = right_eye[0] - left_eye[0]
    dy = right_eye[1] - left_eye[1]
    angle = np.degrees(np.arctan2(dy, dx))
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1)
    aligned_face = cv2.warpAffine(face_img, M, (w, h))
    return aligned_face


def preprocess_face(face_img):
    """얼굴 전처리: BGR→RGB 변환 후 160x160 리사이즈"""
    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
    face_img = cv2.resize(face_img, (160, 160))
    return face_img


def extract_embedding(processed_face, model="ArcFace"):
    """DeepFace를 이용해 얼굴 임베딩 추출 (512차원)"""
    try:
        analysis = DeepFace.represent(
            processed_face,
            model_name=model,
            detector_backend="mtcnn",
            enforce_detection=False
        )
        if not analysis or "embedding" not in analysis[0]:
            return None
        embedding = np.array(analysis[0]['embedding'], dtype=float)
        # 128차원 벡터가 나오면 512차원으로 패딩
        if embedding.shape[0] == 128:
            embedding = np.pad(embedding, (0, 384), mode="constant")
        return embedding
    except Exception as e:
        print(f"[ERROR] 얼굴 벡터 추출 오류: {e}")
        return None


def register_user_face(therapist_id: int, therapist_name: str):
    """
    치료사 얼굴 등록:
    - 사용 가능한 카메라에서 최대 15회 시도 중 5개 품질 좋은 샘플 수집
    - 얼굴 정렬 및 전처리 후 임베딩 추출하여 CSV 파일에 저장
    """
    camera_index = get_available_camera()
    if camera_index is None:
        return {"status": 503, "message": "사용 가능한 카메라가 없습니다."}

    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류."}

    warmup_camera(cap)

    # DB 파일 로드 (없으면 새로 생성)
    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["therapist_id", "therapist_name"] + [f"v{i}" for i in range(512)])
    else:
        df = pd.read_csv(DB_PATH, dtype={'therapist_id': int, 'therapist_name': str})
    # 동일 therapist_id가 있으면 제거
    df = df[df["therapist_id"] != therapist_id]

    samples = []
    attempts = 0
    while len(samples) < 5 and attempts < 15:
        ret, frame = cap.read()
        attempts += 1
        if not ret:
            print("[ERROR] 이미지 캡처 실패. 다시 시도 중...")
            continue
        frame = cv2.flip(frame, 1)
        faces = detector.detect_faces(frame)
        if not faces:
            print("[WARN] 얼굴이 감지되지 않음. 다시 시도 중...")
            continue
        for face in faces:
            if face.get('confidence', 0) < 0.90:
                print("[WARN] 얼굴 감지 신뢰도 낮음. 스킵.")
                continue
            # 얼굴 정렬 적용
            aligned_face = align_face(frame, face)
            processed_face = preprocess_face(aligned_face)
            embedding = extract_embedding(processed_face)
            if embedding is None or embedding.shape[0] != 512:
                print("[ERROR] 임베딩 오류 또는 크기 불일치! 다시 시도 중...")
                continue
            samples.append([therapist_id, therapist_name] + embedding.tolist())
            print(f"[INFO] 샘플 {len(samples)} 수집됨.")
            if len(samples) == 5:
                break

    cap.release()
    cv2.destroyAllWindows()

    if samples:
        new_data = pd.DataFrame(samples, columns=df.columns)
        df = pd.concat([df, new_data], ignore_index=True)
        df.to_csv(DB_PATH, index=False, float_format='%.6f')
        return {"status": 201, "message": f"✅ 얼굴 등록 완료!", "data": {
        "therapist_id": therapist_id,
        "therapist_name": therapist_name
    }}
    return {"status": 400, "message": "❌ 얼굴 등록 실패. 다시 시도해주세요."}


def verify_user_face():
    """
    치료사 얼굴 인증:
    - 사용 가능한 카메라에서 10프레임 캡처 후, 얼굴 정렬 및 전처리하여 임베딩 추출
    - 품질이 높은 상위 3개 프레임의 평균 임베딩을 계산하고, 등록된 각 치료사의 평균 임베딩과 비교
    """
    camera_index = get_available_camera()
    if camera_index is None:
        return {"status": 503, "message": "사용 가능한 카메라가 없습니다."}

    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류."}

    warmup_camera(cap)

    if not os.path.exists(DB_PATH):
        return {"status": 401, "message": "등록된 얼굴 데이터가 없습니다."}

    df = pd.read_csv(DB_PATH, dtype={'therapist_id': int, 'therapist_name': str})
    if df.empty:
        return {"status": 401, "message": "등록된 얼굴이 없습니다."}

    # 각 therapist_id별 평균 임베딩 계산
    grouped = df.groupby("therapist_id")
    avg_embeddings = {}
    names = {}
    for therapist_id, group in grouped:
        names[therapist_id] = group["therapist_name"].iloc[0]
        emb_array = group.iloc[:, 2:].values.astype(float)
        avg_embeddings[therapist_id] = np.mean(emb_array, axis=0)

    collected_embeddings = []
    quality_scores = []
    # 10 프레임 캡처
    for _ in range(10):
        ret, frame = cap.read()
        if not ret:
            continue
        frame = cv2.flip(frame, 1)
        faces = detector.detect_faces(frame)
        if not faces:
            continue
        face = faces[0]
        if face.get('confidence', 0) < 0.90:
            continue
        aligned_face = align_face(frame, face)
        processed_face = preprocess_face(aligned_face)
        embedding = extract_embedding(processed_face)
        if embedding is not None and embedding.shape[0] == 512:
            collected_embeddings.append(embedding)
            quality_scores.append(face.get('confidence', 0))

    cap.release()
    cv2.destroyAllWindows()

    if not collected_embeddings:
        return {"status": 401, "message": "얼굴을 감지하지 못했습니다."}

    collected_embeddings = np.array(collected_embeddings)
    if len(collected_embeddings) > 3:
        # 상위 3개의 신뢰도 높은 프레임 선택
        indices = np.argsort(quality_scores)[::-1][:3]
        selected_embeddings = collected_embeddings[indices]
    else:
        selected_embeddings = collected_embeddings
    live_embedding = np.mean(selected_embeddings, axis=0)

    best_match = None
    best_similarity = 0
    for therapist_id, avg_emb in avg_embeddings.items():
        similarity = np.dot(live_embedding, avg_emb) / (np.linalg.norm(live_embedding) * np.linalg.norm(avg_emb))
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = therapist_id

    if best_match and best_similarity > THRESHOLD:
        return {
            "status": 200,
            "message": "✅ 인증 성공!",
            "therapist_id": int(best_match),
            "therapist_name": names[best_match],
            "similarity": round(best_similarity, 3)
        }
    return {"status": 401, "message": "❌ 인증 실패. 등록된 얼굴과 일치하지 않습니다."}

