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

# ✅ 빌드 결과물만 복사하고 node_modules 다시 설치 (devDependencies 제외)
COPY --from=builder /app/dist /app/dist
COPY package.json package-lock.json ./
RUN npm install --omit=dev  # devDependencies 제외

# ✅ 환경변수로 포트 설정
ENV PORT=3000
EXPOSE 3000

# ✅ Vite Preview 실행
CMD ["npx", "vite", "preview"]
