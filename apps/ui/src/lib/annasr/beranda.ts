import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { founder } from "@/data/perusahaan"
import { STRAPI_CACHE_TTL } from "@/lib/annasr/config"
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

// UID belum ada di strapi-types hasil generate (typegen env bermasalah) — cast aman.
const UID_BERANDA = "api::beranda.beranda" as UID.ContentType

export type BerandaKonten = {
  hero?: { judul: string; deskripsi: string; keunggulan: string[] }
  founder?: {
    nama: string
    jabatan: string
    teks: string
    kutipan?: string
    foto?: string
  }
  /** "Mengapa Memilih An Nasr" — dikelola CMS di Beranda (bukan Tentang). */
  keunggulan: { judul: string; teks: string }[]
  faq: { tanya: string; jawab: string }[]
  cta?: { judul: string; deskripsi: string }
}

const HERO_DEFAULT = {
  judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
  deskripsi:
    "CV. AN NASR KONSULTAN menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan dalam setiap tahap pelaksanaan proyek.",
  keunggulan: [
    "Berdiri sejak 2014",
    "Puluhan proyek daerah",
    "Tim profesional bersertifikat",
  ],
}

const KEUNGGULAN_DEFAULT = [
  {
    judul: "Perencanaan hingga Konstruksi",
    teks: "Empat lini layanan dalam satu koordinasi, dari desain sampai serah terima.",
  },
  {
    judul: "Tenaga Ahli Bersertifikat",
    teks: "Pekerjaan ditangani tenaga teknis dengan pengalaman struktur dan infrastruktur.",
  },
  {
    judul: "Jangkauan Luas",
    teks: "Berbasis di Jombang, proyek kami tersebar di berbagai kota di Indonesia.",
  },
  {
    judul: "Transparan & Tepat Waktu",
    teks: "Laporan berkala yang jelas, progres terdokumentasi, dan komitmen waktu.",
  },
]

const FAQ_DEFAULT = [
  {
    tanya: "Layanan apa saja yang bisa dikerjakan CV. An Nasr Konsultan?",
    jawab:
      "Kami menangani perencanaan teknis, pengawasan pelaksanaan, pengurusan perizinan bangunan (PBG dan SLF), serta pelaksanaan konstruksi bangunan gedung, jalan, jembatan, dan irigasi.",
  },
  {
    tanya: "Bagaimana tahapan kerja sama dari awal sampai selesai?",
    jawab:
      "Dimulai dari konsultasi kebutuhan, survey lapangan, penyusunan desain dan RAB, penyiapan dokumen serta perizinan, pelaksanaan pekerjaan, pengawasan mutu, hingga serah terima beserta dokumen as built.",
  },
  {
    tanya: "Berapa lama pengurusan PBG dan SLF?",
    jawab:
      "Durasi bergantung pada kelengkapan berkas teknis dan antrean verifikasi dinas terkait. Umumnya berkas teknis kami siapkan dalam 1–2 minggu, lalu proses pengajuan kami pantau sampai persetujuan terbit.",
  },
  {
    tanya: "Apakah bisa menangani proyek di luar Kabupaten Jombang?",
    jawab:
      "Bisa. Selain Jombang, kami pernah menangani pekerjaan di Mojokerto, Kediri, Nganjuk, Surabaya, Malang, hingga beberapa kota di luar Jawa Timur.",
  },
  {
    tanya: "Bagaimana skema biaya jasa konsultan?",
    jawab:
      "Biaya disusun berdasarkan lingkup pekerjaan, nilai konstruksi, dan durasi penugasan. Setelah konsultasi awal, kami sampaikan penawaran tertulis yang rinci tanpa biaya tersembunyi.",
  },
  {
    tanya: "Apakah progres proyek dilaporkan secara berkala?",
    jawab:
      "Ya. Kami menyampaikan laporan harian, mingguan, dan dokumentasi visual pekerjaan sehingga pemberi tugas dapat memantau progres serta realisasi pembayaran termin.",
  },
]

const CTA_DEFAULT = {
  judul: "Konsultasikan Kebutuhan Proyek Anda Bersama Kami",
  deskripsi:
    "Sampaikan rencana pembangunan Anda, tim kami akan membantu menyusun solusi teknis yang tepat sasaran dan sesuai anggaran.",
}

const KUTIPAN_DEFAULT =
  "Setiap pekerjaan harus dapat dipertanggungjawabkan secara teknis maupun moral."

/**
 * Resolve URL media Strapi.
 *
 * `/uploads/...` diarahkan ke proxy same-origin `/api/asset/uploads/...`
 * (route handler `apps/ui/src/app/api/asset/[...slug]`) — jangan pernah
 * menempel STRAPI_URL internal (mis. `http://strapi:1337`) ke URL publik:
 * browser tidak bisa melookup nama host Docker tersebut.
 */
function resolvUrl(mungkin: unknown): string | undefined {
  if (!mungkin || typeof mungkin !== "string") return undefined
  if (mungkin.startsWith("http")) return mungkin
  // Hanya upload asli Strapi yang butuh proxy.
  if (!mungkin.startsWith("/uploads/")) return mungkin

  return `/api/asset${mungkin}`
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback
}

/** Hero `keunggulan` — dulu JSON, sekarang text (satu baris = satu poin). */
function keunggulanBaris(v: unknown, fallback: string[]): string[] {
  if (Array.isArray(v)) {
    const nilai = v.map((x) =>
      typeof x === "string"
        ? x
        : String((x as { value?: unknown; teks?: unknown })?.value ?? "")
    )

    return nilai.some(Boolean) ? nilai.filter(Boolean) : fallback
  }

  if (typeof v === "string" && v.trim()) {
    const teks = v.trim()
    // Data lama (JSON) terbaca sebagai string JSON — parse dulu.
    if (teks.startsWith("[")) {
      try {
        const arr = JSON.parse(teks) as unknown
        if (Array.isArray(arr)) {
          const nilai = arr.filter((x): x is string => typeof x === "string")
          if (nilai.length > 0) return nilai
        }
      } catch {
        // bukan JSON — lanjut split baris
      }
    }

    const baris = teks
      .split(/\r?\n/)
      .map((b) => b.trim())
      .filter(Boolean)
    if (baris.length > 0) return baris
  }

  return fallback
}

/** Konten default (statis) — dipakai bila Strapi kosong/gagal. */
export function berandaFallback(): BerandaKonten {
  return {
    hero: HERO_DEFAULT,
    founder: { ...founder },
    keunggulan: KEUNGGULAN_DEFAULT,
    faq: FAQ_DEFAULT,
    cta: { ...CTA_DEFAULT },
  }
}

type RawBeranda = {
  hero?: {
    judul?: unknown
    deskripsi?: unknown
    keunggulan?: unknown
  }
  founder?: {
    nama?: unknown
    jabatan?: unknown
    teks?: unknown
    kutipan?: unknown
    foto?: { url?: unknown }
  }
  keunggulan?: { judul?: unknown; teks?: unknown }[]
  faq?: { tanya?: unknown; jawab?: unknown }[]
  cta?: { judul?: unknown; deskripsi?: unknown }
}

type Res = {
  data?: RawBeranda
}

export async function fetchBeranda(locale: Locale): Promise<BerandaKonten> {
  const fallback = berandaFallback()

  try {
    const params = {
      locale,
      populate: {
        hero: "smart",
        founder: "smart",
        keunggulan: "smart",
        faq: "smart",
        cta: "smart",
      },
    } as never
    const init = {
      next: {
        revalidate: STRAPI_CACHE_TTL,
        tags: [strapiCacheTag("api::beranda.beranda")],
      },
    } as never

    const result = (await PublicStrapiClient.fetchOne(
      UID_BERANDA as UID.ContentType,
      undefined,
      params,
      init
    )) as Res | undefined

    const data = result?.data
    if (!data) return fallback

    return {
      hero: data.hero
        ? {
            judul: str(data.hero.judul, fallback.hero!.judul),
            deskripsi: str(data.hero.deskripsi, fallback.hero!.deskripsi),
            keunggulan: keunggulanBaris(
              data.hero.keunggulan,
              fallback.hero!.keunggulan
            ),
          }
        : fallback.hero,
      founder: data.founder
        ? {
            nama: str(data.founder.nama, fallback.founder!.nama),
            jabatan: str(data.founder.jabatan, fallback.founder!.jabatan),
            teks: str(data.founder.teks, fallback.founder!.teks),
            kutipan: str(data.founder.kutipan, KUTIPAN_DEFAULT),
            foto: resolvUrl(data.founder.foto?.url) ?? fallback.founder!.foto,
          }
        : fallback.founder,
      keunggulan:
        data.keunggulan && data.keunggulan.length > 0
          ? data.keunggulan.map((k, i) => ({
              judul: str(
                k.judul,
                fallback.keunggulan[i]?.judul ?? `Keunggulan ${i + 1}`
              ),
              teks: str(k.teks, fallback.keunggulan[i]?.teks ?? ""),
            }))
          : fallback.keunggulan,
      faq:
        data.faq && data.faq.length > 0
          ? data.faq.map((f, i) => ({
              tanya: str(
                f.tanya,
                fallback.faq[i]?.tanya ?? `Pertanyaan ${i + 1}`
              ),
              jawab: str(f.jawab, ""),
            }))
          : fallback.faq,
      cta: data.cta
        ? {
            judul: str(data.cta.judul, CTA_DEFAULT.judul),
            deskripsi: str(data.cta.deskripsi, CTA_DEFAULT.deskripsi),
          }
        : fallback.cta,
    }
  } catch (error) {
    logNonBlockingError({
      message: "Error fetching beranda, falling back to static content",
      error: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    return fallback
  }
}
