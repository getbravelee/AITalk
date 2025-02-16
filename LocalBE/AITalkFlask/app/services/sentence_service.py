import openai
import os
import requests
from utils.sqlite_handler import get_image_from_db, save_image_to_db
from app.models.schedule_model import db, Schedule
from sqlalchemy.orm.attributes import flag_modified

JETSON_SAVE_DIR = "C:/images"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"
EC2_STATUS_URL = "http://3.38.106.51:7260/api/status"

# ✅ OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

def download_image(image_url, prompt):
    """EC2에서 생성된 이미지를 Jetson에 저장"""
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filename = f"{prompt}.png"
        filepath = os.path.join(JETSON_SAVE_DIR, filename)
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        print(f"✅ Jetson에 이미지 저장 완료: {filepath}")
        return filepath
    return None

def generate_three_word_sentence(prompt, schedule_id=None):  # ✅ schedule_id 추가
    """3어절 문장 생성 (한국어 & 영어) + 이미지 요청 + DB 업데이트"""
    prompt_ko = f"'{prompt}'를 포함하는 정확히 3어절로 된 한국어 문장을 만들어주세요. 마침표 사용하지 마. 문장에 공백을 사용하지 말고 _ 으로 대체해서 문장 만들어줘"




    try:
        # ✅ 한국어 문장 생성
        response_ko = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt_ko}],
            temperature=0.7
        )
        sentence_ko = response_ko["choices"][0]["message"]["content"].strip()

        prompt_en = f"Translate the following Korean sentence into a natural and meaningful English sentence: '{sentence_ko}'. Ensure the translation accurately reflects the meaning without adding extra descriptions. Do not use a period at the end. Do not include any Korean text in the response."



        # ✅ 영어 문장 생성
        response_en = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt_en}],
            temperature=0.7
        )
        sentence_en = response_en["choices"][0]["message"]["content"].strip()

        print(f"✅ 생성된 문장: 한국어 - {sentence_ko} / 영어 - {sentence_en}")

        # ✅ EC2에 보낼 영어 문장 확인
        if not sentence_en or len(sentence_en.split()) < 2:
            print("❌ 영어 문장이 생성되지 않음. 기본 프롬프트 사용")
            sentence_en = prompt.replace("_", " ")

        # ✅ DB에서 기존 이미지 확인
        existing_image = get_image_from_db(sentence_en)
        if existing_image:
            print(f"✅ DB에서 기존 이미지 발견: {existing_image}")
            return {"ko": sentence_ko, "en": sentence_en, "image_url": f"http://localhost:5000/images/{sentence_en}.png"}

        # ✅ EC2에 이미지 생성 요청
        print(f"🟡 EC2에 이미지 생성 요청: {sentence_en}")
        response = requests.post(EC2_GENERATE_URL, json={"prompt": sentence_en})

        if response.status_code != 200:
            print(f"❌ EC2 요청 실패: {response.status_code}, 응답 내용: {response.text}")
            return {"error": "EC2 요청 실패"}

        # ✅ 이미지 생성 대기 후 다운로드
        while True:
            status_response = requests.get(EC2_STATUS_URL, params={"prompt": sentence_en})
            status_data = status_response.json()
            status = status_data.get("status")

            if status and status.startswith("http"):
                downloaded_image = download_image(status, sentence_en)
                if downloaded_image:
                    save_image_to_db(sentence_en, downloaded_image)
                    return {"ko": sentence_ko, "en": sentence_en, "image_url": f"http://localhost:5000/images/{sentence_en}.png"}
                return {"error": "이미지 다운로드 실패"}

            if status == "failed":
                print(f"❌ EC2에서 이미지 생성 실패: {status_data}")
                return {"error": "이미지 생성 실패"}

        # ✅ `schedule_id`가 있을 경우 DB 업데이트
        if schedule_id:
            treatment = Schedule.query.filter_by(treatment_id=schedule_id).first()
            if treatment:
                # 빈 값 처리
                if treatment.sentence in (None, {}, ''):
                    treatment.sentence = []

                # 문장 추가
                treatment.sentence.append(sentence_ko)

                # 변경 사항 강제 감지
                flag_modified(treatment, "sentence")
                db.session.commit()  # DB 반영

                print(f"✅ treatment_id {schedule_id}의 sentence 업데이트 완료: {treatment.sentence}")
            else:
                return {"error": f"treatment_id {schedule_id}에 해당하는 치료 정보를 찾을 수 없습니다."}, 404

        return {"text": sentence_ko, "image": f"http://localhost:5000/images/{sentence_en}.png"}

    except Exception as e:
        print(f"❌ OpenAI API 호출 중 오류 발생: {e}")
        return None

