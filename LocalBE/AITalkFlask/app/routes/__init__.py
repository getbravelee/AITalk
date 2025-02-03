# 라우트연결
from .hello import hello_bp
from .detect import detect_bp
from flask import Flask

# 라우트 블루프린트 연결
def register_routes(app:Flask):
    app.register_blueprint(hello_bp)
    app.register_blueprint(detect_bp)
