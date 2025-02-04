from app.extensions import db

class SpeechTherapist(db.Model):
    __tablename__ = 'speech_therapist'
    therapist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)