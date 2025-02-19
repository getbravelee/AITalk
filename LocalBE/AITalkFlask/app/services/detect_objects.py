import os
import requests
from utils.sqlite_handler import get_image_from_db, save_image_to_db
from app.models.schedule_model import Schedule  # Schedule 모델 임포트
from sqlalchemy.orm.attributes import flag_modified
from app.extensions import db  # SQLAlchemy 인스턴스 임포트
import openai
# Jetson과 EC2 서버 정보
JETSON_SAVE_DIR = "/home/su/images/"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"
EC2_STATUS_URL = "http://3.38.106.51:7260/api/status"


def download_image(image_url, filename):
    """EC2에서 생성된 이미지를 Jetson에 저장"""
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filepath = os.path.join(JETSON_SAVE_DIR, filename)
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        print(f"✅ Jetson에 이미지 저장 완료: {filepath}")
        return filepath
    return None


def generate_image(word, schedule_id):
    """명사만 사용하여 EC2에 이미지 생성 요청"""
    prompt_ko = f"Translate '{word}' into Korean. Replace underscores (_) with spaces. Respond only with the translated sentence in Korean, without any additional explanation, punctuation, or quotation marks."
    response_ko = openai.ChatCompletion.create (
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt_ko}],
        temperature=0.7
    )
    word_ko = response_ko.choices[0].message.content.strip()
    if schedule_id:
        treatment = Schedule.query.filter_by(treatment_id=schedule_id).first()
        if treatment:
            # 기존 words가 존재하면 리스트로 변환, 없으면 빈 리스트 초기화
            existing_words = treatment.words if treatment.words else []

            # 카드 name 추가 (중복 방지)
            if word_ko not in existing_words:
                existing_words.append(word_ko)
                treatment.words = existing_words

                # 변경 사항 강제 감지
                flag_modified(treatment, "words")

                db.session.commit()
                print(f"treatment_id {schedule_id}의 words 업데이트 완료: {treatment.words}")
        else:
            print(f"treatment_id {schedule_id}에 해당하는 치료 정보를 찾을 수 없습니다.")
            return {"error": f"treatment_id {schedule_id}에 해당하는 치료 정보를 찾을 수 없습니다."}, 404
    # ✅ DB에서 기존 이미지 확인
    existing_image = get_image_from_db(word)
    if existing_image:
        print(f"✅ DB에서 기존 이미지 발견: {existing_image}")
        return {"image": f"http://localhost:5000/images/{word}.png"}

    # ✅ EC2에 이미지 생성 요청
    print(f"🟡 EC2에 이미지 생성 요청: {word}")
    response = requests.post(EC2_GENERATE_URL, json={"prompt": word})

    if response.status_code != 200:
        print("❌ EC2 요청 실패")
        return {"error": "EC2 요청 실패"}



    # ✅ 이미지 생성 대기 후 다운로드
    while True:
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": word})
        status_data = status_response.json()
        status = status_data.get("status")

        if status and status.startswith("http"):
            downloaded_image = download_image(status, f"{word}.png")
            if downloaded_image:
                save_image_to_db(word, downloaded_image)

                return {"image": f"http://localhost:5000/images/{word}.png"}
            return {"error": "이미지 다운로드 실패"}

        if status == "failed":
            return {"error": "이미지 생성 실패"}
