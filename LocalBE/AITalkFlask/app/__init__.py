from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import db, socketio
from .routes import register_routes
from .routes.child_face import child_face_bp
from .routes.user_face import user_face_bp
from .routes.detect import detect_bp  # 새로 추가한 detect Blueprintfrom app.services.sync_service import sync_server_to_local, sync_local_to_server
from app.services.sync_service import sync_server_to_local, sync_local_to_server
import atexit  # 서버 종료 시 동기화를 위해 추가


# 환경 변수 로드
load_dotenv()

def create_app():
    print("create_app() has been called!")
    app = Flask(__name__)

    # 설정 파일 로드 (비밀키 등)
    app.config.from_object('config.Config')
    print(f"Loaded secret key: {app.secret_key}")

    # CORS 설정 (설정 파일 이후에 적용)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    # ✅ 세션 설정
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_HTTPONLY'] = False
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = False

    # MySQL 및 기타 확장 모듈 초기화
    db.init_app(app)
    socketio.init_app(app)

    # 라우트 등록 (추가적인 Blueprint는 register_routes()에서 처리할 수도 있음)
    register_routes(app)

    # ✅ 앱 시작 시 데이터 동기화 (앱 컨텍스트 활성화)
    with app.app_context():
        print("앱 시작 시 서버 데이터 → 로컬 데이터 동기화 중...")
        sync_server_to_local()

    # ✅ 서버 종료 시 최종 데이터 동기화
    @atexit.register
    def on_server_shutdown():
        print("서버 종료 시 최종 데이터 동기화 중...")
        with app.app_context():  # 애플리케이션 컨텍스트 추가
            sync_local_to_server()

    # CORS 설정 추가
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Blueprint 등록 (중복 등록 방지)
    if "child_face" not in app.blueprints:
        app.register_blueprint(child_face_bp)

    if "user_face" not in app.blueprints:
        app.register_blueprint(user_face_bp)

    # 새 detect Blueprint 등록
    if "detect" not in app.blueprints:
        app.register_blueprint(detect_bp)

    return app
