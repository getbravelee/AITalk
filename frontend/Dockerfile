# 1️⃣ Node.js에서 Vite 빌드
FROM node:22 AS builder
WORKDIR /app

# ✅ package.json & package-lock.json 복사 후 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# ✅ 앱 코드 복사 & 빌드 실행
COPY . .
RUN npm run build

# 2️⃣ Nginx로 배포
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# ✅ 기존 HTML 파일 제거 후 빌드된 파일 복사
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ 포트 개방
EXPOSE 80

# ✅ Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
