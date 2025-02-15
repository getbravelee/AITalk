import requests
import time
import os
import sqlite3
from PIL import Image

# Jetson 저장 경로 (EC2에서 받은 이미지 저장)
JETSON_SAVE_DIR = "/home/su/images/"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"
EC2_STATUS_URL = "http://3.38.106.51:7260/api/status"
DB_PATH = "/home/su/image_db.sqlite"  # SQLite DB 경로 변경

# 저장 폴더 생성
os.makedirs(JETSON_SAVE_DIR, exist_ok=True)

# SQLite DB 초기화
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT UNIQUE NOT NULL,
            image_path TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()  # 서버 실행 시 DB 초기화

def get_image_from_db(prompt):
    """DB에서 프롬프트에 해당하는 이미지 경로 조회"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT image_path FROM images WHERE prompt = ?", (prompt,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

def save_image_to_db(prompt, image_path):
    """DB에 이미지 경로 저장"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO images (prompt, image_path) VALUES (?, ?)", (prompt, image_path))
    conn.commit()
    conn.close()

def download_image(image_url):
    """EC2(Spring)에서 생성된 이미지를 다운로드"""
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filename = os.path.basename(image_url)
        filepath = os.path.join(JETSON_SAVE_DIR, filename)

        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        print(f"✅ 이미지 다운로드 완료: {filepath}")
        return filepath
    else:
        print("❌ 이미지 다운로드 실패:", response.text)
        return None

def request_image(prompt):
    """이미지를 요청하고, 생성 완료 후 Jetson에 저장"""
    existing_image = get_image_from_db(prompt)
    if existing_image:
        print(f"✅ 기존 이미지 발견: {existing_image}")
        Image.open(existing_image).show()
        return existing_image

    # 1️⃣ EC2(Spring)에서 이미지 생성 요청
    response = requests.post(EC2_GENERATE_URL, json={"prompt": prompt})
    if response.status_code != 200:
        print("❌ EC2 요청 실패")
        return None

    # 2️⃣ 이미지가 생성될 때까지 대기
    print("⏳ 이미지 생성 중...")
    while True:
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": prompt})
        status_data = status_response.json()
        status = status_data.get("status")

        if status and status.startswith("http"):
            print(f"✅ 이미지 생성 완료: {status}")
            downloaded_image = download_image(status)
            if downloaded_image:
                save_image_to_db(prompt, downloaded_image)
                Image.open(downloaded_image).show()
            return downloaded_image

        if status == "failed":
            print("❌ 이미지 생성 실패")
            return None

        time.sleep(3)  # 3초 간격으로 확인