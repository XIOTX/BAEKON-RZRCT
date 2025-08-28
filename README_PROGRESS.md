# BÆKON RZRCT — Progress Snapshot

This file documents the current state of the project so Cursor (or any future agent) knows what’s already been done and what remains.  

---

## ✅ Completed Setup

- **Repo scaffolding** (`baekon_full_ana`) is in place with:
  - `server/` (Fastify API, RAG orchestrator, Ana’s Index route, translation stubs)
  - `scripts/` (setup, seed, smoke test, Ana’s Index fetcher)
  - `docs/`, `prompts/`, `contracts/`, etc.
- **Environment (.env)** is present and configured:
  - Postgres connection: `postgres://baekon:baekon@localhost:5432/baekon`
  - Placeholder slots for API keys (LLM, etc.)
- **Docker services** are up via `docker-compose`:
  - Postgres (5432)
  - Qdrant (6333)
  - MinIO (9000/9001)
- **Database schema + seed**:
  - `schema.sql` applied to Postgres
  - `scripts/seed.js` populated lexicon rows
- **TypeScript issues resolved**:
  - tsconfig created (`allowJs: true`, skipLibCheck, etc.)
  - Added `steps.d.ts` to declare rag functions
  - Installed `@types/pg`, `@types/better-sqlite3`, `@types/node`
  - Fixed imports in `server/index.ts` and param typing in `anas/index.ts`
- **Ana’s Index DB**:
  - `newdb.db` pulled down into `integrations/ana_index/`
  - API points to it via `ANAS_INDEX_DB` in `.env`

---

## 🚦 Current State

- Running `bash scripts/start_api.sh` launches the API successfully.
- API listens on `http://127.0.0.1:8787`.
- `/anas-index/search` route is wired, awaiting the SQLite DB file (now included).
- `/translate/research` is a stub: calls into `server/rag/orchestrator.ts` but currently just placeholder logic.

---

## 🎯 Next Steps (for Cursor)

1. **Verify Ana’s Index route works** with the newdb.db:
   - Confirm JSON search responses come back instead of 500 errors.
2. **Wire real LLM calls** in `server/rag/steps.ts::callLLM`.
   - Connect Claude/OpenAI/etc. using API keys in `.env`.
   - Enforce strict JSON schema (`contracts/translation.schema.json`).
3. **Improve error handling/logging**:
   - Right now, DB missing = 500 with a hard-coded message.
4. **Expand evaluation harness**:
   - `eval/gold/fl_set1.json` + `scripts/sync_stones.py` are seeds.
   - Build out proper regression tests for translations.
5. **UI Layer**:
   - `app/` + `ui/components/Interlinear.tsx` are skeleton only.
   - Flesh out front-end that consumes API endpoints.
6. **Prepare for deployment**:
   - Currently runs locally under Docker.
   - Needs instructions for deployment to a cloud VM (DigitalOcean, AWS, Render, etc.).

---

## 📝 Notes

- This setup is intended as a **research agent prototype**. Scope will expand beyond Forgotten Languages into broader “mystery/conspiracy/fringe research” arenas.
- Cursor should treat this repo as a **live scaffold**: stabilize, extend, and harden for real use.
