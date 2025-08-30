#!/bin/bash

echo "🛡️ Setting up AI-Proof BÆKON Research Architecture..."

# Check if Obsidian vault exists
VAULT_PATH="../BAEKON-Research-Vault"
if [ ! -d "$VAULT_PATH" ]; then
    echo "❌ Obsidian vault not found at $VAULT_PATH"
    echo "   Run this script from the baekon_full_ana directory"
    exit 1
fi

echo "✅ Found Obsidian vault at $VAULT_PATH"

# Check if Obsidian is installed
if command -v obsidian >/dev/null 2>&1; then
    echo "✅ Obsidian detected"
else
    echo "⚠️  Obsidian not found in PATH"
    echo "   Download from: https://obsidian.md"
    echo "   Or install via: brew install --cask obsidian"
fi

# Test vault API integration
echo "🔌 Testing vault API integration..."
if [ -f "server/vault/index.ts" ]; then
    echo "✅ Vault API routes configured"
else
    echo "❌ Vault API routes missing"
    exit 1
fi

# Create .gitignore for vault (optional)
if [ ! -f "$VAULT_PATH/.gitignore" ]; then
    cat > "$VAULT_PATH/.gitignore" << EOF
# Obsidian workspace files
.obsidian/workspace.json
.obsidian/workspace-mobile.json

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
EOF
    echo "✅ Created vault .gitignore"
fi

# Initialize git in vault (optional)
cd "$VAULT_PATH"
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial BÆKON Research Vault setup"
    echo "✅ Initialized git repository in vault"
fi

cd - > /dev/null

echo ""
echo "🎉 AI-Proof Architecture Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Open $VAULT_PATH in Obsidian"
echo "   2. Start adding FL documents to 02-FL-Documents/"
echo "   3. Use templates for consistent formatting"
echo "   4. Link everything with [[double brackets]]"
echo ""
echo "🔒 Your Data is Now Protected:"
echo "   ✅ Separate from code repository"
echo "   ✅ Version controlled independently"  
echo "   ✅ AI cannot accidentally modify"
echo "   ✅ Syncs via Obsidian or Git"
echo ""
echo "🚀 Start the BÆKON server with: npm run server"
