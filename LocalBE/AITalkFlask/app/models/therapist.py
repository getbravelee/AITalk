from app.extensions import db

# ✅ 로컬 Therapist 모델
class Therapist(db.Model):
    __tablename__ = 'speech_therapist'

    therapist_id = db.Column(db.Integer, primary_key=True)
    therapist_name = db.Column(db.String(20), nullable=False)
    id = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # ✅ 로컬 관계 설정 (Therapist끼리만)
    children = db.relationship('Child', back_populates='therapist', cascade="all, delete")
    schedules = db.relationship('Schedule', back_populates='therapist', cascade="all, delete")


# ✅ 서버 Therapist 모델
class ServerTherapist(db.Model):
    __bind_key__ = 'server'
    __tablename__ = 'speech_therapist'

    therapist_id = db.Column(db.Integer, primary_key=True)
    therapist_name = db.Column(db.String(20), nullable=False)
    id = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # ✅ 서버 관계 설정 (ServerTherapist끼리만)
    children = db.relationship('ServerChild', back_populates='therapist', cascade="all, delete")
    schedules = db.relationship('ServerSchedule', back_populates='therapist', cascade="all, delete")
