#!/bin/bash

echo "🌐 Detecting your IPv4 address..."

# Detect IPv4 address (Linux/macOS)
IP=$(hostname -I | awk '{print $1}')
[ -z "$IP" ] && IP=$(ipconfig getifaddr en0)  # macOS fallback

# Fallback: fail safely
if [ -z "$IP" ]; then
  echo "❌ Could not detect IPv4 address. Exiting."
  exit 1
fi

API_URL="http://$IP:5000/api"
ENV_FILE="./frontend/.env"

# Replace or append
if grep -q "^VITE_API_URL=" "$ENV_FILE"; then
  sed -i.bak "s|^VITE_API_URL=.*|VITE_API_URL=$API_URL|" "$ENV_FILE"
else
  echo "VITE_API_URL=$API_URL" >> "$ENV_FILE"
fi

echo "✅ Updated frontend/.env with VITE_API_URL=$API_URL"
