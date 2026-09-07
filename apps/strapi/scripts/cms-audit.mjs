#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Audit "konten CMS vs fallback" untuk content-type compro An Nasr.
 *
 * Menjalankan GET ke REST Strapi untuk tiap content-type, lalu menandai
 * field penting yang KOSONG — karena field kosong = frontend akan memakai
 * fallback statis. Keluar dengan exit code 1 bila ada yang kosong/missing,
 * sehingga mudah dipakai di QA/CI:
 *
 *   pnpm -F @repo/strapi cms:audit
 *
 * Env:
 *   STRAPI_URL               — base URL Strapi (mis. https://cms-annasr.captiveau.id)
 *   STRAPI_REST_READONLY_API_KEY — opsional (public read sudah diaktifkan via RBAC)
 *   CMS_AUDIT_LOCALE         — default "en"
 *   CMS_AUDIT_CT             — opsional, filter satu content type (mis. "beranda")
 */

const STRAPI_URL = (process.env.STRAPI_URL ?? "http://127.0.0.1:1337").replace(
  /\/$/,
  ""
)
const TOKEN = process.env.STRAPI_REST_READONLY_API_KEY
const LOCALE = process.env.CMS_AUDIT_LOCALE ?? "en"
const FILTER_CT = process.env.CMS_AUDIT_CT

/**
 * Field wajib per content-type (path "a.b" = nested, "x[]" = array non-kosong).
 * Semua field di sini di-map di frontend (`apps/ui/src/lib/annasr/*`) dan
 * kalau kosong akan jatuh ke fallback statis.
 */
const SPEC = {
  "api::beranda.beranda": [
    "hero.judul",
    "hero.deskripsi",
    "hero.keunggulan[]",
    "statistik[]",
    "layanan[]",
    "portfolio[]",
    "klien[]",
    "kotaProyek[]",
    "faq[]",
    "cta.judul",
  ],
  "api::tentang.tentang": [
    "hero.judul",
    "statistik[]",
    "founder.nama",
    "perjalanan[]",
    "visiMisi[]",
    "tim[]",
    "alasan[]",
    "jangkauanJudul",
    "jangkauanDeskripsi",
    "kotaProyek[]",
  ],
  "api::layanan.layanan": ["introJudul", "layanan[]", "proses[]"],
  "api::portfolio.portfolio": ["heroJudul", "proyek[]"],
  "api::klien.klien": ["heroJudul", "klien[]"],
  "api::karir.karir": ["heroJudul", "posisi[]"],
  "api::kontak.kontak": ["heroJudul", "domisili", "kantor", "telepon", "email"],
  "api::artikel.artikel": ["heroJudul", "artikel[]"],
  "api::situs.situs": ["brandNama", "brandTagline", "navigasi[]"],
}

const ENDPOINTS = {
  "api::beranda.beranda": "beranda",
  "api::tentang.tentang": "tentang",
  "api::layanan.layanan": "layanan",
  "api::portfolio.portfolio": "portfolio",
  "api::klien.klien": "klien",
  "api::karir.karir": "karir",
  "api::kontak.kontak": "kontak",
  "api::artikel.artikel": "artikel",
  "api::situs.situs": "situs",
  "api::rekanan.rekanan": "rekanans",
}

function ambilNilai(obj, pathSegments) {
  return pathSegments.reduce(
    (acc, seg) => (acc == null ? undefined : acc[seg]),
    obj
  )
}

function cekField(data, spec) {
  const segmen = spec.split(".")
  const segmenAkhir = segmen[segmen.length - 1]
  const isArray = segmenAkhir.endsWith("[]")
  const finalSegments = isArray
    ? [...segmen.slice(0, -1), segmenAkhir.slice(0, -2)]
    : segmen
  const nilai = ambilNilai(data, finalSegments)
  if (isArray) {
    return Array.isArray(nilai) && nilai.length > 0
  }

  return typeof nilai === "string" && nilai.trim().length > 0
}
async function audit(uid) {
  const endpoint = ENDPOINTS[uid]
  const res = await fetch(
    `${STRAPI_URL}/api/${endpoint}?status=published&locale=${LOCALE}&populate=%2A`,
    {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    }
  )
  if (res.status === 404) return { data: undefined, httpStatus: 404 }

  if (!res.ok) throw new Error(`${uid} → HTTP ${res.status}`)

  const data = (await res.json()).data
  const isCollection = uid === "api::rekanan.rekanan"
  const entries = isCollection ? (Array.isArray(data) ? data : []) : [data]
  const yangDicek = isCollection
    ? [{ label: "rekanan[]", ok: entries.length > 0 }]
    : (SPEC[uid] ?? []).map((field) => ({
        label: field,
        ok: data != null && cekField(data, field),
      }))
  const kosong = yangDicek.filter((x) => !x.ok)

  return { uid, kosong, total: yangDicek.length }
}

const uids = FILTER_CT
  ? [Object.keys(SPEC).find((u) => u.includes(FILTER_CT))].filter(Boolean)
  : [...Object.keys(SPEC), "api::rekanan.rekanan"]

const results = []
for (const uid of uids) {
  try {
    results.push(await audit(uid))
  } catch (error) {
    results.push({
      uid,
      kosong: [{ label: "(gagal fetch)", ok: false }],
      total: 1,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

let exitCode = 0
for (const r of results) {
  console.log(`\n=== ${r.uid}${r.error ? ` — ERROR: ${r.error}` : ""} ===`)
  if (r.kosong.length === 0) {
    console.log("  OK: semua field terisi")
    continue
  }

  exitCode = 1
  for (const k of r.kosong) {
    console.log(`  KOSONG (→ fallback statis): ${k.label}`)
  }
}

console.log(
  `\n[cms:audit] ${results.length} content-type diperiksa. ` +
    (exitCode === 0
      ? "SEMUA TERISI — frontend mengonsumsi CMS."
      : "ADA FIELD KOSONG — frontend akan memakai fallback untuk field tersebut.")
)
process.exit(exitCode)
