from flask import Flask
from .extensions import db
from .routes import register_routes


def create_app():
    print("create_app() has been called!")
    app = Flask(__name__)

    # 설정 파일 로드
    app.config.from_object('config.Config')

    print(f"Loaded secret key: {app.secret_key}")

    # MySQL 및 확장 모듈 초기화
    db.init_app(app)

    # 라우트 등록
    register_routes(app)

    return app
