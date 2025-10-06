#!/bin/bash

# LiveKit 憑證設定腳本
echo "正在設定 LiveKit 環境變數..."

cat > .env.local << EOF
# LiveKit Configuration
LIVEKIT_URL=wss://aoc-uwtcwbzg.livekit.cloud
LIVEKIT_API_KEY=API5eDJWPEmzFzJ
LIVEKIT_API_SECRET=qu0WaMtBHnUu7oZfbFTyNORBgS3pJ8HJHAZQoEmG2pO

# Next.js Configuration
NEXT_PUBLIC_LIVEKIT_URL=wss://aoc-uwtcwbzg.livekit.cloud
EOF

echo "✅ 環境變數已設定完成！"
echo "📁 檔案位置: .env.local"
echo ""
echo "🚀 現在你可以執行以下命令啟動專案："
echo "   npm install"
echo "   npm run dev"
echo ""
echo "🌐 然後開啟 http://localhost:3000 來測試直播功能"
