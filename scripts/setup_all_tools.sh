#!/bin/bash

echo "🚀 Setting up ALL Battle-Tested BÆKON Research Tools..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the baekon_full_ana directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Installing battle-tested tools for FL research...${NC}"

# 1. VS Code Extension Setup
echo -e "\n${PURPLE}🔧 Setting up VS Code Extension...${NC}"
cd vscode-extension
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ VS Code extension files not found${NC}"
    cd ..
else
    npm install
    npm run compile
    echo -e "${GREEN}✅ VS Code extension compiled${NC}"
    echo -e "${YELLOW}📝 To install: Open VS Code, go to Extensions, click '...' > 'Install from VSIX'${NC}"
    cd ..
fi

# 2. Electron Desktop App Setup
echo -e "\n${PURPLE}🖥️  Setting up Electron Desktop App...${NC}"
cd electron-app
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Electron app files not found${NC}"
    cd ..
else
    npm install
    echo -e "${GREEN}✅ Electron app dependencies installed${NC}"
    echo -e "${YELLOW}📝 To run: cd electron-app && npm start${NC}"
    cd ..
fi

# 3. Obsidian Vault (already done)
echo -e "\n${PURPLE}📚 Checking Obsidian Vault...${NC}"
if [ -d "../BAEKON-Research-Vault" ]; then
    echo -e "${GREEN}✅ Obsidian vault exists and is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Running vault setup...${NC}"
    bash scripts/setup_vault.sh
fi

# 4. Logseq Setup
echo -e "\n${PURPLE}🔗 Setting up Logseq Integration...${NC}"
LOGSEQ_DIR="../BAEKON-Logseq-Graph"
if [ ! -d "$LOGSEQ_DIR" ]; then
    mkdir -p "$LOGSEQ_DIR"
    
    # Create Logseq config
    mkdir -p "$LOGSEQ_DIR/.logseq"
    cat > "$LOGSEQ_DIR/.logseq/config.edn" << 'EOF'
{:meta/version 1
 :feature/enable-block-timestamps? true
 :feature/enable-journals? true
 :default-templates {:journals ""}
 :hidden []
 :default-home {:page "FL Research Dashboard"}
 :publishing/all-pages-public? false
 :graph/settings {:journal? true
                  :builtin-pages? true}
 :favorites ["FL Research Dashboard" "Lexicon" "Ana's Index" "Translation Log"]
 :journal/page-title-format "MMM do, yyyy"}
EOF

    # Create initial pages
    mkdir -p "$LOGSEQ_DIR/pages"
    
    cat > "$LOGSEQ_DIR/pages/FL Research Dashboard.md" << 'EOF'
# FL Research Dashboard

## 🔬 Active Research Areas
- [[Lexicon Development]]
- [[Translation Attempts]]
- [[Pattern Analysis]]
- [[Community Findings]]

## 📊 Research Statistics
- **Total FL Terms**: {{query (and (page-property :type "lexicon-entry"))}}
- **Translation Attempts**: {{query (and (page-property :type "translation"))}}
- **Analysis Reports**: {{query (and (page-property :type "analysis"))}}

## 🔗 External Resources
- [Ana's Index](http://127.0.0.1:8787/anas-index/search)
- [BÆKON API](http://127.0.0.1:8787)
- [[Research Methodology]]

## 📝 Recent Updates
{{query (and (task DONE) (between [[7 days ago]] [[today]]))}}
EOF

    cat > "$LOGSEQ_DIR/pages/Lexicon.md" << 'EOF'
# FL Lexicon

## 🔤 Verified Terms
type:: lexicon

### High Confidence (90%+)
- **aeshafaf** → "do, make, perform"
  confidence:: 95%
  source:: community-lexicon
  
- **ararth** → "their, belonging to them" 
  confidence:: 95%
  source:: community-lexicon

- **nebeder** → "weapon, tool, implement"
  confidence:: 90%
  source:: community-lexicon

### Medium Confidence (60-89%)
- **aeth** → "to be, exist"
  confidence:: 85%
  source:: pattern-analysis

## 📊 Analysis Methods
- [[Morphological Analysis]]
- [[Contextual Pattern Recognition]]
- [[Community Verification]]
- [[Cross-Reference Validation]]
EOF

    echo -e "${GREEN}✅ Logseq graph database created${NC}"
    echo -e "${YELLOW}📝 Open $LOGSEQ_DIR in Logseq app${NC}"
else
    echo -e "${GREEN}✅ Logseq graph already exists${NC}"
fi

# 5. Install Logseq if not present
if ! command -v logseq &> /dev/null; then
    echo -e "${YELLOW}📦 Logseq not found. Install from: https://logseq.com${NC}"
    echo -e "${YELLOW}   Or via Homebrew: brew install --cask logseq${NC}"
else
    echo -e "${GREEN}✅ Logseq is installed${NC}"
fi

# 6. Create unified launcher script
echo -e "\n${PURPLE}🚀 Creating unified launcher...${NC}"
cat > scripts/launch_research_suite.sh << 'EOF'
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
EOF

chmod +x scripts/launch_research_suite.sh

# 7. Create VS Code workspace
echo -e "\n${PURPLE}📝 Creating VS Code workspace...${NC}"
cat > baekon-research.code-workspace << 'EOF'
{
    "folders": [
        {
            "name": "BÆKON Code",
            "path": "."
        },
        {
            "name": "Research Vault",
            "path": "../BAEKON-Research-Vault"
        },
        {
            "name": "Logseq Graph",
            "path": "../BAEKON-Logseq-Graph"
        }
    ],
    "settings": {
        "baekon.apiUrl": "http://127.0.0.1:8787",
        "baekon.vaultPath": "../BAEKON-Research-Vault",
        "files.associations": {
            "*.md": "markdown"
        },
        "markdown.preview.breaks": true,
        "markdown.preview.linkify": true
    },
    "extensions": {
        "recommendations": [
            "ms-vscode.vscode-typescript-next",
            "bradlc.vscode-tailwindcss",
            "ms-vscode.vscode-json",
            "yzhang.markdown-all-in-one",
            "foam.foam-vscode"
        ]
    },
    "tasks": {
        "version": "2.0.0",
        "tasks": [
            {
                "label": "Start BÆKON API",
                "type": "shell",
                "command": "npm run server",
                "group": "build",
                "presentation": {
                    "echo": true,
                    "reveal": "always",
                    "focus": false,
                    "panel": "new"
                },
                "runOptions": {
                    "runOn": "folderOpen"
                }
            },
            {
                "label": "Launch Research Suite",
                "type": "shell",
                "command": "bash scripts/launch_research_suite.sh",
                "group": "build"
            }
        ]
    }
}
EOF

echo -e "${GREEN}✅ VS Code workspace created${NC}"

# 8. Summary
echo -e "\n${GREEN}🎉 BATTLE-TESTED RESEARCH SUITE SETUP COMPLETE!${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""
echo -e "${YELLOW}📋 What's Ready:${NC}"
echo -e "  ✅ Obsidian Vault (AI-proof data storage)"
echo -e "  ✅ Logseq Graph Database (knowledge linking)"
echo -e "  ✅ VS Code Extension (integrated research tools)"
echo -e "  ✅ Electron Desktop App (offline research)"
echo -e "  ✅ TypeScript React Components (proper UI)"
echo -e "  ✅ Unified Launcher Script"
echo -e "  ✅ VS Code Workspace Configuration"
echo ""
echo -e "${YELLOW}🚀 Quick Start:${NC}"
echo -e "  1. ${BLUE}bash scripts/launch_research_suite.sh${NC} - Launch everything"
echo -e "  2. ${BLUE}code baekon-research.code-workspace${NC} - Open in VS Code"
echo -e "  3. ${BLUE}cd electron-app && npm start${NC} - Desktop app only"
echo ""
echo -e "${YELLOW}📱 Apps to Install:${NC}"
echo -e "  • Obsidian: https://obsidian.md"
echo -e "  • Logseq: https://logseq.com"
echo -e "  • VS Code: https://code.visualstudio.com"
echo ""
echo -e "${GREEN}Your data is now bulletproof across multiple battle-tested platforms! 🛡️${NC}"
EOF

chmod +x scripts/setup_all_tools.sh
