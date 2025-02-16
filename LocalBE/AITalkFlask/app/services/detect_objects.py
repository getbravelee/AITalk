import requests

# EC2 API 엔드포인트
EC2_URL = "http://3.38.106.51:7260/api/word"  # EC2에서 word를 받을 API

def process_detected_object(word):
    """
    EC2 서버로 word(사물명)만 전달하는 함수
    (이미지 생성 요청이 아니라 단순히 단어 전달)
    """
    try:
        payload = {"word": word}  # EC2로 보낼 데이터 (word만 포함)
        print(f"🚀 EC2로 단어 전달: {payload}")

        # EC2로 단어만 전달
        response = requests.post(EC2_URL, json=payload)

        if response.status_code != 200:
            return {"error": "EC2 서버 응답 오류"}, response.status_code

        # 요청이 정상적으로 전달되었음을 React에 응답
        return {"message": "EC2에 단어를 전달했습니다."}

    except requests.exceptions.RequestException as e:
        return {"error": f"EC2 통신 오류: {str(e)}"}, 500
