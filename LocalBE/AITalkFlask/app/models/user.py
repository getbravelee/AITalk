from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'  # 기존 MySQL 테이블 이름

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)  # NULL 허용하는 컬럼

