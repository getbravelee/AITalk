# 1️⃣ Node.js에서 Vite 빌드
FROM node:22 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2️⃣ Node.js 환경에서 Vite Preview 실행
FROM node:22
WORKDIR /app

COPY --from=builder /app /app
RUN npm install -g serve  # 정적 파일 서빙을 위한 serve 패키지 설치

# ✅ 환경변수로 포트 설정
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "run", "preview"]
