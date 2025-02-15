import os
import torch
from diffusers import StableDiffusion3Pipeline
from datetime import datetime

# GPU 메모리 캐시 비우기 (메모리 누수 방지)
torch.cuda.empty_cache()

# 모델 로드 (GPU에서 실행)
pipe = StableDiffusion3Pipeline.from_pretrained(
    "stabilityai/stable-diffusion-3-medium-diffusers",
    torch_dtype=torch.float16
).to("cuda")

# 이미지 저장 디렉토리
IMAGE_DIR = "/home/j-i12e102/images/"
os.makedirs(IMAGE_DIR, exist_ok=True)

# 기본 프롬프트 템플릿
def generate_prompt(user_input):
    return (
        f"A soft, friendly, and colorful illustration of a happy toddler with expressive eyes, {user_input}. "
        "The child is in a warm and inviting environment with pastel colors and gentle lighting. "
        "The illustration is semi-realistic with a slight cartoonish touch to make it more appealing and approachable. "
        "The background is uncluttered, ensuring the focus remains on the child and their surroundings."
    )

# 이미지 생성 함수
def generate_image(prompt):
    filename = f"{prompt}.png"
    filepath = os.path.join(IMAGE_DIR, filename)

    try:
        # Stable Diffusion을 사용해 이미지 생성
        image = pipe(
            generate_prompt(prompt),
            negative_prompt="blurry, distorted, low resolution, extra objects, multiple subjects, cluttered background, surreal, abstract, overexposed, underexposed, unnatural lighting, unrealistic proportions, deformed faces, extra limbs, low contrast, bad anatomy, poorly drawn, grainy, watermark, text, caption, cropped, mutated, glitch, nsfw",
            num_inference_steps=28,
            guidance_scale=7.0
        ).images[0]

        # 이미지 저장
        image.save(filepath)

        return filepath  # 생성된 이미지 파일 경로 반환

    except Exception as e:
        return str(e)  # 오류 메시지 반환