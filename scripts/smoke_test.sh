#!/usr/bin/env bash
set -euo pipefail
# grab any span id to test
SPAN_ID=$(docker exec -i $(docker compose ps -q db) psql -U baekon -d baekon -t -c "select id from spans order by created_at desc nulls last limit 1" | tr -d '[:space:]')
echo "Testing /translate/research with span_id=$SPAN_ID"
curl -s http://localhost:8787/translate/research -H "Content-Type: application/json" -d '{"span_id":"'"$SPAN_ID"'"}' | jq .
echo
echo "Testing /anas-index/search (first 3 rows)"
curl -s "http://localhost:8787/anas-index/search?q=test&fields=title,english_text,full_text&from=2000-01-01&to=2099-01-01" | jq '.[0:3]'
