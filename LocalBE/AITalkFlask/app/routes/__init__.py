# 라우트연결

from .child_route import child_bp
from .sentence_routes import sentence_bp
from .speech_route import speech_bp
from .card_routes import card_bp
from .session_routes import  session_bp
from .therapist_login import login_bp
from .detect import detect_bp
from flask import Flask
from .user_face import user_face_bp
from .child_face import child_face_bp
from .play_start_route import play_start_bp
from .image_route import image_bp
from .camera_sentence_route import camera_sentence_bp


# 라우트 블루프린트 연결
def register_routes(app):
    app.register_blueprint(card_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(child_bp)
    app.register_blueprint(speech_bp)
    app.register_blueprint(sentence_bp)
    app.register_blueprint(detect_bp)
    app.register_blueprint(child_face_bp)
    app.register_blueprint(user_face_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(camera_sentence_bp)

    if "user_face" not in app.blueprints:
        app.register_blueprint(user_face_bp)

    if "child_face" not in app.blueprints:
        app.register_blueprint(child_face_bp)
    app.register_blueprint(play_start_bp)
