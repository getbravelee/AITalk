from gevent import monkey
monkey.patch_all()
from app import create_app, socketio


app = create_app()  # Flask 앱 생성

if __name__ == '__main__':
    print("실행")
    socketio.run(app, host='127.0.0.1', port=5000, debug=False)
