#!/usr/bin/env bash
#
# Cek di PRODUKSI: apakah UI benar-benar memanggil Strapi (CMS) yang sama.
#
# Caranya:
#   1) [baca-saja, tanpa token] Halaman publik harus merender media dari CMS
#      (pola /uploads/...) — media hanya ada dari Media Library Strapi, tidak
#      mungkin muncul dari fallback statis FE.
#   2) [marker, perlu token] Tulis nilai unik ke situs.brandTagline + publish,
#      lalu cek website menampilkannya (bukti end-to-end + realtime), lalu
#      kembalikan nilai asli.
#
# Pemakaian:
#   CMS_LIVE_CHECK_UI=https://annasr.captiveau.id \
#   CMS_LIVE_CHECK_CMS=https://cms-annasr.captiveau.id \
#   CMS_LIVE_CHECK_TOKEN=<token read+update+publish Situs> \
#   bash qa/checks/cms-connect-check.sh
#
# Tanpa token → hanya cek baca-saja (tetap indikatif).
# Exit code 0 = PASS, 1 = FAIL, 2 = tidak bisa disimpulkan.

set -euo pipefail

UI="${CMS_LIVE_CHECK_UI:-}"
CMS="${CMS_LIVE_CHECK_CMS:-}"
TOKEN="${CMS_LIVE_CHECK_TOKEN:-}"
if [ -z "$UI" ]; then UI="https://annasr.captiveau.id"; fi
if [ -z "$CMS" ]; then CMS="https://cms-annasr.captiveau.id"; fi

echo "== Cek koneksi UI -> CMS di PRODUKSI =="
echo "   UI : $UI"
echo "   CMS: $CMS"
echo

pass=0
fail=0

fetch() { curl -sL --max-time 25 "$@"; }

# ---------------------------------------------------------------- 1) baca-saja
echo "--- 1) Media dari CMS (/uploads) di halaman publik ---"
uploads_home="$(fetch "$UI/" | grep -oE "(/uploads/|$CMS/uploads/)[A-Za-z0-9_.-]+" | head -1 || true)"
if [ -n "${uploads_home}" ]; then
  echo "   PASS | home merender media CMS: ${uploads_home}"
  pass=$((pass + 1))
else
  uploads_tentang="$(fetch "$UI/tentang" | grep -oE "(/uploads/|$CMS/uploads/)[A-Za-z0-9_.-]+" | head -1 || true)"
  if [ -n "${uploads_tentang}" ]; then
    echo "   PASS | halaman tentang merender media CMS: ${uploads_tentang}"
    pass=$((pass + 1))
  else
    echo "   INFO | tidak ada media /uploads di home/tentang."
    echo "         (bisa jadi: STRAPI_URL masih internal/http, UI masih cache lama,"
    echo "          atau CMS memang belum ter-seed — lanjut ke tes marker untuk pasti)"
  fi
fi

# ---------------------------------------------------------------- 2) marker
if [ -n "${TOKEN}" ]; then
  marker="PROD-CHECK-$(date +%s)"
  doc=""
  orig=""
  cleanup() {
    if [ -n "${doc}" ] && [ -n "${orig}" ]; then
      curl -s --max-time 20 -X PUT \
        "${CMS}/api/situs/${doc}?status=published&locale=en" \
        -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
        -d "{\"data\":{\"brandTagline\":\"${orig}\"}}" >/dev/null 2>&1 || true
    fi
  }
  trap cleanup EXIT

  echo
  echo "--- 2) Marker unik CMS -> UI (end-to-end + realtime) ---"
  doc="$(fetch "${CMS}/api/situs?status=published&locale=en" | grep -o '"documentId":"[^"]*"' | head -1 | cut -d'"' -f4 || true)"
  [ -z "${doc}" ] && { echo "   FAIL | tidak dapat documentId Situs (cek token/lokasi)" ; fail=$((fail + 1)); } && exit 1

  orig="$(fetch "${CMS}/api/situs?status=published&locale=en" | grep -o '"brandTagline":"[^"]*"' | head -1 | cut -d'"' -f4 || true)"
  echo "   tulis marker '${marker}' ke situs.brandTagline (doc=${doc}) ..."
  http_code="$(curl -s --max-time 25 -o /dev/null -w '%{http_code}' -X PUT \
    "${CMS}/api/situs/${doc}?status=published&locale=en" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
    -d "{\"data\":{\"brandTagline\":\"${marker}\"}}")"
  [ "${http_code}" != "200" ] && [ "${http_code}" != "201" ] && {
    echo "   FAIL | PUT /api/situs → HTTP ${http_code} (cek permission token)"
    fail=$((fail + 1)); exit 1
  }

  found=0
  for _ in $(seq 1 45); do
    if fetch "${UI}/" | grep -q "${marker}"; then found=1; break; fi
    sleep 1
  done
  if [ "${found}" = "1" ]; then
    echo "   PASS | website menampilkan '${marker}' (berasal dari CMS ini) — UI <-> CMS TERHUBUNG + realtime."
    pass=$((pass + 1))
  else
    echo "   FAIL | marker tidak tampil di ${UI} setelah 45 detik."
    echo "         Kemungkinan: UI tidak membaca CMS ini / cache CDN / STRAPI_URL berbeda."
    fail=$((fail + 1))
  fi
else
  echo
  echo "SKIP tes marker (set CMS_LIVE_CHECK_TOKEN untuk bukti end-to-end yang pasti)."
fi

echo
echo "== HASIL: PASS=${pass} FAIL=${fail} =="
[ "${pass}" -gt 0 ] && [ "${fail}" -eq 0 ] && exit 0
[ "${fail}" -gt 0 ] && exit 1
exit 2