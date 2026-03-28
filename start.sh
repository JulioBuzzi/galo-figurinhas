#!/bin/bash
# =============================================================
# Copa 2026 — Script de inicialização local completa
# Uso: chmod +x start.sh && ./start.sh
# =============================================================

set -e
BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

echo -e "${BOLD}${BLUE}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║   🏆  COPA 2026 — Figurinhas        ║"
echo "  ║      Inicializando o projeto...      ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${RESET}"

# ─── Verifica pré-requisitos ───────────────────────────────
echo -e "${YELLOW}► Verificando pré-requisitos...${RESET}"

command -v java  >/dev/null 2>&1 || { echo "❌ Java 17+ não encontrado. Instale em: https://adoptium.net"; exit 1; }
command -v mvn   >/dev/null 2>&1 || { echo "❌ Maven não encontrado. Instale em: https://maven.apache.org"; exit 1; }
command -v node  >/dev/null 2>&1 || { echo "❌ Node.js 18+ não encontrado. Instale em: https://nodejs.org"; exit 1; }
command -v npm   >/dev/null 2>&1 || { echo "❌ npm não encontrado."; exit 1; }

echo "  ✅ Java:  $(java -version 2>&1 | head -n1)"
echo "  ✅ Maven: $(mvn -version 2>&1 | head -n1)"
echo "  ✅ Node:  $(node -v)"

# ─── Configura .env do frontend ───────────────────────────
if [ ! -f "frontend/.env.local" ]; then
  echo -e "\n${YELLOW}► Criando frontend/.env.local...${RESET}"
  cp frontend/.env.local.example frontend/.env.local
  echo "  ℹ️  NEXT_PUBLIC_API_URL=http://localhost:8080 configurado"
fi

# ─── Instala dependências do frontend ─────────────────────
echo -e "\n${YELLOW}► Instalando dependências do frontend...${RESET}"
cd frontend && npm install --silent && cd ..
echo "  ✅ node_modules instalado"

# ─── Compila o backend ────────────────────────────────────
echo -e "\n${YELLOW}► Compilando backend Spring Boot...${RESET}"
cd backend && mvn clean package -DskipTests -q && cd ..
echo "  ✅ JAR gerado"

# ─── Sobe o backend em background ─────────────────────────
echo -e "\n${GREEN}► Iniciando backend na porta 8080...${RESET}"
export DATABASE_URL="${DATABASE_URL:-jdbc:postgresql://localhost:5432/copa2026}"
export JWT_SECRET="${JWT_SECRET:-copa2026_super_secret_key_256bits_minimum_length}"
export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

cd backend
java -jar target/copa2026-backend-1.0.0.jar &
BACKEND_PID=$!
cd ..

echo "  Backend PID: $BACKEND_PID"

# Aguarda o backend subir
echo -n "  Aguardando backend iniciar"
for i in {1..20}; do
  sleep 2
  if curl -sf http://localhost:8080/api/stickers >/dev/null 2>&1; then
    echo -e " ✅"
    break
  fi
  echo -n "."
done

# ─── Sobe o frontend ──────────────────────────────────────
echo -e "\n${GREEN}► Iniciando frontend Next.js na porta 3000...${RESET}"
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

# ─── Resumo ───────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║   ✅  Sistema rodando!               ║"
echo "  ║                                      ║"
echo "  ║  🌐 Frontend: http://localhost:3000  ║"
echo "  ║  🔧 Backend:  http://localhost:8080  ║"
echo "  ║                                      ║"
echo "  ║  Pressione Ctrl+C para parar tudo    ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${RESET}"

# ─── Aguarda Ctrl+C e para os processos ──────────────────
trap "echo -e '\n⛔ Encerrando...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
