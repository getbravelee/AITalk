# 1️⃣ Node.js에서 Vite 빌드
FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ Nginx를 사용하여 정적 파일 제공
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# ✅ 기존 Nginx 기본 설정 제거
RUN rm -rf /usr/share/nginx/html/*

# ✅ 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ Nginx 설정 복사 (파일이 존재하는지 확인 필요)
COPY ./nginx.conf /etc/nginx/nginx.conf

# ✅ 포트 개방
EXPOSE 80

# ✅ Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
