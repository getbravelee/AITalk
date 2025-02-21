from gevent import monkey
monkey.patch_all()
from app import create_app, socketio
from flask_cors import CORS


app = create_app()  # Flask 앱 생성
CORS(app)

if __name__ == '__main__':
    print("flask 실행")
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
