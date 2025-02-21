#!/bin/bash
echo "🚀 EC2 Middleware 배포 시작..."

docker pull suhwany/aitalk:middle-latest

docker stop jetson-middle || true
docker rm jetson-middle || true

docker run -d --name jetson-middle \
  -p 7260:7260 \
  -v /home/ubuntu/images:/home/ubuntu/images \
  suhwany/aitalk:middle-latest

docker image prune -a -f
echo "✅ EC2 Middleware 배포 완료!"
