from app.models.therapist import Therapist
from app.utils.hash_utils import verify_password

def login_user(user_id, password):
    therapist = Therapist.query.filter_by(id=user_id).first()
    if therapist and verify_password(password, therapist.password):
        return therapist
    return None
