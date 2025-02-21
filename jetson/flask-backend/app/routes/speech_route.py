from flask import Blueprint, jsonify, request, session
import threading
from app.services.speech_service import (
    recognize_audio,
    stop_recognition,
    is_recognizing,
    initialize_conversation,
    get_child_info,
    keep_listening,
    is_tts_playing
)
from app.models import Schedule
from app.extensions import db
from sqlalchemy.orm.attributes import flag_modified
import base64
from io import BytesIO
import requests
import time
import os
import logging

speech_bp = Blueprint('speech', __name__)

# Typecast API 설정
TYPECAST_API_KEY = os.getenv("TYPECAST_API_KEY")
TYPECAST_ACTOR_ID = os.getenv("TYPECAST_VOICE_ID")

# 대화 상태 플래그 및 현재 대화 중인 아동 ID
conversation_started = False
current_child_id = None


def text_to_speech(text):
    """
    Typecast API를 사용하여 텍스트를 음성으로 변환한 후, Base64 MP3로 변환하여 반환.
    Polling 방식을 이용하여 음성 합성이 완료될 때까지 대기한 후, 결과를 다운로드한다.
    """
    if not TYPECAST_API_KEY or not TYPECAST_ACTOR_ID:
        logging.error("❌ Typecast API Key 또는 Actor ID가 설정되지 않았습니다.")
        return None

    api_url = "https://typecast.ai/api/speak"
    headers = {
        "Authorization": f"Bearer {TYPECAST_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "actor_id": TYPECAST_ACTOR_ID,
        "text": text,
        "lang": "auto",
        "xapi_audio_format": "mp3"
    }

    try:
        # ✅ Typecast API 요청 (음성 생성)
        response = requests.post(api_url, headers=headers, json=payload)
        if response.status_code != 200:
            logging.error(f"❌ Typecast API 오류: {response.status_code} - {response.text}")
            return None

        # ✅ 응답에서 Polling URL 추출
        result = response.json()
        speak_v2_url = result["result"]["speak_v2_url"]
        logging.info(f"📢 Polling 시작... URL: {speak_v2_url}")

        # ✅ Polling (최대 60초 동안 대기)
        for _ in range(60):
            time.sleep(1)
            poll_response = requests.get(speak_v2_url, headers=headers)
            poll_result = poll_response.json()["result"]

            if poll_result["status"] == "done":
                audio_download_url = poll_result["audio_download_url"]
                logging.info(f"🎉 음성 합성 완료! 다운로드 URL: {audio_download_url}")
                break
            else:
                logging.info(f"⌛ 음성 처리 중... (현재 상태: {poll_result['status']})")
        else:
            logging.error("❌ 음성 합성 시간이 초과되었습니다.")
            return None

        # ✅ 오디오 파일 다운로드
        audio_response = requests.get(audio_download_url)
        if audio_response.status_code != 200:
            logging.error(f"❌ 음성 파일 다운로드 실패: {audio_response.status_code}")
            return None

        # ✅ Base64로 변환 후 반환
        audio_base64 = base64.b64encode(audio_response.content).decode('utf-8')
        return audio_base64

    except Exception as e:
        logging.error(f"❌ Typecast API 요청 중 오류 발생: {e}")
        return None


@speech_bp.route('/play/talk-start', methods=['POST'])
def start_recognition_route():
    global conversation_started, keep_listening, is_tts_playing, current_child_id

    data = request.get_json()
    child_id = data.get('child_id')

    if child_id:
        child_info = get_child_info(child_id)
        if not child_info:
            return jsonify({"error": "Child not found"}), 404
        greeting_message = f"{child_info['child_name']}아, 안녕! 준비가 되면 말을 시작해봐."
    else:
        greeting_message = "안녕! 준비가 되면 말을 시작해봐."

    if not conversation_started:
        conversation_started = True
        if child_id:
            initialize_conversation(child_id)
            current_child_id = child_id

        is_tts_playing = True
        audio_base64 = text_to_speech(greeting_message)

        return jsonify({
            "message": greeting_message,
            "audio": audio_base64,
        }), 200

    if is_tts_playing:
        return jsonify({"status": "TTS 재생 중, 음성 인식 대기중"}), 200

    if is_recognizing:
        return jsonify({"status": "already running"}), 409

    keep_listening = True
    if child_id:
        threading.Thread(target=recognize_audio, args=(child_id,), daemon=True).start()

    return jsonify({"status": "recognition started"}), 200


@speech_bp.route('/play/talk-stop', methods=['POST'])
def stop_recognition_route():
    global conversation_started
    data = request.get_json()
    child_id = data.get('child_id')
    schedule_id = data.get('schedule_id')

    child_info = get_child_info(child_id)

    if not child_info:
        return jsonify({"error": "Child not found"}), 404

    stop_recognition(child_id, schedule_id)
    conversation_started = False
    return jsonify({"message": "대화 종료"}), 200
