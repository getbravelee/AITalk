#!/bin/bash
echo "🚀 EC2 Backend 배포 시작..."

# 최신 Docker 이미지 가져오기
docker pull suhwany/aitalk:backend-latest

# 기존 컨테이너 중지 및 삭제
docker stop aitalk-backend || true
docker rm aitalk-backend || true

# 새 컨테이너 실행
docker run -d --name aitalk-backend -p 8081:8080 suhwany/aitalk:backend-latest

# 사용하지 않는 Docker 이미지 정리
docker image prune -a -f

echo "✅ EC2 Backend 배포 완료!"
