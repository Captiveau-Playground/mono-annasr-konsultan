import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  type LucideIcon,
} from "lucide-react"
import type { Locale } from "next-intl"

import {
  artikel,
  founder,
  klien,
  kotaProyek,
  layanan,
  perusahaan,
  portfolio,
} from "@/data/perusahaan"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { STRAPI_CACHE_TTL } from "@/lib/annasr/config"
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

const uid = (nama: string) => `api::${nama}.${nama}` as UID.ContentType

/** Ikon stabil per-slug layanan (bukan per-indeks) supaya konsisten walau
 * urutan/jumlah layanan di CMS berubah. */
const IKON_BY_SLUG: Record<string, LucideIcon> = {
  perencanaan: Building2,
  pengawasan: ClipboardCheck,
  perizinan: FileCheck2,
  konstruksi: HardHat,
}

export function ikonLayanan(slug: string): LucideIcon {
  return IKON_BY_SLUG[slug] ?? Building2
}

export const slugify = (teks: string) =>
  teks
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")

function teks(v: unknown, fb: string): string {
  return typeof v === "string" && v.trim() ? v : fb
}

/**
 * Parse daftar teks dari CMS — dukung tiga bentuk:
 *  - array string (mis. hasil REST lama/JSON),
 *  - array { value } / { teks },
 *  - string textarea (satu baris = satu item), termasuk data JSON lama yang
 *    terbaca sebagai string `["...","..."]`.
 */
function teksArr(v: unknown, fb: string[]): string[] {
  if (Array.isArray(v)) {
    const nilai = v.map((x) =>
      typeof x === "string"
        ? x
        : String(
            (x as { value?: unknown; teks?: unknown })?.value ??
              (x as { teks?: unknown })?.teks ??
              ""
          )
    )

    return nilai.some(Boolean) ? nilai.filter(Boolean) : fb
  }

  if (typeof v === "string" && v.trim()) {
    const teksRaw = v.trim()
    // Data lama (JSON) yang terbaca sebagai string JSON.
    if (teksRaw.startsWith("[")) {
      try {
        const arr = JSON.parse(teksRaw) as unknown
        if (Array.isArray(arr)) {
          const nilai = arr.filter((x): x is string => typeof x === "string")
          if (nilai.length > 0) return nilai
        }
      } catch {
        // bukan JSON — lanjut split baris
      }
    }

    const baris = teksRaw
      .split(/\r?\n/)
      .map((b) => b.trim())
      .filter(Boolean)
    if (baris.length > 0) return baris
  }

  return fb
}

function medUrl(v: undefined | { url?: unknown }, fb: string): string {
  const url = v?.url
  if (!url || typeof url !== "string") return fb
  if (url.startsWith("http")) return url
  // Hanya upload asli Strapi yang butuh proxy same-origin. Path statis FE
  // (/images/…) tetap dipakai relatif — lebih cepat, tidak kena blokir Next
  // image optimizer, dan tidak bocor host internal strapi:1337 ke browser.
  if (!url.startsWith("/uploads/")) return url

  return `/api/asset${url}`
}

type SeoEntry = { halaman?: unknown; judul?: unknown; deskripsi?: unknown }

type SeoHalaman = { judul: string; deskripsi: string }

/**
 * Peta SEO per halaman dari CMS (situs.seo — repeatable seo-meta).
 * Halaman yang tidak diisi → key tidak ada → halaman memakai default lokalnya.
 */
function seoCms(v: unknown): Record<string, SeoHalaman> {
  if (!Array.isArray(v)) return {}

  const hasil: Record<string, SeoHalaman> = {}
  for (const e of v as SeoEntry[]) {
    const kunci = teks(e.halaman, "")
    if (!kunci) continue
    const judul = teks(e.judul, "")
    const deskripsi = teks(e.deskripsi, "")
    if (!judul && !deskripsi) continue

    hasil[kunci] = { judul, deskripsi }
  }

  return hasil
}

type Raw = Record<string, unknown>

/** Item layanan lengkap (dipakai /layanan dan detail) dengan fallback statis. */
export function layananCms(
  daftar: Record<string, unknown>[],
  urlGambar: (x: Record<string, unknown>) => string
) {
  const sumber: Record<string, unknown>[] =
    daftar.length > 0
      ? daftar
      : layanan.map((l) => ({
          judul: l.nama,
          ringkas: l.ringkas,
          gambar: { url: l.gambar },
        }))

  return sumber.map((l, i) => {
    const statis = layanan[i]
    const judul = teks(l.judul, statis?.nama ?? `Layanan ${i + 1}`)

    return {
      slug: teks(l.slug, statis?.slug ?? slugify(judul)),
      nama: judul,
      ikon: ikonLayanan(teks(l.slug, statis?.slug ?? "")),
      ringkas: teks(l.ringkas, statis?.ringkas ?? ""),
      detail: teksArr(l.detail, statis?.detail ?? []),
      gambar: urlGambar(l),
      alt: judul,
      galeri:
        Array.isArray(l.galeri) &&
        (l.galeri as { url?: unknown; alt?: unknown }[]).length
          ? (l.galeri as { url?: unknown; alt?: unknown }[]).map((g) => ({
              src: medUrl(g, ""),
              alt: teks(g.alt, judul),
            }))
          : (statis?.galeri ?? []),
      deskripsi: teks(l.deskripsi, statis?.deskripsi ?? ""),
      manfaat: teksArr(l.manfaat, statis?.manfaat ?? []),
      alur: Array.isArray(l.alur)
        ? (l.alur as { judul?: unknown; teks?: unknown }[]).map((a) => ({
            judul: teks(a.judul, ""),
            teks: teks(a.teks, ""),
          }))
        : (statis?.alur ?? []),
      persyaratan: Array.isArray(l.persyaratan)
        ? (
            l.persyaratan as {
              judul?: unknown
              deskripsi?: unknown
              daftar?: unknown
            }[]
          ).map((p) => ({
            judul: teks(p.judul, ""),
            deskripsi: teks(p.deskripsi, ""),
            daftar: teksArr(p.daftar, []),
          }))
        : (statis?.persyaratan ?? []),
      dokumenClient: (() => {
        const d = l.dokumenClient
        if (d == null || typeof d !== "object") {
          return statis?.dokumenClient
        }
        const dc = d as {
          judul?: unknown
          deskripsi?: unknown
          gambar?: { url?: unknown }
          daftar?: unknown
        }

        return {
          judul: teks(
            dc.judul,
            statis?.dokumenClient?.judul ?? "Apa saja yang didapatkan client"
          ),
          deskripsi: teks(dc.deskripsi, statis?.dokumenClient?.deskripsi ?? ""),
          gambar: medUrl(dc.gambar, statis?.dokumenClient?.gambar ?? ""),
          daftar: teksArr(dc.daftar, statis?.dokumenClient?.daftar ?? []),
        }
      })(),
    }
  })
}

export type ItemNavigasi = {
  label: string
  href: string
  /** Submenu (dropdown) — diisikan CMS bila item bergrup. */
  anak?: { label: string; href: string; deskripsi?: string }[]
}

export type ItemKarir = {
  nama: string
  tipe: string
  lokasi: string
  slug: string
  status: "terbuka" | "ditutup"
  ringkas: string
  deskripsi: string
  tanggungJawab: string[]
  kualifikasi: string[]
  manfaat: string[]
}

export type KontenSitus = {
  beranda: BerandaKonten
  tentang: {
    hero: { judul: string; deskripsi: string; keunggulan: string[] }
    statistik: { nilai: string; label: string }[]
    founder: {
      nama: string
      jabatan: string
      teks: string
      kutipan: string
      foto?: string
    }
    perjalanan: { tahun: string; judul: string; teks: string }[]
    visiMisi: { judul: string; teks: string }[]
    tim: { nama: string; jabatan: string; foto?: string; linkedin?: string }[]
    alasan: { judul: string; teks: string }[]
    /** Inti "Tentang Kami" — dari field `tentang` (persyaratan-kartu) di CMS. */
    tentangInti: { judul: string; deskripsi: string; daftar: string[] }
    jangkauanJudul: string
    jangkauanDeskripsi: string
    kotaProyek: { nama: string; lat: number; lng: number }[]
  }
  layanan: ReturnType<typeof layananCms>
  layananIntro: { judul: string; deskripsi: string }
  proses: { judul: string; teks: string }[]
  portfolio: {
    nama: string
    instansi: string
    lokasi: string
    kategori: string
    gambar: string
  }[]
  portfolioHero: { judul: string; deskripsi: string }
  klien: { nama: string; logo?: string }[]
  klienHero: { judul: string; deskripsi: string }
  karir: ItemKarir[]
  karirHero: { judul: string; deskripsi: string }
  kontak: {
    judul: string
    deskripsi: string
    domisili: string
    kantor: string
    telepon: string
    email: string
    jamOperasional: string
    instagram?: string
    whatsapp?: string
  }
  artikel: ReturnType<typeof artikelCms>
  artikelHero: { judul: string; deskripsi: string }
  situs: {
    brandNama: string
    brandTagline: string
    rekananIntroJudul: string
    rekananIntroDeskripsi: string
    navigasi: ItemNavigasi[]
    /** Judul/deskripsi meta per halaman — dikelola CMS (situs.seo). */
    seo: Record<string, { judul: string; deskripsi: string }>
    /** Judul/deskripsi section lintas halaman — dikelola CMS. */
    keunggulanJudul: string
    keunggulanDeskripsi: string
    prosesJudul: string
    prosesDeskripsi: string
    faqJudul: string
    faqDeskripsi: string
    artikelJudul: string
    artikelDeskripsi: string
    perjalananJudul: string
    perjalananDeskripsi: string
    visiMisiJudul: string
    visiMisiDeskripsi: string
    timJudul: string
    timDeskripsi: string
  }
}

function artikelCms(daftar: Record<string, unknown>[]) {
  const sumber =
    daftar.length > 0
      ? daftar
      : artikel.map((a) => ({ ...a, gambar: { url: a.gambar } }))

  return sumber.map((a, i) => {
    const statis = artikel[i]
    const judul = teks(a.judul, statis?.judul ?? `Artikel ${i + 1}`)

    return {
      slug: teks(a.slug, statis?.slug ?? slugify(judul)),
      judul,
      ringkas: teks(a.ringkas, ""),
      tanggal: teks(a.tanggal, statis?.tanggal ?? ""),
      kategori: teks(a.kategori, "Artikel"),
      penulis: teks(a.penulis, "Tim CV. AN NASR KONSULTAN"),
      gambar: medUrl(a.gambar as { url?: unknown }, statis?.gambar ?? ""),
      unggulan: Boolean((a as { unggulan?: unknown }).unggulan === true),
      isi: teksArr(a.isi, statis?.isi ?? []),
    }
  })
}

/**
 * Field komponen per tipe konten yang dipakai `ambil()`.
 *
 * Plugin @notum-cz/strapi-plugin-smart-populate hanya menerima bentuk objek
 * (`populate[hero]=smart`), bukan nilai string datar (`populate=smart`)
 * yang ditolak Strapi dengan "Invalid key smart".
 */
const POPULATE_SMART: Record<string, Record<string, "smart">> = {
  tentang: {
    hero: "smart",
    statistik: "smart",
    founder: "smart",
    perjalanan: "smart",
    visiMisi: "smart",
    tim: "smart",
    alasan: "smart",
    kotaProyek: "smart",
  },
  kontak: {},
  artikel: {},
  situs: { navigasi: "smart", seo: "smart", proses: "smart" },
}

/** Populate per collection (komponen bertingkat pakai "smart"; MEDIA wajib "true"). */
const POPULATE_KOLEKSI: Record<string, Record<string, "smart" | true>> = {
  layanan: {
    alur: "smart",
    persyaratan: "smart",
    dokumenClient: "smart",
    gambar: true,
    galeri: true,
  },
  karir: {
    tanggungJawab: "smart",
    kualifikasi: "smart",
    manfaat: "smart",
  },
  portfolio: { gambar: true },
  klien: { logo: true },
  artikel: { gambar: true },
}

/**
 * Ambil daftar dokumen dari collection type (layanan/portfolio/klien/
 * karir/artikel) — tiap item adalah satu dokumen dengan field di level atas.
 */
async function ambilKoleksi(nama: string, locale: Locale): Promise<Raw[]> {
  try {
    const populate = POPULATE_KOLEKSI[nama]
    const params =
      populate && Object.keys(populate).length > 0
        ? { locale, populate, pagination: { page: 1, pageSize: 100 } }
        : { locale, pagination: { page: 1, pageSize: 100 } }

    const result = (await PublicStrapiClient.fetchMany(
      uid(nama) as UID.ContentType,
      params,
      {
        next: {
          revalidate: STRAPI_CACHE_TTL,
          tags: [strapiCacheTag(uid(nama))],
        },
      } as never
    )) as undefined | { data?: Raw[] }

    return result?.data ?? []
  } catch (error) {
    logNonBlockingError({
      message: `fetch koleksi ${nama} gagal — fallback statis`,
      error: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    return []
  }
}

async function ambil(nama: string, locale: Locale): Promise<Raw> {
  try {
    const populate = POPULATE_SMART[nama]
    const params =
      populate && Object.keys(populate).length > 0
        ? { locale, populate }
        : { locale }

    const result = (await PublicStrapiClient.fetchOne(
      uid(nama) as UID.ContentType,
      undefined,
      params,
      {
        next: {
          revalidate: STRAPI_CACHE_TTL,
          tags: [strapiCacheTag(uid(nama))],
        },
      } as never
    )) as undefined | { data?: Raw }

    return result?.data ?? {}
  } catch (error) {
    logNonBlockingError({
      message: `fetch ${nama} gagal — fallback statis`,
      error: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    return {}
  }
}

export async function fetchKontenSitus(locale: Locale): Promise<KontenSitus> {
  const [t, lay, por, kl, kar, kon, art, sit, home] = await Promise.all([
    ambil("tentang", locale),
    ambilKoleksi("layanan", locale),
    ambilKoleksi("portfolio", locale),
    ambilKoleksi("klien", locale),
    ambilKoleksi("karir", locale),
    ambil("kontak", locale),
    ambilKoleksi("artikel", locale),
    ambil("situs", locale),
    (await import("@/lib/annasr/beranda")).fetchBeranda(locale),
  ])

  const kota = Array.isArray(t.kotaProyek)
    ? (t.kotaProyek as { nama?: unknown; lat?: unknown; lng?: unknown }[])
        .map((k) => ({
          nama: teks(k.nama, ""),
          lat: Number(k.lat),
          lng: Number(k.lng),
        }))
        .filter(
          (k) => k.nama && Number.isFinite(k.lat) && Number.isFinite(k.lng)
        )
    : kotaProyek

  return {
    beranda: home,
    tentang: {
      hero: {
        judul: teks(
          (t.hero as { judul?: unknown })?.judul,
          "Mitra teknik yang tumbuh bersama pembangunan daerah"
        ),
        deskripsi: teks(
          (t.hero as { deskripsi?: unknown })?.deskripsi,
          perusahaan.singkat
        ),
        keunggulan: teksArr((t.hero as { keunggulan?: unknown })?.keunggulan, [
          "Berdiri sejak 2014",
          "Puluhan proyek daerah",
          "Tim profesional bersertifikat",
        ]),
      },
      statistik:
        Array.isArray(t.statistik) && t.statistik.length > 0
          ? (t.statistik as { nilai?: unknown; label?: unknown }[]).map(
              (s) => ({
                nilai: teks(s.nilai, "—"),
                label: teks(s.label, ""),
              })
            )
          : [
              { nilai: "2014", label: "Berdiri" },
              { nilai: "100+", label: "Proyek Daerah" },
              { nilai: "20+", label: "Kota Dijangkau" },
              { nilai: "98%", label: "Kepuasan Klien" },
            ],
      founder: {
        nama: teks((t.founder as { nama?: unknown })?.nama, founder.nama),
        jabatan: teks(
          (t.founder as { jabatan?: unknown })?.jabatan,
          founder.jabatan
        ),
        teks: teks((t.founder as { teks?: unknown })?.teks, founder.teks),
        kutipan: teks(
          (t.founder as { kutipan?: unknown })?.kutipan,
          "Setiap pekerjaan harus dapat dipertanggungjawabkan secara teknis maupun moral."
        ),
        foto: medUrl((t.founder as { foto?: { url?: unknown } })?.foto, ""),
      },
      tentangInti: (() => {
        const inti = t.tentang as
          | undefined
          | { judul?: unknown; deskripsi?: unknown; daftar?: unknown }
        if (!inti) {
          return {
            judul: "",
            deskripsi: "",
            daftar: [],
          }
        }

        return {
          judul: teks(inti.judul, ""),
          deskripsi: teks(inti.deskripsi, ""),
          daftar: teksArr(inti.daftar, []),
        }
      })(),
      perjalanan: Array.isArray(t.perjalanan)
        ? (
            t.perjalanan as {
              tahun?: unknown
              judul?: unknown
              teks?: unknown
            }[]
          ).map((m) => ({
            tahun: teks(m.tahun, ""),
            judul: teks(m.judul, ""),
            teks: teks(m.teks, ""),
          }))
        : [],
      visiMisi: Array.isArray(t.visiMisi)
        ? (t.visiMisi as { judul?: unknown; teks?: unknown }[]).map((v) => ({
            judul: teks(v.judul, ""),
            teks: teks(v.teks, ""),
          }))
        : [],
      tim: Array.isArray(t.tim)
        ? (
            t.tim as {
              nama?: unknown
              jabatan?: unknown
              foto?: { url?: unknown }
              linkedin?: unknown
            }[]
          ).map((tm) => ({
            nama: teks(tm.nama, ""),
            jabatan: teks(tm.jabatan, ""),
            foto: medUrl(tm.foto, ""),
            linkedin: teks(tm.linkedin, ""),
          }))
        : [],
      alasan: Array.isArray(t.alasan)
        ? (t.alasan as { judul?: unknown; teks?: unknown }[]).map((a) => ({
            judul: teks(a.judul, ""),
            teks: teks(a.teks, ""),
          }))
        : [],
      jangkauanJudul: teks(
        t.jangkauanJudul,
        "20+ kota di Indonesia telah kami kawal"
      ),
      jangkauanDeskripsi: teks(
        t.jangkauanDeskripsi,
        "Berbasis di Jombang, pekerjaan kami tersebar melintasi Jawa hingga Indonesia Timur."
      ),
      kotaProyek: kota,
    },
    layanan: layananCms(lay as Record<string, unknown>[], (l) =>
      teks(
        medUrl(l.gambar as { url?: unknown }, ""),
        "/images/annasr/layanan-perencanaan.jpg"
      )
    ),
    layananIntro: {
      judul: teks(
        sit.layananIntroJudul,
        "Layanan An Nasr dalam Mendukung Proyek Anda"
      ),
      deskripsi: teks(sit.layananIntroDeskripsi, ""),
    },
    proses:
      Array.isArray(sit.proses) &&
      (sit.proses as Record<string, unknown>[]).length
        ? (sit.proses as { judul?: unknown; teks?: unknown }[]).map((p) => ({
            judul: teks(p.judul, ""),
            teks: teks(p.teks, ""),
          }))
        : [],
    portfolio:
      Array.isArray(por) && por.length
        ? (
            por as {
              nama?: unknown
              instansi?: unknown
              lokasi?: unknown
              kategori?: unknown
              gambar?: { url?: unknown }
            }[]
          ).map((p, i) => ({
            nama: teks(p.nama, portfolio[i]?.nama ?? `Proyek ${i + 1}`),
            instansi: teks(p.instansi, portfolio[i]?.instansi ?? ""),
            lokasi: teks(p.lokasi, ""),
            kategori: teks(p.kategori, "Bangunan"),
            gambar: medUrl(
              p.gambar,
              portfolio[i]?.gambar ?? "/images/annasr/proyek-gedung.jpg"
            ),
          }))
        : portfolio.map((p) => ({
            nama: p.nama,
            instansi: p.instansi,
            lokasi: p.lokasi,
            kategori: p.kategori,
            gambar: p.gambar,
          })),
    portfolioHero: {
      judul: teks(
        sit.portfolioHeroJudul,
        "Pekerjaan yang berbicara melalui hasilnya"
      ),
      deskripsi: teks(sit.portfolioHeroDeskripsi, ""),
    },
    klien:
      Array.isArray(kl) && kl.length
        ? // Dedupe by nama: guard bila DB pernah ter-seed ganda (draft/publish
          // revisi ikut keluar di REST) sehingga marquee tidak dobel.
          (() => {
            const terlihat = new Set<string>()
            const hasil: { nama: string; logo?: string }[] = []
            for (const c of kl as {
              nama?: unknown
              logo?: { url?: unknown }
            }[]) {
              const nama = teks(c.nama, "")
              if (!nama || terlihat.has(nama)) continue
              terlihat.add(nama)
              hasil.push({ nama, logo: medUrl(c.logo, "") || undefined })
            }

            return hasil
          })()
        : [...klien].map((nama) => ({ nama })),
    klienHero: {
      judul: teks(
        sit.klienHeroJudul,
        "Kepercayaan yang terjalin di banyak pintu"
      ),
      deskripsi: teks(sit.klienHeroDeskripsi, ""),
    },
    karir:
      Array.isArray(kar) && kar.length
        ? (
            kar as {
              nama?: unknown
              tipe?: unknown
              lokasi?: unknown
              slug?: unknown
              statusPosisi?: unknown
              ringkas?: unknown
              deskripsi?: unknown
              tanggungJawab?: { teks?: unknown }[]
              kualifikasi?: { teks?: unknown }[]
              manfaat?: { teks?: unknown }[]
            }[]
          )
            .map(
              (p): ItemKarir => ({
                nama: teks(p.nama, "Posisi"),
                tipe: teks(p.tipe, "Penuh Waktu"),
                lokasi: teks(p.lokasi, "Jombang"),
                slug: teks(p.slug, ""),
                status: p.statusPosisi === "ditutup" ? "ditutup" : "terbuka",
                ringkas: teks(p.ringkas, ""),
                deskripsi: teks(p.deskripsi, ""),
                tanggungJawab: (p.tanggungJawab ?? [])
                  .map((t) => teks(t.teks, ""))
                  .filter(Boolean),
                kualifikasi: (p.kualifikasi ?? [])
                  .map((t) => teks(t.teks, ""))
                  .filter(Boolean),
                manfaat: (p.manfaat ?? [])
                  .map((t) => teks(t.teks, ""))
                  .filter(Boolean),
              })
            )
            .filter((p) => p.nama)
        : [],
    karirHero: {
      judul: teks(sit.karirHeroJudul, "Tumbuh bersama tim teknik kami"),
      deskripsi: teks(sit.karirHeroDeskripsi, ""),
    },
    kontak: {
      judul: teks(kon.heroJudul, "Mari bicarakan rencana proyek Anda"),
      deskripsi: teks(kon.heroDeskripsi, ""),
      domisili: teks(kon.domisili, perusahaan.domisili),
      kantor: teks(kon.kantor, perusahaan.kantor),
      telepon: teks(kon.telepon, perusahaan.telepon),
      email: teks(kon.email, perusahaan.email),
      jamOperasional: teks(kon.jamOperasional, perusahaan.jamOperasional),
      instagram:
        typeof kon.instagram === "string" && kon.instagram.trim()
          ? kon.instagram.trim()
          : perusahaan.instagram,
      whatsapp:
        typeof kon.whatsapp === "string" && kon.whatsapp.trim()
          ? kon.whatsapp.trim()
          : undefined,
    },
    artikel: artikelCms(art as Record<string, unknown>[]),
    artikelHero: {
      judul: teks(sit.artikelHeroJudul, "Wawasan Teknik & Konstruksi"),
      deskripsi: teks(sit.artikelHeroDeskripsi, ""),
    },
    situs: {
      brandNama: teks(sit.brandNama, "CV. An Nasr Konsultan"),
      brandTagline: teks(sit.brandTagline, "Konsultan Teknik & Konstruksi"),
      rekananIntroJudul: teks(
        sit.rekananIntroJudul,
        "Rekanan & Sertifikat Kerjasama"
      ),
      rekananIntroDeskripsi: teks(
        sit.rekananIntroDeskripsi,
        "Pemerintah daerah, desa, kecamatan, yayasan, hingga mitra usaha yang mempercayakan pekerjaan tekniknya kepada kami."
      ),
      navigasi:
        Array.isArray(sit.navigasi) &&
        (sit.navigasi as Record<string, unknown>[]).length
          ? (
              sit.navigasi as {
                label?: unknown
                href?: unknown
                anak?: {
                  label?: unknown
                  href?: unknown
                  deskripsi?: unknown
                }[]
              }[]
            ).map((n) => ({
              label: teks(n.label, ""),
              href: teks(n.href, "/"),
              anak:
                Array.isArray(n.anak) && n.anak.length > 0
                  ? n.anak
                      .map((a) => ({
                        label: teks(a.label, ""),
                        href: teks(a.href, "/"),
                        deskripsi: teks(a.deskripsi, ""),
                      }))
                      .filter((a) => a.label)
                  : undefined,
            }))
          : [
              { label: "Beranda", href: "/" },
              { label: "Layanan", href: "/layanan" },
              { label: "Proyek", href: "/portfolio" },
              { label: "Tentang Kami", href: "/tentang" },
              { label: "Rekanan", href: "/rekanan" },
              { label: "Artikel", href: "/artikel" },
              { label: "Karir", href: "/karir" },
              { label: "Kontak", href: "/kontak" },
            ],
      seo: seoCms(sit.seo),
      keunggulanJudul: teks(
        sit.keunggulanJudul,
        "Mengapa Memilih An Nasr Konsultan"
      ),
      keunggulanDeskripsi: teks(sit.keunggulanDeskripsi, ""),
      prosesJudul: teks(sit.prosesJudul, "Tujuh tahap kerja yang terukur"),
      prosesDeskripsi: teks(
        sit.prosesDeskripsi,
        "Alur kerja yang sama untuk setiap proyek, sehingga progres mudah dipantau dari awal hingga serah terima."
      ),
      faqJudul: teks(sit.faqJudul, "Pertanyaan yang Sering Diajukan"),
      faqDeskripsi: teks(
        sit.faqDeskripsi,
        "Jawaban singkat untuk kebutuhan yang paling sering ditanyakan calon klien kami."
      ),
      artikelJudul: teks(
        sit.artikelJudul,
        "Wawasan teknik dari pengalaman di lapangan"
      ),
      artikelDeskripsi: teks(
        sit.artikelDeskripsi,
        "Catatan praktis seputar perencanaan, pengawasan, perizinan, dan konstruksi."
      ),
      perjalananJudul: teks(
        sit.perjalananJudul,
        "Dari kantor kecil di Jombang, menuju pembangunan di banyak kota"
      ),
      perjalananDeskripsi: teks(
        sit.perjalananDeskripsi,
        "Lebih dari satu dekade kami menumbuhkan kredibilitas lewat pekerjaan yang dapat dipertanggungjawabkan secara teknis dan moral."
      ),
      visiMisiJudul: teks(sit.visiMisiJudul, "Visi & Misi"),
      visiMisiDeskripsi: teks(sit.visiMisiDeskripsi, ""),
      timJudul: teks(
        sit.timJudul,
        "Tenaga ahli yang bekerja di balik setiap proyek"
      ),
      timDeskripsi: teks(
        sit.timDeskripsi,
        "Dari struktur, jalan, jembatan, hingga sumber daya air — setiap penugasan dipegang oleh profesional yang berpengalaman di lapangan."
      ),
    },
  }
}
