# 1️⃣ Node.js에서 Vite 빌드
FROM node:22 AS builder
WORKDIR /app

# ✅ package.json & package-lock.json 복사 후 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# ✅ 앱 코드 복사 & 빌드 실행
COPY . .
RUN npm run build

# 2️⃣ Node.js 환경에서 Vite Preview 실행
FROM node:22
WORKDIR /app

# ✅ 빌드 결과물만 복사
COPY --from=builder /app/dist /app/dist
COPY package.json package-lock.json ./

# ✅ Vite 글로벌 설치 (devDependencies가 아닌 상태에서도 실행되도록)
RUN npm install --omit=dev
RUN npm install -g vite  # ✅ 글로벌 설치 추가

# ✅ 환경변수로 포트 설정
ENV PORT=4173
EXPOSE 4173

# ✅ Vite Preview 실행 (외부 접속 허용)
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
