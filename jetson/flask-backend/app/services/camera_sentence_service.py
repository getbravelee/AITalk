import os
import requests
from utils.sqlite_handler import get_image_from_db, save_image_to_db

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


def generate_image(word, word2):
    """명사와 동사를 조합하여 EC2에 이미지 생성 요청"""
    prompt = f"{word}_{word2}"  # 예: "cup break"

    # ✅ DB에서 기존 이미지 확인
    existing_image = get_image_from_db(prompt)
    if existing_image:
        print(f"✅ DB에서 기존 이미지 발견: {existing_image}")
        return {"image": f"http://localhost:5000/images/{prompt}.png"}

    # ✅ EC2에 이미지 생성 요청
    print(f"🟡 EC2에 이미지 생성 요청: {prompt}")
    response = requests.post(EC2_GENERATE_URL, json={"prompt": prompt})

    if response.status_code != 200:
        print("❌ EC2 요청 실패")
        return {"error": "EC2 요청 실패"}

    # ✅ 이미지 생성 대기 후 다운로드
    while True:
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": prompt})
        status_data = status_response.json()
        status = status_data.get("status")

        if status and status.startswith("http"):
            downloaded_image = download_image(status, f"{prompt}.png")
            if downloaded_image:
                save_image_to_db(prompt, downloaded_image)
                return {"image": f"http://localhost:5000/images/{prompt}.png"}
            return {"error": "이미지 다운로드 실패"}

        if status == "failed":
            return {"error": "이미지 생성 실패"}
