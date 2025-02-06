from app.extensions import db

class Child(db.Model):
    __tablename__ = 'care_children'

    child_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey('speech_therapist.therapist_id'))
    child_name = db.Column(db.String(20), nullable=False)
    profile_image = db.Column(db.LargeBinary)
    disability_type = db.Column(db.String(20))
    age = db.Column(db.Integer)

    # 관계 설정 (옵션)
    therapist = db.relationship('Therapist', backref='children')
