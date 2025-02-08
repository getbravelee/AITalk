from flask import Flask
from flask_cors import CORS
from flask_session import Session

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

    # ✅ 세션 설정
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_HTTPONLY'] = False
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = False


    # MySQL 및 확장 모듈 초기화
    db.init_app(app)

    socketio.init_app(app, cors_allowed_origins="*", async_mode='eventlet')


    # 라우트 등록
    register_routes(app)

    return app
