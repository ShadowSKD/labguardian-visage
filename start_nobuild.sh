#!/bin/bash

./update_ip.sh || exit 1

echo "🚀 Starting Docker containers..."
docker-compose up -d
