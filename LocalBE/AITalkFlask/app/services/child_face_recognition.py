import cv2
import numpy as np
import pandas as pd
from deepface import DeepFace
import os
from mtcnn import MTCNN

DB_PATH = "child_face_db.csv"
detector = MTCNN()  # ✅ MTCNN 사용 (정확도↑)

def preprocess_face(face_img):
    face_img = cv2.resize(face_img, (160, 160))
    return face_img

def register_child_face(child_id: int, child_name: str):
    """ 특정 child_id와 child_name으로 Face ID 등록 """
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["child_id", "child_name"] + [f"v{i}" for i in range(512)])
    else:
        df = pd.read_csv(DB_PATH, dtype={'child_id': int, 'child_name': str})
    df = df[df["child_id"] != child_id]  # ✅ 기존 동일 ID 제거

    ret, frame = cap.read()
    if not ret:
        return {"status": 500, "message": "이미지 캡처 실패"}

    frame = cv2.flip(frame, 1)
    faces = detector.detect_faces(frame)  # ✅ MTCNN으로 얼굴 감지

    if not faces:
        return {"status": 400, "message": "❌ 얼굴이 감지되지 않음"}

    x, y, w, h = faces[0]['box']
    face_img = frame[y:y+h, x:x+w]
    processed_face = preprocess_face(face_img)

    try:
        analysis = DeepFace.represent(processed_face, model_name="ArcFace", detector_backend="mtcnn", enforce_detection=False)
        if not analysis:
            return {"status": 500, "message": "❌ 얼굴 임베딩 추출 실패"}

        embedding = np.array(analysis[0]['embedding'], dtype=float)

        new_data = pd.DataFrame([[child_id, child_name] + embedding.tolist()], columns=df.columns)
        df = pd.concat([df, new_data], ignore_index=True)
        df.to_csv(DB_PATH, index=False, float_format='%.6f')

        print(f"[INFO] {child_name} (ID: {child_id}) 님의 얼굴이 등록되었습니다.")
        return {"status": 201, "message": f"✅ 얼굴 등록 완료! child_id: {child_id}, 이름: {child_name}"}

    except Exception as e:
        return {"status": 500, "message": f"얼굴 등록 오류: {e}"}

    finally:
        cap.release()
        cv2.destroyAllWindows()

def verify_child_face():
    """ 얼굴 인식 후 child_id와 child_name 반환 """
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        return {"status": 401, "message": "등록된 얼굴 데이터가 없습니다."}

    df = pd.read_csv(DB_PATH, dtype={'child_id': int, 'child_name': str})
    if df.empty:
        return {"status": 401, "message": "등록된 얼굴이 없습니다."}

    child_ids = df["child_id"].values
    child_names = df["child_name"].values
    embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').dropna().values

    print("[INFO] 얼굴을 인식하여 아동 인증을 진행합니다.")

    ret, frame = cap.read()
    if not ret:
        return {"status": 500, "message": "이미지 캡처 실패"}

    frame = cv2.flip(frame, 1)
    faces = detector.detect_faces(frame)

    if not faces:
        return {"status": 400, "message": "❌ 얼굴이 감지되지 않음"}

    x, y, w, h = faces[0]['box']
    face_img = frame[y:y+h, x:x+w]
    processed_face = preprocess_face(face_img)

    try:
        analysis = DeepFace.represent(processed_face, model_name="ArcFace", detector_backend="mtcnn", enforce_detection=False)
        if not analysis:
            return {"status": 500, "message": "❌ 얼굴 임베딩 추출 실패"}

        embedding = np.array(analysis[0]['embedding'], dtype=float)
        similarities = [np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb)) for emb in embeddings]

        max_similarity = np.max(similarities)
        max_index = np.argmax(similarities)

        if max_similarity > 0.7:
            matched_name = child_names[max_index]
            matched_id = child_ids[max_index]
            return {"status": 200, "message": "✅ 인증 성공!", "child_id": int(matched_id), "child_name": matched_name}

    except Exception as e:
        return {"status": 500, "message": f"얼굴 인식 오류: {e}"}

    finally:
        cap.release()
        cv2.destroyAllWindows()

    return {"status": 401, "message": "❌ 인증 실패. 등록된 얼굴과 일치하지 않습니다."}
