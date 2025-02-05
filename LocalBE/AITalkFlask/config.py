import os
from dotenv import load_dotenv

# .env 파일 로드

class Config:
    load_dotenv()
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY')  # 시크릿 키 추가
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
