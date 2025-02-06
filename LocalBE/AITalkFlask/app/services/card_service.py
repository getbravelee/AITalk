from flask import session
from app.models.card_model import Card
from app.utils.nfc_reader import read_nfc_tag
import time

def get_card_by_id(card_id):
    try:
        print(f"DB에서 card_id = {card_id}로 카드 정보 조회 중...")

        card = Card.query.filter_by(card_id=card_id).first()

        if card:
            print(f"카드 정보 조회 성공: {{'card_id': {card.card_id}, 'name': {card.name}, 'image': {card.image}}}")
            return {
                'card_id': card.card_id,
                'name': card.name,
                'image': card.image
            }
        else:
            print(f"Card ID {card_id}에 해당하는 카드가 DB에 존재하지 않습니다.")
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
            card_id = read_nfc_tag()

            if card_id:
                print(f"NFC 태그에서 읽은 cardId: {card_id}")

                print("DB에서 카드 정보 조회 시작...")
                card_info = get_card_by_id(card_id)
                print(f"DB 조회 결과: {card_info}")

                if not card_info:
                    print(f"Card ID {card_id}에 해당하는 카드 정보를 찾을 수 없습니다.")
                    return {"error": f"Card ID {card_id}에 해당하는 카드를 찾을 수 없습니다."}, 404

                response_data = [card_info]  # 기본적으로 태깅한 카드 정보 추가

                # 1. 세션이 비어있다면 카드 정보를 세션에 저장
                if 'card' not in session:
                    session['card'] = card_info
                    print(f"세션에 카드 정보 저장: {session['card']}")

                # 2. 세션이 이미 존재할 경우, name 비교 후 관련 카드 정보 추가
                else:
                    session_card = session.get('card')
                    session_name = session_card.get('name')
                    current_card_name = card_info.get('name')
                    print(f"세션에 저장된 카드 이름: {session_name}")
                    print(f"현재 태깅한 카드 이름: {current_card_name}")

                    # 세션 name과 태깅한 카드 name을 모두 포함하는 카드 찾기
                    matching_cards = Card.query.filter(
                        Card.name.contains(session_name),
                        Card.name.contains(current_card_name)
                    ).all()

                    # 찾은 카드 정보를 배열에 추가
                    for match in matching_cards:
                        matched_card_info = {
                            'card_id': match.card_id,
                            'name': match.name,
                            'image': match.image
                        }
                        if matched_card_info not in response_data:
                            response_data.append(matched_card_info)

                print("클라이언트로 카드 정보 배열 전송")
                return response_data, 200

            print("카드가 인식되지 않았습니다. 다시 시도 중...")
            time.sleep(2)

        except Exception as e:
            print(f"서버 내부 오류 발생: {e}")
            time.sleep(2)

    print("타임아웃: 카드가 10분 내에 인식되지 않았습니다.")
    return {"error": "카드 인식 타임아웃. 10분 내에 카드가 인식되지 않았습니다."}, 408
