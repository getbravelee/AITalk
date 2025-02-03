from flask import Blueprint, jsonify
from app.services.card_service import read_nfc_and_get_card_info

card_bp = Blueprint('card_bp', __name__)

@card_bp.route('/play/card-scan', methods=['GET'])
def read_nfc_tag():
    card_info, status_code = read_nfc_and_get_card_info()
    return jsonify(card_info), status_code
