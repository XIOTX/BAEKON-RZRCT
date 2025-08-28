#!/usr/bin/env bash
set -euo pipefail
docker exec -i $(docker compose ps -q db) psql -U baekon -d baekon <<'SQL'
WITH d AS (
  INSERT INTO documents(id, source_url, title, type, sha256)
  VALUES (gen_random_uuid(),'local://gold','gold','txt', repeat('a',64))
  ON CONFLICT DO NOTHING
  RETURNING id
), d2 AS (
  SELECT id FROM d
  UNION ALL
  SELECT id FROM documents WHERE title='gold' LIMIT 1
)
INSERT INTO spans(id, document_id, span_index, text, lang_guess, tokens)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM d2 LIMIT 1),
  0,
  'aeshafaf ararth',
  'fl',
  '[{"surface":"aeshafaf"},{"surface":"ararth"}]'::jsonb
)
RETURNING id;
SQL
