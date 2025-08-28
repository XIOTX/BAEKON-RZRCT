# BÆKON RZRCT — Zero-Hallucination FL Research Console

> **A cyberpunk-styled research platform for Forgotten Languages analysis with strict provenance tracking**

![BÆKON Console](preview.html)

**BÆKON** (Bacon Research Zero-hallucination Console with Translation) is a professional-grade research platform designed for analyzing Forgotten Languages (FL) and fringe linguistic corpora. Built with strict "No Source, No Answer" principles, it provides zero-hallucination rails for serious researchers.

## ✨ Features

- 🔬 **Zero-Hallucination Research**: Every claim requires provenance
- 🗃️ **Ana's Index Integration**: Full-text search through FL corpus  
- 🤖 **LLM-Powered Translation**: Claude/GPT integration with schema validation
- 📊 **Vector RAG Pipeline**: Semantic search with Qdrant
- 🔗 **Multi-Source Validation**: Cross-reference claims across platforms
- 🎨 **Cyberpunk Interface**: Beautiful terminal-inspired UI
- 🐳 **Docker Orchestration**: One-command setup with all services

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+
- Git

### One-Command Setup
```bash
bash scripts/setup_all.sh
```

### Start Services
```bash
# Start API server
bash scripts/start_api.sh

# Open preview (while we fix Next.js)
open preview.html
```

### Smoke Test
```bash
bash scripts/smoke_test.sh
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │────│   Fastify API   │────│   PostgreSQL    │
│  (Cyberpunk)    │    │   (TypeScript)  │    │   (Lexicon)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                ┌─────────────┐   ┌─────────────┐
                │   Qdrant    │   │   Ana's     │
                │  (Vectors)  │   │   Index     │
                └─────────────┘   └─────────────┘
```

## 📁 Project Structure

```
baekon_full_ana/
├── app/                  # Next.js frontend
├── server/               # Fastify API backend
│   ├── rag/             # RAG orchestration
│   ├── anas/            # Ana's Index integration
│   └── connectors/      # External search
├── ui/components/       # React components
├── docs/                # Documentation + FL links
├── scripts/             # Setup and utility scripts
├── contracts/           # JSON schemas
├── prompts/             # LLM prompt templates
└── preview.html         # Static preview
```

## 🔬 Research Features

### Translation Pipeline
- **Span Analysis**: Document segmentation and tokenization
- **Lexicon Lookup**: Confidence-scored dictionary matching  
- **Vector Retrieval**: Semantic similarity search
- **LLM Processing**: Schema-validated AI translation
- **Provenance Tracking**: Full audit trail for every claim

### Data Sources
- **FL Corpus**: Official Forgotten Languages articles
- **Community Analysis**: Reddit, 4chan, forums
- **Academic Papers**: Linguistic research
- **Government Documents**: FOIA releases
- **Coordinate Data**: Cassini Diskus locations

## 🎯 Current Status

- ✅ **Infrastructure**: Docker services running
- ✅ **Database**: PostgreSQL schema + seed data
- ✅ **API**: Fastify server with endpoints
- ✅ **UI Preview**: Cyberpunk interface demo
- ✅ **FL Archive**: Complete community link collection
- 🚧 **LLM Integration**: Claude API connection pending
- 🚧 **Vector Search**: Qdrant pipeline development
- 🚧 **Ana's Index**: SQLite database connection

## 🔗 FL Community Resources

This project integrates with the broader FL research community:

- **Primary Sources**: Forgotten Languages official site
- **Analysis Tools**: Community-built translators
- **Discussion Forums**: Multi-platform research threads
- **Data Archives**: Historical article collections

See [`docs/FL_COMMUNITY_LINKS.md`](docs/FL_COMMUNITY_LINKS.md) for the complete archive.

## ⚡ API Endpoints

```bash
# Lexicon search
GET /lexicon/search?q=term

# Ana's Index search  
GET /anas-index/search?q=query&fields=title,text

# Research translation
POST /translate/research
{
  "span_id": "uuid",
  "model": "claude-3-5-sonnet"
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development (when Next.js is fixed)
npm run dev

# Start API only
npm run server

# Run tests
npm test
```

## 🔒 Security & Ethics

- **Provenance Required**: No claims without sources
- **Attribution Maintained**: Proper credit to original researchers  
- **Privacy Respected**: No personal data collection
- **Open Source**: Transparent methodology

## 📜 License

ISC License - See LICENSE file for details.

## 🤝 Contributing

BÆKON RZRCT is being developed as a research tool for the FL community. Contributions welcome from serious researchers.

---

*"No Source, No Answer" - BÆKON Research Protocol*
