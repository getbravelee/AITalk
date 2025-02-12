from app.models import Therapist, Child, ServerTherapist, ServerChild, Schedule, ServerSchedule
from app.extensions import db
from sqlalchemy import text, and_
from datetime import datetime

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

def update_local_end_time():
    try:
        # treatment_id가 가장 높은 로컬 스케줄 찾기
        max_treatment_schedule = Schedule.query.order_by(Schedule.treatment_id.desc()).first()
        if max_treatment_schedule:
            max_treatment_schedule.end_time = datetime.now()
            db.session.commit()
            print(f"로컬의 최고 treatment_id({max_treatment_schedule.treatment_id})의 end_time을 현재 시간으로 업데이트 완료")
    except Exception as e:
        db.session.rollback()
        print(f"로컬 end_time 업데이트 실패: {e}")

def sync_local_to_server():
    try:
        # 로컬 DB의 end_time을 먼저 갱신
        update_local_end_time()

        # 로컬 DB에서 데이터 가져오기
        local_schedules = Schedule.query.all()

        for schedule in local_schedules:
            server_schedule = ServerSchedule.query.filter(
                and_(
                    ServerSchedule.treatment_date == schedule.treatment_date,
                    ServerSchedule.start_time <= schedule.start_time,
                    ServerSchedule.end_time >= schedule.start_time
                )
            ).first()

            if server_schedule:
                # 서버에 이미 존재하면 업데이트
                server_schedule.words = schedule.words
                server_schedule.sentence = schedule.sentence
                server_schedule.conversation = schedule.conversation
                print(f"업데이트 완료: {schedule.treatment_id}")
            else:
                # 서버에 없으면 새로 추가
                new_schedule = ServerSchedule(
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
                print(f"새로운 스케줄 추가: {schedule.treatment_id}")

            # 서버로 동기화 후 로컬 데이터 삭제
            db.session.delete(schedule)

        db.session.commit()
        print("로컬에서 서버로 데이터 동기화 완료")

    except Exception as e:
        db.session.rollback()
        print(f"로컬에서 서버로 데이터 동기화 실패: {e}")
