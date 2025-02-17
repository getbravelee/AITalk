import bcrypt

def hash_password(password):
    """BCrypt를 사용하여 비밀번호 해싱"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(input_password, stored_hash):
    """입력된 비밀번호와 저장된 해시를 비교"""
    return bcrypt.checkpw(input_password.encode(), stored_hash.encode())