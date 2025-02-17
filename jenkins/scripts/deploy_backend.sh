#!/bin/bash
echo "🚀 EC2 Backend 배포 시작..."

# 최신 Docker 이미지 가져오기
docker pull suhwany/aitalk:backend-latest

# 기존 컨테이너 중지 및 삭제
docker stop manage-children || true
docker rm manage-children || true

# ✅ 네트워크 생성 (없으면 생성)
docker network ls | grep my_network || docker network create my_network

# ✅ 백엔드 컨테이너 실행 (네트워크 포함)
docker run -d --name manage-children \
  --network my_network \
  -p 7001:7001 \
  suhwany/aitalk:backend-latest

# ✅ 네트워크 연결 (이미 실행 중이면 연결)
docker network connect my_network manage-children || true

# 사용하지 않는 Docker 이미지 정리
docker image prune -a -f

echo "✅ EC2 Backend 배포 완료!"
