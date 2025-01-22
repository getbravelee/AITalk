import time
<<<<<<< HEAD

import requests

from datetime import datetime

import xmltodict

from RPLCD.i2c import CharLCD

  

\# I2C 주소와 LCD 설정

I2C\_ADDR = 0x27

lcd = CharLCD('PCF8574', I2C\_ADDR, port=1)

  

\# 날짜 및 시간 계산 함수

def get\_current\_date\_string():

    current\_date = datetime.now().date()

    return current\_date.strftime("%Y%m%d")

  

def get\_current\_hour\_string():

    now = datetime.now()

    if now.minute < 45:

        if now.hour == 0:

            base\_time = "2330"

        else:

            base\_time = f"{now.hour - 1:02}30"

    else:

        base\_time = f"{now.hour:02}30"

    return base\_time

  

\# 공공데이터 API 호출 설정

keys = 'OL50yS2bAuUcgyuwzS5FO0KTzXxzVmiSCbkZYq4ZvpSU93YQd2uixQCfihbvy7+maJVI8b5ka2S8KQL8wrWUng=='

url = '[http://apis.data.go.kr/1360000/VilageFcstInfoService\_2.0/getUltraSrtFcst](http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst)'

  

\# 날씨 정보 가져오기 함수

def forecast():

    params = {

        'serviceKey': keys,

        'pageNo': '1',

        'numOfRows': '1000',

        'dataType': 'XML',

        'base\_date': get\_current\_date\_string(),

        'base\_time': get\_current\_hour\_string(),

        'nx': '55',

        'ny': '127'

    }

  

    try:

        res = requests.get(url, params=params)

        xml\_data = res.text

        dict\_data = xmltodict.parse(xml\_data)

  

        weather\_data = {}

        for item in dict\_data\['response'\]\['body'\]\['items'\]\['item'\]:

            if item\['category'\] == 'T1H':  # 기온

                weather\_data\['tmp'\] = item\['fcstValue'\]

            elif item\['category'\] == 'REH':  # 습도

                weather\_data\['hum'\] = item\['fcstValue'\]

            elif item\['category'\] == 'SKY':  # 하늘 상태

                weather\_data\['sky'\] = item\['fcstValue'\]

            elif item\['category'\] == 'PTY':  # 강수 형태

                weather\_data\['sky2'\] = item\['fcstValue'\]

        return weather\_data

    except Exception as e:

        print(f"Error fetching weather data: {e}")

        return {}

  

\# 날씨 정보 처리 함수

def proc\_weather():

    dict\_sky = forecast()

    str\_sky = "서울 "

    if dict\_sky:

        if 'sky2' in dict\_sky and 'sky' in dict\_sky:

            str\_sky += "날씨: "

            if dict\_sky\['sky2'\] == '0':  # 강수 없음

                if dict\_sky\['sky'\] == '1':

                    str\_sky += "맑음"

                elif dict\_sky\['sky'\] == '3':

                    str\_sky += "구름많음"

                elif dict\_sky\['sky'\] == '4':

                    str\_sky += "흐림"

            elif dict\_sky\['sky2'\] == '1': str\_sky += "비"

            elif dict\_sky\['sky2'\] == '2': str\_sky += "비와 눈"

            elif dict\_sky\['sky2'\] == '3': str\_sky += "눈"

        if 'tmp' in dict\_sky:

            str\_sky += f"\\n온도: {dict\_sky\['tmp'\]}ºC"

        if 'hum' in dict\_sky:

            str\_sky += f"\\n습도: {dict\_sky\['hum'\]}%"

    return str\_sky

  

\# LCD에 날씨 출력

def display\_weather\_on\_lcd():

    weather\_info = proc\_weather()

  

    # 화면 지우기

    lcd.clear()

  

    # LCD에 출력

    lcd.write\_string(weather\_info\[:16\])  # 최대 16자까지 출력

    lcd.cursor\_pos = (1, 0)

    lcd.write\_string(weather\_info\[16:\])

  

\# 프로그램 실행

try:

    while True:

        display\_weather\_on\_lcd()

        time.sleep(600)  # 10분마다 업데이트

except KeyboardInterrupt:

    print("\\n프로그램이 사용자 요청으로 종료되었습니다.")

    lcd.clear()
=======
import requests
from datetime import datetime
import xmltodict
from RPLCD.i2c import CharLCD

# I2C 주소와 LCD 설정
I2C_ADDR = 0x27
lcd = CharLCD('PCF8574', I2C_ADDR, port=1)

# 날짜 계산 함수
def get_current_date_string():
    current_date = datetime.now().date()
    return current_date.strftime("%Y%m%d")

# 시간 계산 함수
def get_current_hour_string():
    now = datetime.now()
    if now.minute < 45:  # 현재 분이 45분 이전이라면
        if now.hour == 0:  # 자정일 경우
            base_time = "2330"
        else:  # 이전 시간 기준으로 30분 설정
            base_time = f"{now.hour - 1:02}30"
    else:  # 현재 시간 기준으로 30분 설정
        base_time = f"{now.hour:02}30"
    return base_time

# 공공데이터 API 호출을 위한 설정
keys = 'OL50yS2bAuUcgyuwzS5FO0KTzXxzVmiSCbkZYq4ZvpSU93YQd2uixQCfihbvy7+maJVI8b5ka2S8KQL8wrWUng=='
url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'

# 날씨 정보를 가져오는 함수
def forecast():
    params = {
        'serviceKey': keys,               # API 키
        'pageNo': '1',                    # 페이지 번호
        'numOfRows': '1000',              # 한 번에 가져올 데이터 수
        'dataType': 'XML',                # 데이터 타입
        'base_date': get_current_date_string(),  # 기준 날짜
        'base_time': get_current_hour_string(),  # 기준 시간
        'nx': '55',                       # X 좌표
        'ny': '127'                       # Y 좌표
    }
   
    try:
        print("날씨 데이터를 요청 중입니다...")
        res = requests.get(url, params=params)
        res.raise_for_status()  # 요청에 문제가 있을 경우 예외 발생
        xml_data = res.text

        print("응답 데이터:")
        print(xml_data)

        # XML 데이터를 딕셔너리로 변환
        dict_data = xmltodict.parse(xml_data)
       
        # 응답 데이터에서 필요한 정보를 추출
        weather_data = {}
        for item in dict_data['response']['body']['items']['item']:
            category = item['category']  # 카테고리 (예: 기온, 강수량 등)
            value = item['fcstValue']   # 예보 값
            weather_data[category] = value

        print("추출된 날씨 데이터:", weather_data)
        return weather_data

    except requests.exceptions.RequestException as e:
        print("API 요청 중 오류 발생:", e)
        return None
    except KeyError:
        print("응답 데이터에서 필요한 정보를 찾을 수 없습니다.")
        return None

# LCD에 데이터 표시
def display_weather():
    weather = forecast()
    if weather:
        lcd.clear()
        lcd.write_string(f"tmp: {weather.get('T1H', 'N/A')}C\n")
        lcd.write_string(f"hum: {weather.get('RN1', 'N/A')}mm")
    else:
        lcd.clear()
        lcd.write_string("날씨 데이터를 가져올 수 없습니다.")

# 메인 루프
if __name__ == "__main__":
    while True:
        display_weather()
        time.sleep(600)  # 10분마다 갱신
>>>>>>> 5f545ec42f8ac277298e547b005ef853be8e640e
