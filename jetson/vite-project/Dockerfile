# 1️⃣ Node.js에서 Vite 프로젝트 빌드
FROM node:22 AS builder
WORKDIR /app

# package.json과 lock 파일 복사 후 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 후 빌드
COPY . .
RUN npm run build

# 2️⃣ Node.js 환경에서 Vite Preview 실행
FROM node:22
WORKDIR /app

# 빌드된 결과물만 복사
COPY --from=builder /app /app
RUN npm install -g serve  # 정적 파일 서빙을 위한 serve 패키지 설치

EXPOSE 4173
CMD ["npm", "run", "preview"]
