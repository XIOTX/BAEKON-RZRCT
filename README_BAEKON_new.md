# BÆKON — Vision and Full Function

BÆKON (Beacon / Beckon / BÆKON) is designed as a **self-maintaining research and exploration agent**: a platform where AI can engage with fringe material (Forgotten Languages, esoteric datasets, anomalous archives) in a structured, reproducible way — minimizing hallucination while maximizing insight.

---

## 🌐 Core Purpose

- Provide an **environment** where an AI agent can:
  1. Access and search **all known FL corpora** and related mystery datasets.
  2. Apply translation / alignment techniques to produce testable outputs.
  3. Preserve **breadcrumbs** (intermediate reasoning, seed lexicons, prompt chains) to ensure transparency and avoid context drift.
  4. Grow into a wider **fringe-intelligence agent** capable of engaging with conspiracy, anomaly, and esoteric domains in a structured way.

---

## 🏗 Architecture

- **Data Layer**
  - PostgreSQL for structured lexicon + evaluation data.
  - Qdrant vector DB for semantic neighborhood searches.
  - MinIO/S3 for file/object storage.
  - SQLite “Ana’s Index” for article-level metadata search.

- **Server Layer**
  - Fastify API routes:
    - `/translate/research`: run controlled translation pipelines.
    - `/anas-index/search`: search Ana’s Index database.
    - `/rag/*`: orchestrator pipeline for retrieval + generation.
  - Contracts enforce strict JSON output to avoid freeform hallucination.

- **Processing Layer**
  - Prompt scaffolding system (`prompts/`) with research vs explorer modes.
  - Seed lexicons and gold evaluation sets for regression testing.
  - Translation orchestrator that chains retrieval, alignment, and validation.

- **UI Layer**
  - React/TypeScript front-end (`app/`, `ui/`) with interlinear translation view.
  - Dark + glowing neon style to reflect “technomantic lab” aesthetic.
  - Hooks for exploration, comparison, and annotation.

---

## 🚦 Current vs Future

- **Now:** A scaffolded research agent with DBs, API stubs, seeds, and Ana’s Index search partially wired.
- **Future:** 
  - Fully working translation/research pipelines across FL corpora.
  - A user-facing lab interface with interlinear explorers.
  - Expandable scope into broader mystery/conspiracy datasets.
  - Self-documenting: every run logged, validated, and reproducible.

---

## 🧭 Guiding Principles

- **Autopoietic:** System should generate and maintain its own scaffolding (logs, seeds, prompt scaffolds).
- **Transparent:** Every decision leaves breadcrumbs for later review.
- **Expandable:** Start with FL, grow into all fringe knowledge domains.
- **Agentic:** Not just a tool, but an evolving research companion.

---

This repo is both the **lab** and the **organism**. Cursor (and other AI agents) should treat it as a living scaffold to stabilize, extend, and harden for real use.
