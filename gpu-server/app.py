from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import model  # model.py에서 함수 호출
import os

app = Flask(__name__)
CORS(app)  # 모든 도메인에서 요청 허용

# 생성된 이미지를 접근 가능하게 설정
IMAGE_DIR = "/home/j-i12e102/images/"
os.makedirs(IMAGE_DIR, exist_ok=True)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # 이미지 생성 요청 -> model.py에서 처리
    result = model.generate_image(prompt)

    if isinstance(result, str) and result.startswith(IMAGE_DIR):
        # 생성된 이미지 경로를 URL로 변환
        filename = os.path.basename(result)
        image_url = f"http://<EC2-PUBLIC-IP>:5000/images/{filename}"
        return jsonify({"image_url": image_url, "filepath": result})
    else:
        return jsonify({"error": result}), 500

# 이미지 폴더를 정적 파일로 제공
@app.route("/images/<filename>")
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5220)
