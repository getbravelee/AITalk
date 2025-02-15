from flask import Flask, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

JETSON_SAVE_DIR = "/home/su/images/"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"
EC2_STATUS_URL = "http://3.38.106.51:7260/api/status"

os.makedirs(JETSON_SAVE_DIR, exist_ok=True)

def download_image(image_url, filename):
    """EC2에서 이미지를 다운로드하여 Jetson에 저장"""
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filepath = os.path.join(JETSON_SAVE_DIR, filename)
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        return filepath
    return None

@app.route("/generate", methods=["POST"])
def request_image():
    """이미지를 생성 요청 후 Jetson에 저장"""
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # EC2에 요청
    response = requests.post(EC2_GENERATE_URL, json={"prompt": prompt})
    if response.status_code != 200:
        return jsonify({"error": "EC2 요청 실패"}), response.status_code

    # 이미지가 생성될 때까지 대기
    while True:
        status_response = requests.get(EC2_STATUS_URL, params={"prompt": prompt})
        status_data = status_response.json()
        status = status_data.get("status")

        if status and status.startswith("http"):
            downloaded_image = download_image(status, f"{prompt}.png")
            if downloaded_image:
                return jsonify({"image_path": downloaded_image})

        if status == "failed":
            return jsonify({"error": "이미지 생성 실패"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5220)