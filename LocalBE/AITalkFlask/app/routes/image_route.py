from flask import Blueprint, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import sys
import os
from utils.sqlite_handler import get_image_from_db, save_image_to_db

image_bp = Blueprint('image_bp', __name__)

JETSON_SAVE_DIR = "/home/su/images/"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"
EC2_STATUS_URL = "http://3.38.106.51:7260/api/status"

os.makedirs(JETSON_SAVE_DIR, exist_ok=True)

def download_image(image_url, prompt):
    """EC2에서 생성된 이미지를 다운로드하여 Jetson에 저장"""
    response = requests.get(image_url, stream=True)

    if response.status_code == 200:
        filename = f"{prompt}.png"  # 프롬프트명으로 파일 저장
        filepath = os.path.join(JETSON_SAVE_DIR, filename)

        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        print(f"✅ Jetson에 이미지 저장 완료: {filepath}")
        return filepath
    return None

@image_bp.route("/generate", methods=["POST"])
def request_image():
    """이미지가 있으면 DB에서 반환, 없으면 EC2에 요청 후 Jetson에 저장"""
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # 1️⃣ DB에서 이미지 확인
    existing_image = get_image_from_db(prompt)
    if existing_image:
        print(f"✅ DB에서 기존 이미지 발견: {existing_image}")
        return jsonify({"image_url": f"http://localhost:5000/images/{prompt}.png"})

    # 2️⃣ EC2에 이미지 생성 요청
    print(f"🟡 EC2에 이미지 생성 요청: {prompt}")
    response = requests.post(EC2_GENERATE_URL, json={"prompt": prompt})

    if response.status_code != 200:
        print("❌ EC2 요청 실패")
        return jsonify({"error": "EC2 요청 실패"}), response.status_code

    # 3️⃣ 이미지가 생성될 때까지 대기
    while True:
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": prompt})
        status_data = status_response.json()
        status = status_data.get("status")

        if status and status.startswith("http"):
            downloaded_image = download_image(status, prompt)
            if downloaded_image:
                save_image_to_db(prompt, downloaded_image)
                return jsonify({"image_url": f"http://localhost:5000/images/{prompt}.png"})
            return jsonify({"error": "이미지 다운로드 실패"}), 500

        if status == "failed":
            return jsonify({"error": "이미지 생성 실패"}), 500

@image_bp.route("/images/<filename>")
def serve_image(filename):
    """Jetson에 저장된 이미지를 반환"""
    return send_from_directory(JETSON_SAVE_DIR, filename)