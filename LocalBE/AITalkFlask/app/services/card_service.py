from app.utils.nfc_reader import extract_ndef_text
from app.models.card_model import get_card_by_id
import base64

def read_nfc_and_get_card_info():
    # NFC 리더기에서 card_id 읽기
    card_id = extract_ndef_text()
    if card_id is None:
        return {"error": "NFC 태그를 읽을 수 없습니다."}, 400

    # card_id로 DB에서 카드 정보 조회
    card_info = get_card_by_id(card_id)
    if card_info is None:
        return {"error": f"Card ID {card_id}에 해당하는 카드를 찾을 수 없습니다."}, 404

    # 이미지 데이터를 base64로 인코딩
    if card_info['image']:
        card_info['image'] = base64.b64encode(card_info['image']).decode('utf-8')

    return card_info, 200
