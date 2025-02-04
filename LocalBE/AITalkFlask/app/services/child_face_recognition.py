import cv2
import numpy as np
import pandas as pd
from deepface import DeepFace
import os

DB_PATH = "child_face_db.csv"
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def get_next_child_id(df):
    """ 기존 아동 목록을 확인하여 새로운 child_x 이름 생성 """
    existing_children = set(df["name"]) if not df.empty else set()
    i = 10001  # 아동 ID는 10001부터 시작
    while f"child_{i}" in existing_children:
        i += 1
    return f"child_{i}"

def register_child_face(child_id):
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["childId", "name"] + [f"v{i}" for i in range(128)])
        df.to_csv(DB_PATH, index=False)
    else:
        df = pd.read_csv(DB_PATH, dtype={'childId': int, 'name': str})

    ret, frame = cap.read()
    if not ret:
        return {"status": 500, "message": "이미지 캡처 실패"}

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6, minSize=(60, 60))

    for (x, y, w, h) in faces:
        face_img = cv2.resize(frame[y:y + h, x:x + w], (200, 200))

        try:
            analysis = DeepFace.represent(face_img, model_name="Facenet", enforce_detection=True)
            if analysis:
                embedding = np.array(analysis[0]['embedding'], dtype=float)

                name = get_next_child_id(df)
                new_data = pd.DataFrame([[child_id, name] + embedding.tolist()])
                new_data.to_csv(DB_PATH, mode='a', header=False, index=False, float_format='%.6f')

                return {"status": 201, "message": "Face ID가 등록되었습니다."}

        except Exception as e:
            return {"status": 500, "message": f"얼굴 등록 오류: {e}"}

    cap.release()
    return {"status": 500, "message": "얼굴을 감지하지 못했습니다."}

def verify_child_face():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        return {"status": 401, "message": "일치하는 데이터가 없습니다."}

    df = pd.read_csv(DB_PATH, dtype={'childId': int, 'name': str})
    if df.empty:
        return {"status": 401, "message": "등록된 얼굴이 없습니다."}

    names = df["name"].values
    child_ids = df["childId"].values
    embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').values

    ret, frame = cap.read()
    if not ret:
        return {"status": 500, "message": "이미지 캡처 실패"}

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6, minSize=(60, 60))

    for (x, y, w, h) in faces:
        face_img = cv2.resize(frame[y:y + h, x:x + w], (200, 200))

        try:
            analysis = DeepFace.represent(face_img, model_name="Facenet", enforce_detection=False)
            if not analysis:
                continue

            embedding = np.array(analysis[0]['embedding'], dtype=float)

            similarities = [np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb)) for emb in embeddings]

            max_similarity = np.max(similarities)
            best_match_index = np.argmax(similarities)

            if max_similarity > 0.9:
                return {
                    "status": 200,
                    "childId": int(child_ids[best_match_index]),
                    "name": names[best_match_index]
                }

        except Exception as e:
            return {"status": 500, "message": f"얼굴 인식 오류: {e}"}

    cap.release()
    return {"status": 401, "message": "일치하는 데이터가 없습니다."}
