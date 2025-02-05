import cv2
import numpy as np
import pandas as pd
from deepface import DeepFace
import os

DB_PATH = "face_db.csv"
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def cosine_similarity(vec1, vec2):
    """ 코사인 유사도를 계산하는 함수 """
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    return dot_product / (norm1 * norm2)


def get_next_user_id(df):
    """ 기존 사용자 ID를 확인하여 새로운 userId 생성 """
    if df.empty:
        return 1  # 첫 번째 사용자 ID는 101부터 시작
    else:
        return df["therapist_id"].max() + 1  # 가장 큰 userId에 +1


def register_user_face():
    """ 사용자의 얼굴을 등록하는 함수 """
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    # ✅ CSV 파일이 존재하는지 확인 후 데이터프레임 로드
    if not os.path.exists(DB_PATH):
        df = pd.DataFrame(columns=["therapist_id", "name"] + [f"v{i}" for i in range(128)])
        df.to_csv(DB_PATH, index=False)
    else:
        df = pd.read_csv(DB_PATH, dtype={'therapist_id': int, 'name': str})

    frame_count = 0
    detect_interval = 5
    registered_count = 0

    print("[INFO] 새로운 얼굴을 등록합니다. ESC 키를 누르면 종료됩니다.")

    while registered_count < 5:
        ret, frame = cap.read()
        if not ret:
            return {"status": 500, "message": "이미지 캡처 실패"}

        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if frame_count % detect_interval == 0:
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6, minSize=(60, 60))

            for (x, y, w, h) in faces:
                face_img = cv2.resize(frame[y:y + h, x:x + w], (200, 200))

                try:
                    analysis = DeepFace.represent(face_img, model_name="Facenet", enforce_detection=True)
                    if not analysis:
                        continue

                    embedding = np.array(analysis[0]['embedding'], dtype=float)

                    # ✅ 기존 데이터와 비교하여 중복 체크
                    if not df.empty:
                        existing_embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').values
                        distances = [np.linalg.norm(embedding - emb) for emb in existing_embeddings]

                        if min(distances) < 0.5:
                            print("[INFO] 이미 등록된 사용자와 유사합니다. 저장하지 않습니다.")
                            continue

                    # ✅ 새로운 사용자 ID 및 이름 생성
                    new_user_id = get_next_user_id(df)
                    name = f"user_{new_user_id}"

                    # ✅ 새로운 데이터 저장
                    new_data = pd.DataFrame([[new_user_id, name] + embedding.tolist()])
                    new_data.to_csv(DB_PATH, mode='a', header=False, index=False, float_format='%.6f')

                    print(f"[INFO] {name} (ID: {new_user_id}) 님의 얼굴이 등록되었습니다. (총 {registered_count + 1}/5)")
                    registered_count += 1

                except Exception as e:
                    print(f"[ERROR] 얼굴 등록 오류: {e}")

        frame_count += 1
        cv2.imshow("Face Registration", frame)

        if cv2.waitKey(30) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()
    return {"status": 201, "message": f"총 {registered_count}개의 얼굴이 등록되었습니다."}


def verify_user_face():
    """ 사용자의 얼굴을 인식하여 등록된 사용자와 비교하는 함수 """
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        return {"status": 503, "message": "카메라 연결 오류"}

    if not os.path.exists(DB_PATH):
        return {"status": 401, "message": "일치하는 데이터가 없습니다."}

    df = pd.read_csv(DB_PATH, dtype={'therapist_id': int, 'name': str})
    if df.empty:
        return {"status": 401, "message": "등록된 얼굴이 없습니다."}

    names = df["name"].values
    user_ids = df["therapist_id"].values
    embeddings = df.iloc[:, 2:].apply(pd.to_numeric, errors='coerce').values

    print("[INFO] 얼굴을 인식하여 사용자 인증을 진행합니다.")

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

            # ✅ 기존 사용자들과 비교하여 가장 유사한 사용자 찾기
            similarities = [cosine_similarity(embedding, emb) for emb in embeddings]
            max_similarity = np.max(similarities)
            best_match_index = np.argmax(similarities)

            if max_similarity > 0.7:
                print(f"[INFO] {names[best_match_index]}님 환영합니다!" )  # ✅ 인증 성공 메시지 추가
                cap.release()
                return {
                    "status": 200,
                    "message": "인증이 완료되었습니다.",
                    "therapist_id": int(user_ids[best_match_index]),
                    "name": names[best_match_index]
                }

        except Exception as e:
            return {"status": 500, "message": f"얼굴 인식 오류: {e}"}

    cap.release()
    return {"status": 401, "message": "일치하는 데이터가 없습니다."}
