#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Deploy manual di server: pull image GHCR + up compose.
#  Biasanya ini dijalankan oleh GitHub Actions (deploy-server.yml);
#  skrip ini untuk alternatif/rollback manual.
#
#  Keperluan di server:
#    - docker & docker compose
#    - folder ini sebagai /opt/mono-annasr-konsultan/deploy (BEBAS pindahkan)
#    - .env terisi (lihat .env.example)
#    - Dockerfile-lokal tidak diperlukan — image sudah di GHCR
# ─────────────────────────────────────────────────────────────
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$dir"

# Login GHCR bila image private (GHCR_USER + GHCR_TOKEN dari env/terminal).
if [ -n "${GHCR_USER:-}" ] && [ -n "${GHCR_TOKEN:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
fi

echo "→ Pull image terbaru…"
docker compose pull ui strapi

echo "→ Restart layanan…"
docker compose up -d --remove-orphans

echo "→ Bersihkan image tak terpakai…"
docker image prune -f

echo "✓ Deploy selesai. Cek: docker compose ps / curl localhost:3000/api/health"