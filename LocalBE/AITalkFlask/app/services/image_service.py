from flask import Flask, request, jsonify
import requests
import os
import sqlite3  # 간단한 로컬 DB 사용 (MySQL, MongoDB 등으로 변경 가능)

app = Flask(__name__)

JETSON_SAVE_DIR = "/desktop/study/ssafyProject/commonPJT/images/"
EC2_SERVER_URL = "http://3.38.106.51:7260/api/generate"  # EC2의 Spring Boot API
DB_PATH = "/desktop/study/ssafyProject/commonPJT/image_db.sqlite"  # SQLite DB 파일

os.makedirs(JETSON_SAVE_DIR, exist_ok=True)

# SQLite DB 초기화 (테이블 생성)
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

@app.route("/generate", methods=["POST"])
def request_image():
    """이미지가 있으면 반환, 없으면 EC2에 생성 요청 후 다운로드"""
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # 1️⃣ DB에서 이미지 경로 확인
    existing_image = get_image_from_db(prompt)
    if existing_image:
        print(f"✅ 기존 이미지 발견: {existing_image}")
        return jsonify({"image_path": existing_image})

    # 2️⃣ 이미지가 없으면 EC2에 생성 요청
    response = requests.post(EC2_SERVER_URL, json={"prompt": prompt})

    if response.status_code == 200:
        data = response.json()
        image_url = data.get("image_url")

        if image_url:
            downloaded_image = download_image(image_url)
            if downloaded_image:
                # 3️⃣ 새로 생성된 이미지 경로를 DB에 저장
                save_image_to_db(prompt, downloaded_image)
                return jsonify({"image_path": downloaded_image})
        return jsonify({"error": "Failed to receive image URL"}), 500
    else:
        return jsonify({"error": "EC2 request failed"}), response.status_code

def download_image(image_url):
    """EC2에서 생성된 이미지를 다운로드하여 Jetson에 저장"""
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