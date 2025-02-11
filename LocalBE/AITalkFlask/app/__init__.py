from flask import Flask
from .extensions import db
from flask_cors import CORS
from .routes import register_routes
from .routes.child_face import child_face_bp
from .routes.user_face import user_face_bp
from .routes.detect import detect_bp  # 새로 추가한 detect Blueprint

def create_app():
    app = Flask(__name__)

    # 설정 파일 로드 (필요한 경우)
    # app.config.from_object('config.Config')

    # MySQL 및 기타 확장 모듈 초기화 (필요한 경우)
    # db.init_app(app)

    # 라우트 등록 (추가적인 Blueprint는 register_routes()에서 처리할 수도 있음)
    register_routes(app)

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
