from flask import Blueprint, jsonify, request
from app.services.child_choice_service import get_all_children

child_bp = Blueprint('child_bp', __name__)

@child_bp.route('/child/choice', methods=['GET'])
def get_children():
    children = get_all_children()
    return jsonify(children), 200
