from flask import Flask
from .extensions import db
from .routes import register_routes
# from .routes.user_face import face_bp  # face_bp 가져오기
from .routes.child_face import child_face_bp
from .routes.user_face import user_face_bp


def create_app():
    app = Flask(__name__)

    # 설정 파일 로드
    app.config.from_object('config.Config')

    # MySQL 및 확장 모듈 초기화
    db.init_app(app)

    # 라우트 등록
    register_routes(app)

    # 블루프린트 등록
    # app.register_blueprint(face_bp)
    app.register_blueprint(child_face_bp)
    app.register_blueprint(user_face_bp)

    return app
