from app.models.card_model import Card
from app.utils.nfc_reader import read_nfc_tag

def get_card_by_id(card_id):
    try:
        print(f"DB에서 card_id = {card_id}로 카드 정보 조회 중...")

        # SQLAlchemy ORM을 사용한 카드 정보 조회
        card = Card.query.filter_by(card_id=card_id).first()

        if card:
            print(f"카드 정보 조회 성공: {{'card_id': card.card_id, 'name': card.name, 'image': card.image}}")
            return {
                'card_id': card.card_id,
                'name': card.name,
                'image': card.image  # 이미지가 BLOB인 경우, 필요 시 base64 인코딩
            }
        else:
            print(f"Card ID {card_id}에 해당하는 카드가 DB에 존재하지 않습니다.")
            return None

    except Exception as db_error:
        print(f"DB 쿼리 실행 중 오류 발생: {db_error}")
        return None

def get_card_info_after_tagging():
    try:
        print("NFC 리더기에서 cardId 읽는 중...")
        card_id = read_nfc_tag()
        print(f"NFC 태그에서 읽은 cardId: {card_id}")

        if card_id is None:
            print("NFC 태그를 읽을 수 없습니다.")
            return {"error": "NFC 태그를 읽을 수 없습니다."}, 400

        # DB에서 카드 정보 조회
        print("DB에서 카드 정보 조회 시작...")
        card_info = get_card_by_id(card_id)
        print(f"DB 조회 결과: {card_info}")

        if card_info is None:
            print(f"Card ID {card_id}에 해당하는 카드 정보를 찾을 수 없습니다.")
            return {"error": f"Card ID {card_id}에 해당하는 카드를 찾을 수 없습니다."}, 404

        # 이미지 경로 반환 (인코딩 제거)
        if card_info['image']:
            print(f"이미지 경로: {card_info['image']}")
        else:
            print("이미지 경로가 없습니다.")

        print("카드 정보 반환 성공!")
        return card_info, 200

    except Exception as e:
        print(f"서버 내부 오류 발생: {e}")
        return {"error": "서버 내부 오류가 발생했습니다."}, 500
