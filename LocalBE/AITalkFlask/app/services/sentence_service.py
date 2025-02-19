import openai
import os
import requests
import json
import time
from utils.sqlite_handler import get_image_from_db, save_image_to_db
from app.models.schedule_model import Schedule
from sqlalchemy.orm.attributes import flag_modified
from app.extensions import db

JETSON_SAVE_DIR = "/home/su/images/"
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

def generate_three_word_sentence(schedule_id, prompt):
    """3어절 문장 생성 (영어 & 한국어) + 이미지 요청 + DB 업데이트"""
    prompt_en = f"Create a three-word sentence including the word '{prompt}' in English. Replace spaces with underscores (_). Use action-related verbs like run, sit, write. Avoid abstract verbs like, hate. Make sentences in the present progressive form. Do not include a period (.) at the end of the sentence."

    try:
        # ✅ 영어 문장 생성
        response_en = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt_en}],
            temperature=0.7
        )
        sentence_en = response_en.choices[0].message.content.strip()

        prompt_ko = f"Translate '{sentence_en}' into Korean. Replace underscores (_) with spaces. Respond only with the translated sentence in Korean, without any additional explanation, punctuation, or quotation marks."


        # ✅ 한국어 문장 생성
        response_ko = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt_ko}],
            temperature=0.7
        )
        sentence_ko = response_ko.choices[0].message.content.strip()
        treatment = Schedule.query.filter_by(treatment_id=schedule_id).first()
        if treatment:
            # 빈 값 처리
            if treatment.sentence in (None, {}, ''):
                treatment.sentence = []

            # 문장 추가
            treatment.sentence.append(sentence_ko)

            # 변경 사항 강제 감지
            flag_modified(treatment, "sentence")

            db.session.commit()  # 커밋으로 DB 반영

        print(f"✅ 생성된 문장: 한국어 - {sentence_ko} / 영어 - {sentence_en}")

        # ✅ DB에서 기존 이미지 확인 (이미 있으면 바로 반환)
        existing_image = get_image_from_db(sentence_en)
        if existing_image:
            print(f"✅ DB에서 기존 이미지 발견: {existing_image}")
            return {"text": sentence_ko, "en": sentence_en, "image": f"http://localhost:5000/images/{sentence_en}.png"}

        # ✅ EC2에서 기존 이미지 확인
        print(f"🟡 EC2에서 이미지 상태 확인: {sentence_en}")
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": sentence_en})

        try:
            status_data = status_response.json()
            status = status_data.get("status")
        except Exception:
            print("❌ EC2 응답에서 JSON 파싱 실패")
            return {"error": "EC2 상태 확인 실패"}

        # ✅ EC2에 기존 이미지가 있다면 다운로드
        if status and status.startswith("http"):
            print(f"✅ EC2에서 기존 이미지 발견, 다운로드 시도: {status}")
            downloaded_image = download_image(status, sentence_en)
            if downloaded_image:
                save_image_to_db(sentence_en, downloaded_image)
                return {"text": sentence_ko, "image": f"http://localhost:5000/images/{sentence_en}.png"}
            return {"error": "이미지 다운로드 실패"}

        # ✅ EC2에 이미지 요청 (새로운 이미지 생성 필요)
        print(f"🟡 EC2에 이미지 생성 요청: {sentence_en}")
        response = requests.post(EC2_GENERATE_URL, json={"prompt": sentence_en})

        if response.status_code != 200:
            print(f"❌ EC2 요청 실패: {response.status_code}, 응답 내용: {response.text}")
            return {"error": "EC2 요청 실패"}

        # ✅ 이미지 생성 대기 후 다운로드 (최대 10번 재시도)
        MAX_RETRIES = 10
        retry_count = 0
        while retry_count < MAX_RETRIES:
            status_response = requests.get(EC2_STATUS_URL, params={"prompt": sentence_en})
            try:
                status_data = status_response.json()
                status = status_data.get("status")
            except Exception:
                print("❌ EC2 응답에서 JSON 파싱 실패")
                return {"error": "EC2 상태 확인 실패"}

            if status and status.startswith("http"):
                downloaded_image = download_image(status, sentence_en)
                if downloaded_image:
                    save_image_to_db(sentence_en, downloaded_image)
                    return {"text": sentence_ko, "image": f"http://localhost:5000/images/{sentence_en}.png"}
                return {"error": "이미지 다운로드 실패"}

            if status == "failed":
                print(f"❌ EC2에서 이미지 생성 실패: {status_data}")
                return {"error": "이미지 생성 실패"}

            retry_count += 1
            time.sleep(3)  # 3초 대기 후 재시도

        print("❌ 최대 재시도 횟수를 초과하여 이미지 생성 요청을 중단합니다.")
        return {"error": "이미지 생성 응답 없음"}

    except Exception as e:
        print(f"❌ OpenAI API 호출 중 오류 발생: {e}")
        return {"error": str(e)}
