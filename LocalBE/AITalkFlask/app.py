from flask import Flask
from app.routes.card_routes import card_bp

app = Flask(__name__)
app.register_blueprint(card_bp)

if __name__ == '__main__':
    app.run(debug=True)
