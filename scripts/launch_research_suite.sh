#!/bin/bash

echo "🔬 Launching BÆKON Research Suite..."

# Start API server in background
echo "Starting API server..."
export $(grep -v '^#' .env | xargs) && npm run server &
API_PID=$!

# Wait for API to start
sleep 3

# Launch Electron app
echo "Launching desktop app..."
cd electron-app && npm start &
ELECTRON_PID=$!

# Open Obsidian vault
echo "Opening Obsidian vault..."
if command -v obsidian &> /dev/null; then
    obsidian "../BAEKON-Research-Vault" &
else
    open "../BAEKON-Research-Vault"
fi

# Open Logseq graph
echo "Opening Logseq graph..."
if command -v logseq &> /dev/null; then
    logseq "../BAEKON-Logseq-Graph" &
else
    open "../BAEKON-Logseq-Graph"
fi

echo "🎉 Research suite launched!"
echo "API PID: $API_PID"
echo "Electron PID: $ELECTRON_PID"
echo ""
echo "To stop all services:"
echo "kill $API_PID $ELECTRON_PID"

# Keep script running
wait
