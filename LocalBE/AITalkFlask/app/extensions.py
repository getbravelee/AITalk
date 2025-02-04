from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

# socketio 인스턴스 생성
socketio = SocketIO(cors_allowed_origins="*", async_mode='eventlet')

db = SQLAlchemy()
