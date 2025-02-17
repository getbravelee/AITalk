# 1️⃣ Nginx 기반 이미지 사용
FROM nginx:alpine

# 2️⃣ 작업 디렉터리 설정
WORKDIR /usr/share/nginx/html

# 3️⃣ 기존 HTML 파일 제거 후 빌드된 파일 복사
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# 4️⃣ Nginx 설정 복사 (nginx.conf를 올바른 위치에 배치)
COPY nginx.conf /etc/nginx/nginx.conf

# 5️⃣ Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
