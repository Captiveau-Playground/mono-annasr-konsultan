import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import {
  artikel,
  founder,
  klien,
  kotaProyek,
  layanan,
  portfolio,
} from "@/data/perusahaan"
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

// UID belum ada di strapi-types hasil generate (typegen env bermasalah) — cast aman.
const UID_BERANDA = "api::beranda.beranda" as UID.ContentType

export type BerandaGambar = { url: string; alt?: string }

export type BerandaKonten = {
  hero?: { judul: string; deskripsi: string; keunggulan: string[] }
  statistik: { nilai: string; label: string }[]
  founder?: { nama: string; jabatan: string; teks: string }
  layanan: { judul: string; ringkas: string; gambar: string }[]
  portfolio: {
    nama: string
    lokasi: string
    kategori: string
    gambar: string
  }[]
  klien: string[]
  kotaProyek: { nama: string; lat: number; lng: number }[]
  faq: { tanya: string; jawab: string }[]
  artikel: {
    judul: string
    ringkas: string
    kategori: string
    tanggal: string
    gambar: string
  }[]
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

const STATISTIK_DEFAULT = [
  { nilai: "15+", label: "Tahun Pengalaman" },
  { nilai: "7", label: "Tahap Kerja Terukur" },
  { nilai: "4", label: "Lini Layanan" },
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

function resolvUrl(mungkin: unknown): string | undefined {
  if (!mungkin || typeof mungkin !== "string") return undefined
  if (mungkin.startsWith("http")) return mungkin
  const base = process.env.STRAPI_URL?.replace(/\/$/, "")

  return base ? `${base}${mungkin}` : mungkin
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback
}

function strArr(v: unknown, fallback: string[]): string[] {
  if (Array.isArray(v)) {
    const nilai = v.map((x) =>
      typeof x === "string" ? x : ((x as { value?: string })?.value ?? "")
    )

    return nilai.some(Boolean) ? nilai.filter(Boolean) : fallback
  }

  return fallback
}

/** Konten default (statis) — dipakai bila Strapi kosong/gagal. */
export function berandaFallback(): BerandaKonten {
  return {
    hero: HERO_DEFAULT,
    statistik: STATISTIK_DEFAULT,
    founder: { ...founder },
    layanan: layanan.map((l) => ({
      judul: l.nama,
      ringkas: l.ringkas,
      gambar: l.gambar,
    })),
    portfolio: portfolio.map((p) => ({
      nama: p.nama,
      lokasi: p.lokasi,
      kategori: p.kategori,
      gambar: p.gambar,
    })),
    klien: [...klien],
    kotaProyek: [...kotaProyek],
    faq: FAQ_DEFAULT,
    artikel: artikel.map((a) => ({
      judul: a.judul,
      ringkas: a.ringkas,
      kategori: a.kategori,
      tanggal: a.tanggal,
      gambar: a.gambar,
    })),
    cta: { ...CTA_DEFAULT },
  }
}

type RawBeranda = {
  hero?: {
    judul?: unknown
    deskripsi?: unknown
    keunggulan?: unknown
  }
  statistik?: unknown[]
  founder?: { nama?: unknown; jabatan?: unknown; teks?: unknown }
  layanan?: { judul?: unknown; ringkas?: unknown; gambar?: { url?: unknown } }[]
  portfolio?: {
    nama?: unknown
    lokasi?: unknown
    kategori?: unknown
    gambar?: { url?: unknown }
  }[]
  klien?: { nama?: unknown }[]
  kotaProyek?: { nama?: unknown; lat?: unknown; lng?: unknown }[]
  faq?: { tanya?: unknown; jawab?: unknown }[]
  artikel?: {
    judul?: unknown
    ringkas?: unknown
    kategori?: unknown
    tanggal?: unknown
    gambar?: { url?: unknown }
  }[]
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
        statistik: "smart",
        founder: "smart",
        layanan: "smart",
        portfolio: "smart",
        klien: "smart",
        kotaProyek: "smart",
        faq: "smart",
        artikel: "smart",
        cta: "smart",
      },
    } as never
    const init = {
      next: {
        revalidate: 120,
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
            keunggulan: strArr(data.hero.keunggulan, fallback.hero!.keunggulan),
          }
        : fallback.hero,
      statistik:
        data.statistik && data.statistik.length > 0
          ? data.statistik.map((s) => ({
              nilai: str((s as { nilai?: unknown }).nilai, "—"),
              label: str((s as { label?: unknown }).label, ""),
            }))
          : fallback.statistik,
      founder: data.founder
        ? {
            nama: str(data.founder.nama, fallback.founder!.nama),
            jabatan: str(data.founder.jabatan, fallback.founder!.jabatan),
            teks: str(data.founder.teks, fallback.founder!.teks),
          }
        : fallback.founder,
      layanan:
        data.layanan && data.layanan.length > 0
          ? data.layanan.map((l, i) => ({
              judul: str(
                l.judul,
                fallback.layanan[i]?.judul ?? `Layanan ${i + 1}`
              ),
              ringkas: str(l.ringkas, fallback.layanan[i]?.ringkas ?? ""),
              gambar:
                resolvUrl(l.gambar?.url) ?? fallback.layanan[i]?.gambar ?? "",
            }))
          : fallback.layanan,
      portfolio:
        data.portfolio && data.portfolio.length > 0
          ? data.portfolio.map((p, i) => ({
              nama: str(
                p.nama,
                fallback.portfolio[i]?.nama ?? `Proyek ${i + 1}`
              ),
              lokasi: str(p.lokasi, ""),
              kategori: str(p.kategori, "Bangunan"),
              gambar:
                resolvUrl(p.gambar?.url) ?? fallback.portfolio[i]?.gambar ?? "",
            }))
          : fallback.portfolio,
      klien:
        data.klien && data.klien.length > 0
          ? data.klien.map((k) => str(k.nama, "")).filter(Boolean)
          : fallback.klien,
      kotaProyek:
        data.kotaProyek && data.kotaProyek.length > 0
          ? data.kotaProyek
              .map((k) => ({
                nama: str(k.nama, ""),
                lat: Number(k.lat),
                lng: Number(k.lng),
              }))
              .filter(
                (k) =>
                  k.nama && Number.isFinite(k.lat) && Number.isFinite(k.lng)
              )
          : fallback.kotaProyek,
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
      artikel:
        data.artikel && data.artikel.length > 0
          ? data.artikel.map((a, i) => ({
              judul: str(
                a.judul,
                fallback.artikel[i]?.judul ?? `Artikel ${i + 1}`
              ),
              ringkas: str(a.ringkas, ""),
              kategori: str(a.kategori, "Artikel"),
              tanggal: str(a.tanggal, ""),
              gambar:
                resolvUrl(a.gambar?.url) ?? fallback.artikel[i]?.gambar ?? "",
            }))
          : fallback.artikel,
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
