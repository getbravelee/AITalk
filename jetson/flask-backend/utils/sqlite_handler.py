import sqlite3
import os

DB_PATH = "/home/su/image_db.sqlite"

def init_db():
# DB_PATH의 부모 디렉토리 존재 여부 확인 및 없으면 생성
    db_dir = os.path.dirname(DB_PATH)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)


    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT UNIQUE NOT NULL,
            image_path TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def get_image_from_db(prompt):
# """DB에서 프롬프트에 해당하는 이미지 경로 조회"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT image_path FROM images WHERE prompt = ?", (prompt,))
    row = cursor.fetchone()
    conn.close()
    return row if row else None

def save_image_to_db(prompt, image_path):
# """이미지 경로를 DB에 저장"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO images (prompt, image_path) VALUES (?, ?)", (prompt, image_path))
    conn.commit()
    conn.close()

init_db()