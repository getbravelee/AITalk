import requests
import os
import sqlite3
from PIL import Image

JETSON_SAVE_DIR = "/Users/isu/Desktop/study/ssafyProject/commonPJT/images/"
EC2_GENERATE_URL = "http://3.38.106.51:7260/api/generate"

os.makedirs(JETSON_SAVE_DIR, exist_ok=True)


def request_image(prompt):
    """이미지가 있으면 반환, 없으면 EC2에 요청"""
    filename = f"{prompt}.png"  # 🚀 프롬프트 그대로 파일명 사용
    filepath = os.path.join(JETSON_SAVE_DIR, filename)

    if os.path.exists(filepath):
        print(f"✅ 기존 이미지 발견: {filepath}")
        Image.open(filepath).show()
        return filepath

    response = requests.post(EC2_GENERATE_URL, json={"prompt": prompt})
    if response.status_code == 200:
        data = response.json()
        image_url = data.get("image_url")

        if image_url:
            response = requests.get(image_url, stream=True)
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"✅ 이미지 다운로드 완료: {filepath}")
            Image.open(filepath).show()
            return filepath
    print("❌ 이미지 생성 실패")
    return None


# ✅ 사용자 입력을 받아서 요청 가능하게 변경
if __name__ == "__main__":
    user_input = input("생성할 이미지 프롬프트 입력: ")  # 📝 동적으로 사용자 입력 받기
    request_image(user_input)