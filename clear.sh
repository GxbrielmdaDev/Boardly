#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================"
echo "  Boardly - Limpando"
echo "================================"
echo ""

echo "[Backend]"
if [ -d "$ROOT_DIR/backend/.venv" ]; then
    rm -rf "$ROOT_DIR/backend/.venv"
    echo "  - Removed .venv"
fi
if [ -f "$ROOT_DIR/backend/boardly.db" ]; then
    rm -f "$ROOT_DIR/backend/boardly.db"
    echo "  - Removed boardly.db"
fi
find "$ROOT_DIR/backend" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find "$ROOT_DIR/backend" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null
echo "  - Removed __pycache__ and .pytest_cache"

echo "[Frontend]"
if [ -d "$ROOT_DIR/frontend/node_modules" ]; then
    rm -rf "$ROOT_DIR/frontend/node_modules"
    echo "  - Removed node_modules"
fi
if [ -d "$ROOT_DIR/frontend/dist" ]; then
    rm -rf "$ROOT_DIR/frontend/dist"
    echo "  - Removed dist"
fi

echo "[Root]"
find "$ROOT_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find "$ROOT_DIR" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null
echo "  - Cleaned __pycache__ and .pytest_cache"

echo ""
echo "================================"
echo "  Limpeza concluída!"
echo "================================"
