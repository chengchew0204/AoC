#!/bin/bash

echo "更新 LiveKit 環境變數..."

cat > .env.local << EOF
# LiveKit Configuration
LIVEKIT_URL=wss://aoc-uwtcwbzg.livekit.cloud
LIVEKIT_API_KEY=API5eDJWPEmzFzJ
LIVEKIT_API_SECRET=qu0WaMtBHnUu7oZfbFTyNORBgS3pJ8HJHAZQoEmG2pO

# Next.js Configuration (必須有 NEXT_PUBLIC_ 前綴)
NEXT_PUBLIC_LIVEKIT_URL=wss://aoc-uwtcwbzg.livekit.cloud
EOF

echo "✅ 環境變數已更新！"
echo "🔄 請重新啟動開發伺服器："
echo "   npm run dev"
