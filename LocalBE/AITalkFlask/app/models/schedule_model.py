from app.extensions import db
from .therapist import Therapist, ServerTherapist
from .child_model import Child, ServerChild

# ✅ 로컬 Schedule 모델
class Schedule(db.Model):
    __tablename__ = 'treatment'

    treatment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey('speech_therapist.therapist_id'), nullable=False)
    child_id = db.Column(db.Integer, db.ForeignKey('care_children.child_id'), nullable=True)
    treatment_date = db.Column(db.Date)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    words = db.Column(db.JSON)
    sentence = db.Column(db.JSON)
    conversation = db.Column(db.String(100))

    # ✅ 로컬 Therapist와 Child 연결
    therapist = db.relationship('Therapist', back_populates='schedules')
    child = db.relationship('Child', back_populates='schedules')


# ✅ 서버 Schedule 모델
class ServerSchedule(db.Model):
    __bind_key__ = 'server'
    __tablename__ = 'treatment'

    treatment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey('speech_therapist.therapist_id'), nullable=False)
    child_id = db.Column(db.Integer, db.ForeignKey('care_children.child_id'), nullable=True)
    treatment_date = db.Column(db.Date)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    words = db.Column(db.JSON)
    sentence = db.Column(db.JSON)
    conversation = db.Column(db.String(100))

    # ✅ 서버 Therapist와 Child 연결
    therapist = db.relationship('ServerTherapist', back_populates='schedules')
    child = db.relationship('ServerChild', back_populates='schedules')
