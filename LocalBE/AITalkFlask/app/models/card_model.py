import mysql.connector


def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='your_username',
        password='your_password',
        database='your_database'
    )


def get_card_by_id(card_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT card_id, name, image FROM card WHERE card_id = %s"
    cursor.execute(query, (card_id,))
    card = cursor.fetchone()

    cursor.close()
    conn.close()
    return card
