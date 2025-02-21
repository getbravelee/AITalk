import smartcard.System
from smartcard.util import toHexString

def read_nfc_tag():
    """NFC 태그가 태깅될 때까지 대기 후 cardId 반환"""
    readers = smartcard.System.readers()
    if not readers:
        print("NFC 리더기를 찾을 수 없습니다.")
        return None

    reader = readers[0]
    connection = reader.createConnection()
    connection.connect()

    print("NFC 태그를 태깅하세요...")

    # NFC 태그 UID 요청
    get_uid = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    uid_response, sw1, sw2 = connection.transmit(get_uid)

    if sw1 == 0x90:
        uid = toHexString(uid_response)
        print(f"NFC 태그 UID: {uid}")
    else:
        print(f"NFC UID 읽기 실패: {sw1:02X} {sw2:02X}")
        return None

    # NFC 태그에서 데이터 읽기
    ndef_data = []
    for block in range(4, 16):
        read_command = [0xFF, 0xB0, 0x00, block, 4]
        response, sw1, sw2 = connection.transmit(read_command)

        if sw1 == 0x90:
            ndef_data.extend(response)
        else:
            print(f"블록 {block} 읽기 실패: {sw1:02X} {sw2:02X}")
            return None

    # NDEF 텍스트 데이터에서 cardId 추출
    try:
        start_index = ndef_data.index(0xD1)
        if ndef_data[start_index + 3] != 0x54:
            print("올바른 NDEF 텍스트 데이터가 아닙니다.")
            return None

        text_length = ndef_data[start_index + 2] - 3
        language_length = ndef_data[start_index + 4]
        text_data = ''.join(
            chr(b) for b in ndef_data[start_index + 5 + language_length : start_index + 5 + language_length + text_length]
        )

        print(f"태그된 카드의 cardId: {text_data}")
        return int(text_data)  # cardId 반환

    except ValueError:
        print("NDEF 텍스트 레코드를 찾을 수 없습니다.")
        return None
