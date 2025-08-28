#!/usr/bin/env bash
set -euo pipefail

echo "[1/7] Ensuring Node deps..."
npm init -y >/dev/null 2>&1 || true
npm i pg fastify better-sqlite3 >/dev/null 2>&1
npm i -D ts-node typescript @types/node >/dev/null 2>&1

echo "[2/7] Starting Docker services..."
docker compose up -d
docker compose ps

echo "[3/7] Waiting for Postgres to be ready..."
# simple wait loop
for i in {1..30}; do
  if docker exec $(docker compose ps -q db) pg_isready -U baekon -d baekon >/dev/null 2>&1; then
    break
  fi
  echo "  ...waiting ($i)"
  sleep 1
done

echo "[4/7] Applying schema.sql..."
docker cp schema.sql $(docker compose ps -q db):/schema.sql
docker exec -it $(docker compose ps -q db) psql -U baekon -d baekon -f /schema.sql >/dev/null

echo "[5/7] Seeding lexicon..."
node scripts/seed.js

echo "[6/7] Fetching Ana's Index DB..."
bash scripts/fetch_anas_index.sh || true

echo "[7/7] Inserting test span..."
bash scripts/insert_test_span.sh

echo "Done. Next: bash scripts/start_api.sh"
