from app.models.therapist import Therapist
from app.utils.nfc_reader import read_nfc_tag
import time

# 카드 태깅 후 언어 치료사 id로 데이터 찾기
def get_card_by_therapist_id(therapist_id):
    try:
        print(f"DB에서 therapist_id로 {therapist_id} 조회 중..")

        therapist = Therapist.query.filter_by(therapist_id=therapist_id).first()


        if therapist:
            print(f"언어치료사 정보 조회 성공: {{'therapist_id': {therapist.therapist_id}, 'therapist_name: {therapist.therapist_name}}}")
            return {
                'therapist_id': therapist.therapist_id,
                'therapist_name': therapist.therapist_name
            }
        else:
            print(f"Therapist ID {therapist_id}에 해당하는 카드가 DB에 존재하지 않습니다.")
            return None


    except Exception as db_error:
        print(f"DB 쿼리 실행 중 오류 발생: {db_error}")
        return None

# 카드가 태깅 될 때까지 대기하는 함수. 10분간 유지, 2초마다 한번씩 읽어오기
def get_card_info_after_tagging(timeout=600):
    start_time = time.time()

    while time.time() - start_time < timeout:
        try:
            print("NFC 리더기에서 cardId 읽는 중...")
            threrapist_id = read_nfc_tag()

            if threrapist_id:
                print(f"NFC 태그에서 읽은 threrapistId: {threrapist_id}")

                print("DB에서 카드 정보 조회 시작...")
                therapist_info = get_card_by_therapist_id(threrapist_id)
                print(f"DB 조회 결과: {therapist_info}")

                if not therapist_info:
                    print(f"Threrapist ID {threrapist_id}에 해당하는 카드 정보를 찾을 수 없습니다.")
                    return {"error": f"Threrapist ID {threrapist_id}에 해당하는 카드를 찾을 수 없습니다."}, 404

                response_data = therapist_info

                print("클라이언트로 카드 정보 배열 전송")
                return response_data, 200

            print("카드가 인식되지 않았습니다. 다시 시도 중...")
            time.sleep(2)

        except Exception as e:
            print(f"서버 내부 오류 발생: {e}")
            time.sleep(2)

    print("타임아웃: 카드가 10분 내에 인식되지 않았습니다.")
    return {"error": "카드 인식 타임아웃. 10분 내에 카드가 인식되지 않았습니다."}, 408
