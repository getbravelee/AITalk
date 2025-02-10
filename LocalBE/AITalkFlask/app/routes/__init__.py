# 라우트연결
# from .hello import hello_bp
from .detect import detect_bp
from flask import Flask
from .user_face import user_face_bp
from .child_face import child_face_bp

# 라우트 블루프린트 연결
def register_routes(app:Flask):
    # app.register_blueprint(hello_bp)
    app.register_blueprint(detect_bp)
    app.register_blueprint(child_face_bp)
    app.register_blueprint(user_face_bp)

    if "user_face" not in app.blueprints:
        app.register_blueprint(user_face_bp)

    if "child_face" not in app.blueprints:
        app.register_blueprint(child_face_bp)
