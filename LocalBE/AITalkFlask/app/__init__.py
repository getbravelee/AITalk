from flask import Flask
from flask_cors import CORS
from .extensions import db
from dotenv import load_dotenv
from .routes import register_routes
from app.extensions import socketio

load_dotenv()

def create_app():
    print("create_app() has been called!")
    app = Flask(__name__)
    CORS(app, supports_credentials=True)


    # 설정 파일 로드
    app.config.from_object('config.Config')

    print(f"Loaded secret key: {app.secret_key}")

    # MySQL 및 확장 모듈 초기화
    db.init_app(app)

    socketio.init_app(app, cors_allowed_origins="*", async_mode='eventlet')


    # 라우트 등록
    register_routes(app)

    return app
