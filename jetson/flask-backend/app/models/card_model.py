from app.extensions import db

class Card(db.Model):
    __tablename__ = 'card'

    card_id = db.Column(db.Integer, primary_key=True, autoincrement=False)  # UNSIGNED는 Python에서 필요 없음
    name = db.Column(db.String(20), nullable=False)
    image = db.Column(db.String(20), nullable=True)  # 이미지 경로 또는 파일명 저장
    categories = db.Column(db.JSON, nullable=True)  # JSON 컬럼 추가 (기본값 NULL)

