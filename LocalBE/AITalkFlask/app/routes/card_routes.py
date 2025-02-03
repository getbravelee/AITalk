from flask import Blueprint, jsonify
from app.services.card_service import get_card_info_after_tagging

card_bp = Blueprint('card_bp', __name__)

@card_bp.route('/play/card-scan', methods=['GET'])
def read_nfc_and_get_card():
    card_info, status_code = get_card_info_after_tagging()
    return jsonify(card_info), status_code
