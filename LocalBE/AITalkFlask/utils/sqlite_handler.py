import sqlite3
import os

DB_PATH = "/home/su/image_db.sqlite"

def init_db():
    """이미지 저장용 SQLite 데이터베이스 초기화"""
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
    """DB에서 프롬프트에 해당하는 이미지 경로 조회"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT image_path FROM images WHERE prompt = ?", (prompt,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

def save_image_to_db(prompt, image_path):
    """이미지 경로를 DB에 저장"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO images (prompt, image_path) VALUES (?, ?)", (prompt, image_path))
    conn.commit()
    conn.close()

# 앱 실행 시 DB 초기화
init_db()
