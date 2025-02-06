import cv2
import numpy as np
import pandas as pd
from deepface import DeepFace
import os
from mtcnn import MTCNN

DB_PATH = "child_face_db.csv"
detector = MTCNN()  # ✅ MTCNN 사용 (정확도↑)

def get_next_child_id(df):
    if df.empty:
        return 10001
    else:
        return df["childId"].max() + 1

def preprocess_face(face_img):
    face_img = cv2.resize(face_img, (160, 160))
    return face_img

def register_child_face():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["childId", "name"] + [f"v{i}" for i in range(512)])
        df.to_csv(DB_PATH, index=False)
    else:
        df = pd.read_csv(DB_PATH, dtype={'childId': int, 'name': str})

    registered_count = 0
    while registered_count < 5:
        ret, frame = cap.read()
        if not ret:
            return {"status": 500, "message": "이미지 캡처 실패"}

        frame = cv2.flip(frame, 1)
        faces = detector.detect_faces(frame)  # ✅ MTCNN으로 얼굴 감지

        for face in faces:
            x, y, w, h = face['box']
            face_img = frame[y:y+h, x:x+w]
            processed_face = preprocess_face(face_img)

            try:
                analysis = DeepFace.represent(processed_face, model_name="ArcFace", detector_backend="mtcnn", enforce_detection=False)
                if not analysis or "embedding" not in analysis[0]:
                    continue

                embedding = np.array(analysis[0]['embedding'], dtype=float)

                new_child_id = get_next_child_id(df)
                name = f"child_{new_child_id}"

                new_data = pd.DataFrame([[new_child_id, name] + embedding.tolist()])
                new_data.to_csv(DB_PATH, mode='a', header=False, index=False, float_format='%.6f')

                print(f"[INFO] {name} (ID: {new_child_id}) 님의 얼굴이 등록되었습니다. (총 {registered_count + 1}/5)")
                registered_count += 1

            except Exception as e:
                print(f"[ERROR] 얼굴 등록 오류: {e}")

    cap.release()
    cv2.destroyAllWindows()
    return {"status": 201, "message": f"총 {registered_count}개의 얼굴이 등록되었습니다."}


def verify_child_face():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        return {"status": 401, "message": "등록된 얼굴 데이터가 없습니다."}

    df = pd.read_csv(DB_PATH, dtype={'childId': int, 'name': str})
    if df.empty:
        return {"status": 401, "message": "등록된 얼굴이 없습니다."}

    names = df["name"].values
    child_ids = df["childId"].values
    embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').dropna().values

    print("[INFO] 얼굴을 인식하여 아동 인증을 진행합니다.")

    similarities = []
    matched_indices = []  # 가장 유사한 얼굴의 인덱스를 저장
    for _ in range(5):  # ✅ 5개 프레임 비교 후 최댓값 사용
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)
        faces = detector.detect_faces(frame)

        for face in faces:
            x, y, w, h = face['box']
            face_img = frame[y:y+h, x:x+w]
            processed_face = preprocess_face(face_img)

            try:
                analysis = DeepFace.represent(processed_face, model_name="ArcFace", detector_backend="mtcnn", enforce_detection=False)
                if not analysis or "embedding" not in analysis[0]:
                    continue

                embedding = np.array(analysis[0]['embedding'], dtype=float)
                frame_similarities = [np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb)) for emb in embeddings]

                max_similarity = np.max(frame_similarities)
                max_index = np.argmax(frame_similarities)

                similarities.append(max_similarity)
                matched_indices.append(max_index)

            except Exception as e:
                return {"status": 500, "message": f"얼굴 인식 오류: {e}"}

    cap.release()
    cv2.destroyAllWindows()

    if similarities:
        final_similarity = np.max(similarities)
        best_match_index = matched_indices[np.argmax(similarities)]  # ✅ 가장 유사한 얼굴의 인덱스 찾기

        if final_similarity > 0.7:  # ✅ 임계값 조정 (0.85 → 0.75)
            matched_name = names[best_match_index]
            matched_id = child_ids[best_match_index]

            print(f"[INFO] {matched_name} (ID: {matched_id}) 님의 얼굴이 인증되었습니다.")
            return {
                "status": 200,
                "message": "인증 완료!",
                "childId": int(matched_id),  # ✅ int64 → int 변환
                "name": matched_name
            }

    return {"status": 401, "message": "일치하는 데이터 없음"}
