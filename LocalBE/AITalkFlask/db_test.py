import mysql.connector
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

try:
    print("1. MySQL 커넥터 초기화 중...")

    # .env 파일에서 환경 변수 읽기
    db_host = os.getenv('DB_HOST')
    db_port = int(os.getenv('DB_PORT'))
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_name = os.getenv('DB_NAME')

    print(f"2. DB 연결 시도 중... (호스트: {db_host}, 포트: {db_port})")

    conn = mysql.connector.connect(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_password,
        database=db_name,
        connection_timeout=5
    )

    print("3. DB 연결 성공!")

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM card WHERE card_id = 3001")
    result = cursor.fetchone()
    print(f"4. 조회된 데이터: {result}")

    cursor.close()
    conn.close()

except mysql.connector.Error as e:
    print(f"DB 연결 실패: {e}")
