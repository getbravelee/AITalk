# from flask import Blueprint, jsonify
# from app.models import User
#
# hello_bp = Blueprint('hello', __name__)
#
# @hello_bp.route('/')
# def hello_world():
#     return 'Hello World!'
#
# @hello_bp.route('/users', methods=['GET'])
# def get_users():
#     users = User.query.all()  # 기존 테이블의 모든 데이터 조회
#     user_list = [{'id': user.id, 'username': user.username, 'password': user.password} for user in users]
#     return jsonify(user_list)