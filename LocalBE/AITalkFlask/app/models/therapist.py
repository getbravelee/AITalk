from app.extensions import db

class Therapist(db.Model):
    __tablename__ = 'speech_therapist'  # 기존 MySQL 테이블 이름

    therapist_id = db.Column(db.Integer, primary_key=True)
    therapist_name = db.Column(db.String(20), nullable=False)  # NULL 허용하는 컬럼

