import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Config:
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')  # 기본값 설정

    # 기본값 설정 (DB_PORT가 없을 경우 3306 사용)
    DB_PORT = os.getenv('DB_PORT', '3306')  # 문자열 그대로 유지

    # 로컬 DB 연결 설정
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{DB_PORT}/{os.getenv('DB_NAME')}"
    )

    # 서버 DB 연결 설정
    SQLALCHEMY_BINDS = {
        'server': (
            f"mysql+pymysql://{os.getenv('SERVER_DB_USERNAME')}:{os.getenv('SERVER_DB_PASSWORD')}"
            f"@{os.getenv('SERVER_DB_HOST')}:{os.getenv('SERVER_DB_PORT', '3306')}/{os.getenv('SERVER_DB_NAME')}"
        )
    }

    SQLALCHEMY_TRACK_MODIFICATIONS = False
