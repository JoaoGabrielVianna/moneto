#!/usr/bin/env bash
set -e
set -a  # ativa auto-export

# Carrega variáveis do .env
source .env
set +a  # desativa auto-export

echo "🚀 Running migrations for API..."

for file in $(ls services/income/migrations/*.sql | sort); do
  echo "📂 Applying $file"
  psql "$DATABASE_URL" -f "$file"
done

echo "✅ Migrations applied!"
