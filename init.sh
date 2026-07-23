#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================"
echo "  Boardly - Setup Inicial"
echo "================================"

echo ""
echo "[1/3] Configurando Backend(Python)..."
cd "$ROOT_DIR/backend"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt --quiet
echo "  -> Dependências do Backend instaladas com sucesso"

echo ""
echo "[2/3] Configurando Frontend (React + Vite)..."
cd "$ROOT_DIR/frontend"
npm install --silent
echo "  -> Dependências do Frontend instaladas com sucesso"

echo ""
echo "[3/3] Iniciando serviços e servidores..."
echo ""

cd "$ROOT_DIR/backend"
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd "$ROOT_DIR/frontend"
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

sleep 3

echo "================================"
echo "  Boardly está em execução"
echo "================================"
echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  Precione Ctrl+C para parar os processos"
echo "================================"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
