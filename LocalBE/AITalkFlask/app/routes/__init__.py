# 라우트연결
from .hello import hello_bp

# 라우트 블루프린트 연결
def register_routes(app):
    app.register_blueprint(hello_bp)
