#!/usr/bin/env bash
set -euo pipefail
TARGET_DIR="integrations/ana_index"
mkdir -p "$TARGET_DIR"
RAW_DB_URL="https://raw.githubusercontent.com/ana-goge/Forgotten-Languages-Analysis/main/Article-Database/webapp/newdb.db.gz"
echo "Downloading Ana's Index DB..."
curl -L "$RAW_DB_URL" -o "$TARGET_DIR/newdb.db.gz"
echo "Decompressing..."
gunzip -f "$TARGET_DIR/newdb.db.gz" || true
if [[ -f "$TARGET_DIR/newdb.db" ]]; then
  echo "OK: $TARGET_DIR/newdb.db ready."
else
  echo "Note: Could not auto-decompress. Run: gunzip integrations/ana_index/newdb.db.gz"
fi
