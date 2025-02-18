#!/bin/bash
echo "🚀 EC2 Backend 배포 시작..."

# 최신 Docker 이미지 가져오기
docker pull suhwany/aitalk:backend-latest

# 기존 컨테이너 중지 및 삭제
docker stop manage-children || true
docker rm manage-children || true

# ✅ 네트워크 존재 여부 확인 후 생성
if ! docker network inspect my_network > /dev/null 2>&1; then
  echo "🔗 my_network 네트워크 생성"
  docker network create my_network
fi

# ✅ 백엔드 컨테이너 실행 (네트워크 포함)
docker run -d --name manage-children \
  --network my_network \
  -p 7001:7001 \
  suhwany/aitalk:backend-latest

# 사용하지 않는 Docker 이미지 정리
docker image prune -a -f

echo "✅ EC2 Backend 배포 완료!"
