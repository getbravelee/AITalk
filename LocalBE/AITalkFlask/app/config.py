import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Config:
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY')  # 시크릿 키 추가

    # 로컬 DB 연결 설정
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )

    # 서버 DB 연결 설정
    SQLALCHEMY_BINDS = {
        'server': (
            f"mysql+pymysql://{os.getenv('SERVER_DB_USERNAME')}:{os.getenv('SERVER_DB_PASSWORD')}"
            f"@{os.getenv('SERVER_DB_HOST')}:{os.getenv('SERVER_DB_PORT')}/{os.getenv('SERVER_DB_NAME')}"
        )
    }

    SQLALCHEMY_TRACK_MODIFICATIONS = False
