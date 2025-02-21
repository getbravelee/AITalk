#!/bin/bash
echo "🚀 EC2 Middleware 배포 시작..."

docker pull suhwany/aitalk:middle-latest

docker stop jetson-middle || true
docker rm jetson-middle || true

docker run -d --name jetson-middle \
  --network my_network \
  -p 7260:7260 \
  suhwany/aitalk:middle-latest

docker image prune -a -f
echo "✅ EC2 Middleware 배포 완료!"
