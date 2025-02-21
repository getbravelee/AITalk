#!/bin/bash
echo "🚀 EC2 Frontend 배포 시작..."

# 최신 Docker 이미지 가져오기
docker pull suhwany/aitalk:frontend-latest

# 기존 컨테이너 중지 및 삭제
docker stop manage-children-front || true
docker rm manage-children-front || true

# ✅ 네트워크 존재 여부 확인 후 생성
if ! docker network inspect my_network > /dev/null 2>&1; then
  echo "🔗 my_network 네트워크 생성"
  docker network create my_network
fi

# ✅ 프론트 컨테이너 실행 (Nginx 사용)
docker run -d --name manage-children-front \
  --network my_network \
  -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  suhwany/aitalk:frontend-latest

# 사용하지 않는 Docker 이미지 정리
docker image prune -a -f

echo "✅ EC2 Frontend 배포 완료!"
