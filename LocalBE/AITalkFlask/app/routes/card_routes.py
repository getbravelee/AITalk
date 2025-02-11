from flask import Blueprint, jsonify, request
from app.services.card_service import get_card_info_after_tagging

card_bp = Blueprint('card_bp', __name__)

@card_bp.route('/play/card-scan', methods=['POST'])
def read_nfc_and_get_card():
    data = request.get_json()
    schedule_id = data.get('schedule_id')  # JSON body로부터 schedule_id 받기

    card_info, status_code = get_card_info_after_tagging(schedule_id)
    return jsonify(card_info), status_code
