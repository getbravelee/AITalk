from app import create_app  # app/__init__.py에서 create_app 함수 가져오기

app = create_app()  # Flask 앱 생성

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Flask 실행
