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
import { STRAPI_CACHE_TTL } from "@/lib/annasr/config"
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

// UID belum ada di strapi-types hasil generate (typegen env bermasalah) — cast aman.
const UID_BERANDA = "api::beranda.beranda" as UID.ContentType

export type BerandaGambar = { url: string; alt?: string }

export type ArtikelBeranda = {
  slug: string
  judul: string
  ringkas: string
  tanggal: string
  kategori: string
  penulis: string
  gambar: string
  unggulan?: boolean
  isi: string[]
}

export type BerandaKonten = {
  hero?: { judul: string; deskripsi: string; keunggulan: string[] }
  statistik: { nilai: string; label: string }[]
  founder?: {
    nama: string
    jabatan: string
    teks: string
    kutipan?: string
    foto?: string
  }
  /** "Mengapa Memilih An Nasr" — dikelola CMS di Beranda (bukan Tentang). */
  keunggulan: { judul: string; teks: string }[]
  layanan: { slug: string; judul: string; ringkas: string; gambar: string }[]
  portfolio: {
    nama: string
    lokasi: string
    kategori: string
    gambar: string
  }[]
  klien: { nama: string; logo?: string }[]
  kotaProyek: { nama: string; lat: number; lng: number }[]
  jangkauanJudul: string
  jangkauanDeskripsi: string
  artikel: ArtikelBeranda[]
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

const STATISTIK_DEFAULT = [
  { nilai: "15+", label: "Tahun Pengalaman" },
  { nilai: "7", label: "Tahap Kerja Terukur" },
  { nilai: "4", label: "Lini Layanan" },
]

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

const JANGKAUAN_DEFAULT = {
  judul: "20+ kota di Indonesia telah kami kawal",
  deskripsi:
    "Berbasis di Jombang, pekerjaan kami tersebar melintasi Jawa hingga Indonesia Timur.",
}

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

function slugify(teks: string): string {
  return teks
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")
}

/** Konten default (statis) — dipakai bila Strapi kosong/gagal. */
export function berandaFallback(): BerandaKonten {
  return {
    hero: HERO_DEFAULT,
    statistik: STATISTIK_DEFAULT,
    founder: { ...founder },
    keunggulan: KEUNGGULAN_DEFAULT,
    layanan: layanan.map((l) => ({
      slug: l.slug,
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
    klien: klien.map((nama) => ({ nama })),
    kotaProyek: [...kotaProyek],
    jangkauanJudul: JANGKAUAN_DEFAULT.judul,
    jangkauanDeskripsi: JANGKAUAN_DEFAULT.deskripsi,
    artikel: artikel.map((a) => ({ ...a })),
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
  statistik?: unknown[]
  founder?: {
    nama?: unknown
    jabatan?: unknown
    teks?: unknown
    kutipan?: unknown
    foto?: { url?: unknown }
  }
  keunggulan?: { judul?: unknown; teks?: unknown }[]
  layanan?: {
    slug?: unknown
    judul?: unknown
    ringkas?: unknown
    gambar?: { url?: unknown }
  }[]
  portfolio?: {
    nama?: unknown
    lokasi?: unknown
    kategori?: unknown
    gambar?: { url?: unknown }
  }[]
  klien?: { nama?: unknown; logo?: { url?: unknown } }[]
  kotaProyek?: { nama?: unknown; lat?: unknown; lng?: unknown }[]
  jangkauanJudul?: unknown
  jangkauanDeskripsi?: unknown
  artikel?: {
    slug?: unknown
    judul?: unknown
    ringkas?: unknown
    tanggal?: unknown
    kategori?: unknown
    penulis?: unknown
    gambar?: { url?: unknown }
    unggulan?: unknown
    isi?: unknown
  }[]
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
        statistik: "smart",
        founder: "smart",
        keunggulan: "smart",
        layanan: "smart",
        portfolio: "smart",
        klien: "smart",
        kotaProyek: "smart",
        artikel: "smart",
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
      layanan:
        data.layanan && data.layanan.length > 0
          ? data.layanan.map((l, i) => ({
              slug: str(l.slug, fallback.layanan[i]?.slug ?? ""),
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
                resolvUrl(p.gambar?.url) ??
                fallback.portfolio[i]?.gambar ??
                "/images/annasr/proyek-gedung.jpg",
            }))
          : fallback.portfolio,
      klien:
        data.klien && data.klien.length > 0
          ? data.klien
              .map((k) => ({
                nama: str(k.nama, ""),
                logo: resolvUrl((k.logo as undefined | { url?: unknown })?.url),
              }))
              .filter((k) => k.nama)
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
      jangkauanJudul: str(data.jangkauanJudul, JANGKAUAN_DEFAULT.judul),
      jangkauanDeskripsi: str(
        data.jangkauanDeskripsi,
        JANGKAUAN_DEFAULT.deskripsi
      ),
      artikel:
        data.artikel && data.artikel.length > 0
          ? data.artikel.map((a, i) => {
              const judul = str(a.judul, `Artikel ${i + 1}`)
              const statis = fallback.artikel[i]

              return {
                slug: str(a.slug, statis?.slug ?? slugify(judul)),
                judul,
                ringkas: str(a.ringkas, statis?.ringkas ?? ""),
                tanggal: str(a.tanggal, statis?.tanggal ?? ""),
                kategori: str(a.kategori, statis?.kategori ?? "Artikel"),
                penulis: str(a.penulis, statis?.penulis ?? ""),
                gambar: resolvUrl(a.gambar?.url) ?? statis?.gambar ?? "",
                unggulan: a.unggulan === true,
                isi:
                  Array.isArray(a.isi) && a.isi.length > 0
                    ? a.isi
                        .map((x) => (typeof x === "string" ? x : ""))
                        .filter((x) => x.length > 0)
                    : (statis?.isi ?? []),
              }
            })
          : fallback.artikel,
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
