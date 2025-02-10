from app.extensions import db

class Schedule(db.Model):
    __tablename__ = 'treatment'  # 실제 테이블 이름은 'schedule'

    schedule_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, nullable=False)
    child_id = db.Column(db.Integer, nullable=True)
    treatment_date = db.Column(db.Date)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    words = db.Column(db.JSON)
    sentence = db.Column(db.JSON)
    conversation = db.Column(db.String(100))

# class ServerSchedule(db.Model):
#     __bind_key__ = 'server'  # 서버 DB 연결을 위한 바인딩
#     __tablename__ = 'treatment'  # 실제 테이블 이름은 'schedule'
#
#     schedule_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     therapist_id = db.Column(db.Integer, nullable=False)
#     child_id = db.Column(db.Integer, nullable=True)
#     treatment_date = db.Column(db.Date)
#     start_time = db.Column(db.Time)
#     end_time = db.Column(db.Time)
#     words = db.Column(db.JSON)
#     sentence = db.Column(db.JSON)
#     conversation = db.Column(db.String(100))