# 라우트연결

from .child_route import child_bp
from .speech_route import speech_bp
from .card_routes import card_bp
from .session_routes import  session_bp
from .therapist_login import login_bp

# 라우트 블루프린트 연결
def register_routes(app):
    app.register_blueprint(card_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(child_bp)
    app.register_blueprint(speech_bp)