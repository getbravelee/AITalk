import openai
import os
from sqlalchemy.orm.attributes import flag_modified  # 추가
from app.models.schedule_model import Schedule
from app.extensions import db

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_three_word_sentence(schedule_id, word):
    prompt = (
        f"Create a sentence that includes the word '{word}'. The sentence MUST consist of EXACTLY three words, separated by spaces. Example: '곰이 사람을 먹는다.' Only output the sentence in Korean without any explanations."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 친절한 한국어 선생님입니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.7,
            n=1
        )

        sentence = response.choices[0].message['content'].strip()

        if schedule_id:
            treatment = Schedule.query.filter_by(treatment_id=schedule_id).first()
            if treatment:
                # 빈 값 처리
                if treatment.sentence in (None, {}, ''):
                    treatment.sentence = []

                # 문장 추가
                treatment.sentence.append(sentence)

                # 변경 사항 강제 감지
                flag_modified(treatment, "sentence")

                db.session.commit()  # 커밋으로 DB 반영

                print(f"treatment_id {schedule_id}의 sentence 업데이트 완료: {treatment.sentence}")
            else:
                return {"error": f"treatment_id {schedule_id}에 해당하는 치료 정보를 찾을 수 없습니다."}, 404

        return sentence

    except Exception as e:
        print(f"Error: {e}")
        return None
