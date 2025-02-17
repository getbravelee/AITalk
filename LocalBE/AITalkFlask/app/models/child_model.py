from app.extensions import db
from .therapist import Therapist, ServerTherapist

# ✅ 로컬 Child 모델
class Child(db.Model):
    __tablename__ = 'care_children'

    child_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey('speech_therapist.therapist_id'))
    child_name = db.Column(db.String(20), nullable=False)
    disability_type = db.Column(db.String(20))
    age = db.Column(db.Integer)

    # ✅ Therapist와 관계 설정
    therapist = db.relationship('Therapist', back_populates='children')

    # ✅ schedules 관계 추가 (문제 해결)
    schedules = db.relationship('Schedule', back_populates='child', cascade="all, delete")


# ✅ 서버 Child 모델
class ServerChild(db.Model):
    __bind_key__ = 'server'
    __tablename__ = 'care_children'

    child_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey('speech_therapist.therapist_id'))
    child_name = db.Column(db.String(20), nullable=False)
    disability_type = db.Column(db.String(20))
    age = db.Column(db.Integer)

    # ✅ 서버 Therapist와 관계 설정
    therapist = db.relationship('ServerTherapist', back_populates='children')

    # ✅ 서버 schedules 관계 추가 (문제 해결)
    schedules = db.relationship('ServerSchedule', back_populates='child', cascade="all, delete")
