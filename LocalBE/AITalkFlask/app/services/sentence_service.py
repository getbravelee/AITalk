import openai
import os

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# 3개의 어절로 이루어진 문장 생성 함수
def generate_three_word_sentence(word):
    prompt = (
        f"Create a sentence that includes the word '{word}'. The sentence MUST consist of EXACTLY three words, separated by spaces. Do not add more or fewer words. Example: '곰이 사람을 먹는다.' Only output the sentence in Korean without any explanations."

    )

    try:
        response = openai.ChatCompletion.create(  # 변경된 부분
            model="gpt-4o",                      # model로 변경
            messages=[                           # messages로 변경
                {"role": "system", "content": "당신은 친절한 한국어 선생님입니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.7,
            n=1
        )

        sentence = response.choices[0].message['content'].strip()  # message['content']로 변경
        return sentence

    except Exception as e:
        print(f"Error: {e}")
        return None
