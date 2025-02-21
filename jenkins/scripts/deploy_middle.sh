#!/bin/bash
echo "🚀 EC2 Middleware 배포 시작..."

docker pull suhwany/aitalk:middle-latest

docker stop manage-children-middle || true
docker rm manage-children-middle || true

if ! docker network inspect my_network > /dev/null 2>&1; then
  echo "🔗 my_network 네트워크 생성"
  docker network create my_network
fi

docker run -d --name manage-children-middle \
  --network my_network \
  -p 7260:7260 \
  suhwany/aitalk:middle-latest

docker image prune -a -f
echo "✅ EC2 Middleware 배포 완료!"
