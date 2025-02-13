#!/bin/bash
echo "🚀 EC2 Frontend 배포 시작..."

# 최신 Docker 이미지 가져오기
docker pull suhwany/aitalk:frontend-latest

# 기존 컨테이너 중지 및 삭제
docker stop manage-children-front || true
docker rm manage-children-front || true

# 새 컨테이너 실행 (3000번 포트에서 실행)
docker run -d --name manage-children-front -p 3000:3000 suhwany/aitalk:frontend-latest

# 사용하지 않는 Docker 이미지 정리
docker image prune -a -f

echo "✅ EC2 Frontend 배포 완료!"
