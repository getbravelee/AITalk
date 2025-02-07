import smartcard.System
from smartcard.util import toHexString

def extract_ndef_text():
    """NDEF 텍스트 데이터 및 NFC 태그 UID 추출"""
    readers = smartcard.System.readers()
    if not readers:
        print("NFC 리더기를 찾을 수 없습니다.")
        return

    reader = readers[0]
    connection = reader.createConnection()
    connection.connect()

    # NFC 태그 UID 요청 (올바르게 출력)
    get_uid = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    uid_response, sw1, sw2 = connection.transmit(get_uid)

    if sw1 == 0x90:
        uid = toHexString(uid_response)
        print(f"NFC 태그 UID: {uid}")
    else:
        print(f"NFC UID 읽기 실패: {sw1:02X} {sw2:02X}")

    print("\nNFC 태그에서 NDEF 텍스트 데이터 추출...")

    # NFC 태그에서 데이터 읽기 (일반적으로 블록 4~16에 저장됨)
    ndef_data = []
    for block in range(4, 16):
        read_command = [0xFF, 0xB0, 0x00, block, 4]
        response, sw1, sw2 = connection.transmit(read_command)

        if sw1 == 0x90:
            ndef_data.extend(response)
        else:
            print(f"블록 {block} 읽기 실패: {sw1:02X} {sw2:02X}")
            break

    print("\nNFC 태그의 NDEF 데이터 (HEX 출력):")
    print(toHexString(ndef_data))

    # NDEF 텍스트 레코드 찾기
    try:
        start_index = ndef_data.index(0xD1)  # NDEF 텍스트 시작 위치
        if ndef_data[start_index + 3] != 0x54:  # 'T' (텍스트 데이터)가 있는지 확인
            print("올바른 NDEF 텍스트 데이터가 아닙니다.")
            return

        text_length = ndef_data[start_index + 2] - 3  # 데이터 길이 추출
        language_length = ndef_data[start_index + 4]  # 언어 코드 길이
        text_data = ''.join(chr(b) for b in ndef_data[start_index + 5 + language_length: start_index + 5 + language_length + text_length])

        print("\nNFC 태그에 저장된 텍스트 데이터:")
        print(text_data)

    except ValueError:
        print("NDEF 텍스트 레코드를 찾을 수 없습니다.")

if __name__ == "__main__":
    extract_ndef_text()
