import cv2
import numpy as np
import pandas as pd
from deepface import DeepFace
import os
from mtcnn import MTCNN

DB_PATH = "face_db.csv"
detector = MTCNN()

# ✅ 유사도 임계값 (0.65~0.7 사이면 추가 검증)
THRESHOLD = 0.7
SECONDARY_THRESHOLD = 0.65

def get_available_camera():
    """ 사용 가능한 카메라 인덱스를 자동으로 찾는 함수 """
    for i in range(5):
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)  
        if cap.isOpened():
            print(f"✅ 사용 가능한 카메라: {i}번")
            cap.release()
            return i
    print("🚨 사용 가능한 카메라가 없습니다!")
    return None

def warmup_camera(cap):
    """ 카메라 워밍업 (3프레임 스킵) """
    for _ in range(3):
        ret, frame = cap.read()
        if ret:
            print("[INFO] 카메라 워밍업 완료")
            break

def preprocess_face(face_img):
    """ 얼굴 크기 조정 """
    face_img = cv2.resize(face_img, (160, 160))
    return face_img

def extract_embedding(processed_face, model="ArcFace"):
    """ 얼굴 벡터(임베딩) 추출 (512차원으로 맞추기) """
    try:
        analysis = DeepFace.represent(
            processed_face, 
            model_name=model,  # ✅ 모델 변경 가능
            detector_backend="mtcnn", 
            enforce_detection=False
        )
        if not analysis or "embedding" not in analysis[0]:
            return None
        
        embedding = np.array(analysis[0]['embedding'], dtype=float)

        # ✅ 128차원 벡터가 나오는 경우 512차원으로 패딩
        if embedding.shape[0] == 128:
            embedding = np.pad(embedding, (0, 384), mode="constant")  # 512차원으로 맞추기
        
        return embedding

    except Exception as e:
        print(f"[ERROR] 얼굴 벡터 추출 오류: {e}")
        return None

def register_user_face(therapist_id: int, therapist_name: str):
    """ 특정 therapist_id와 therapist_name으로 Face ID 등록 """

    camera_index = get_available_camera()
    if camera_index is None:
        return {"status": 503, "message": "사용 가능한 카메라가 없습니다."}

    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류."}

    warmup_camera(cap)

    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["therapist_id", "therapist_name"] + [f"v{i}" for i in range(512)])
    else:
        df = pd.read_csv(DB_PATH, dtype={'therapist_id': int, 'therapist_name': str})
    df = df[df["therapist_id"] != therapist_id]

    registered_faces = []
    registered_count = 0
    attempts = 0  
    while registered_count < 5 and attempts < 10:
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
            x, y, w, h = face['box']
            face_img = frame[y:y+h, x:x+w]
            processed_face = preprocess_face(face_img)
            embedding = extract_embedding(processed_face)

            if embedding is None or embedding.shape[0] != 512:
                print("[ERROR] 벡터 크기 오류! 다시 시도 중...")
                continue

            registered_faces.append([therapist_id, therapist_name] + embedding.tolist())
            registered_count += 1

            if registered_count == 5:
                break  

    cap.release()
    cv2.destroyAllWindows()

    if registered_faces:
        new_data = pd.DataFrame(registered_faces, columns=df.columns)
        df = pd.concat([df, new_data], ignore_index=True)
        df.to_csv(DB_PATH, index=False, float_format='%.6f')

        return {"status": 201, "message": f"✅ 얼굴 등록 완료! therapist_id: {therapist_id}, 이름: {therapist_name}"}

    return {"status": 400, "message": "❌ 얼굴 등록에 실패했습니다. 다시 시도해주세요."}

def verify_user_face():
    """ 얼굴 인식 후 therapist_id와 therapist_name 반환 """

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

    therapist_ids = df["therapist_id"].values
    therapist_names = df["therapist_name"].values
    embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').dropna().values

    best_match_id = None
    best_match_name = None
    best_similarity = 0

    for _ in range(3):
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)
        faces = detector.detect_faces(frame)

        if not faces:
            continue

        for face in faces:
            x, y, w, h = face['box']
            face_img = frame[y:y+h, x:x+w]
            processed_face = preprocess_face(face_img)
            embedding = extract_embedding(processed_face, model="ArcFace")

            if embedding is None:
                continue

            similarities = [np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb)) for emb in embeddings]
            max_similarity = np.max(similarities)
            max_index = np.argmax(similarities)

            if max_similarity > THRESHOLD:
                best_match_id = therapist_ids[max_index]
                best_match_name = therapist_names[max_index]
                best_similarity = max_similarity
                break  

    cap.release()
    cv2.destroyAllWindows()

    if best_match_id:
        return {
            "status": 200,
            "message": "✅ 인증 성공!",
            "therapist_id": int(best_match_id),
            "therapist_name": best_match_name,
            "similarity": round(best_similarity, 3)
        }
    
    return {"status": 401, "message": "❌ 인증 실패. 등록된 얼굴과 일치하지 않습니다."}
