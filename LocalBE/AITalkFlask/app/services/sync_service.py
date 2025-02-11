from app.models import Therapist, Child, ServerTherapist, ServerChild, Schedule, ServerSchedule
from app.extensions import db
from sqlalchemy import text

def sync_server_to_local():
    try:
        # 외래 키 제약 조건 비활성화
        db.session.execute(text("SET FOREIGN_KEY_CHECKS = 0"))

        # 자식 테이블(Child) 먼저 삭제
        Child.query.delete()
        # 부모 테이블(Therapist) 삭제
        Therapist.query.delete()

        # 외래 키 제약 조건 다시 활성화
        db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1"))

        # 서버 DB에서 데이터 가져오기
        server_therapists = ServerTherapist.query.all()
        server_children = ServerChild.query.all()

        # 서버 DB 데이터를 로컬로 복사
        for therapist in server_therapists:
            local_therapist = Therapist(
                therapist_id=therapist.therapist_id,
                therapist_name=therapist.therapist_name,
                id=therapist.id,
                password=therapist.password
            )
            db.session.add(local_therapist)

        for child in server_children:
            local_child = Child(
                child_id=child.child_id,
                therapist_id=child.therapist_id,
                child_name=child.child_name,
                profile_image=child.profile_image,
                disability_type=child.disability_type,
                age=child.age
            )
            db.session.add(local_child)

        db.session.commit()
        print("서버에서 로컬로 데이터 동기화 완료")

    except Exception as e:
        db.session.rollback()
        print(f"서버에서 로컬로 데이터 동기화 실패: {e}")

def sync_local_to_server():
    try:
        # 로컬 DB에서 데이터 가져오기
        local_schedules = Schedule.query.all()

        for schedule in local_schedules:
            server_schedule = ServerSchedule.query.filter_by(treatment_id=schedule.treatment_id).first()

            if server_schedule:
                # 서버에 이미 존재하면 업데이트
                server_schedule.therapist_id = schedule.therapist_id
                server_schedule.child_id = schedule.child_id
                server_schedule.treatment_date = schedule.treatment_date
                server_schedule.start_time = schedule.start_time
                server_schedule.end_time = schedule.end_time
                server_schedule.words = schedule.words
                server_schedule.sentence = schedule.sentence
                server_schedule.conversation = schedule.conversation
            else:
                # 서버에 없으면 새로 추가
                new_schedule = ServerSchedule(
                    treatment_id=schedule.treatment_id,
                    therapist_id=schedule.therapist_id,
                    child_id=schedule.child_id,
                    treatment_date=schedule.treatment_date,
                    start_time=schedule.start_time,
                    end_time=schedule.end_time,
                    words=schedule.words,
                    sentence=schedule.sentence,
                    conversation=schedule.conversation
                )
                db.session.add(new_schedule)

        db.session.commit()
        print("로컬에서 서버로 데이터 동기화 완료")

    except Exception as e:
        db.session.rollback()
        print(f"로컬에서 서버로 데이터 동기화 실패: {e}")
