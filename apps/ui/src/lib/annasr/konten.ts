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
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

const uid = (nama: string) => `api::${nama}.${nama}` as UID.ContentType

const IKON_LAYANAN: LucideIcon[] = [
  Building2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
]

export const slugify = (teks: string) =>
  teks
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")

function teks(v: unknown, fb: string): string {
  return typeof v === "string" && v.trim() ? v : fb
}

function teksArr(v: unknown, fb: string[]): string[] {
  if (Array.isArray(v)) {
    const nilai = v.map((x) =>
      typeof x === "string"
        ? x
        : String((x as { value?: unknown })?.value ?? "")
    )

    return nilai.some(Boolean) ? nilai.filter(Boolean) : fb
  }

  return fb
}

function medUrl(v: undefined | { url?: unknown }, fb: string): string {
  const url = v?.url
  if (!url || typeof url !== "string") return fb
  if (url.startsWith("http")) return url
  // Hanya upload asli Strapi yang butuh prefix base. Path statis FE
  // (/images/…) tetap dipakai relatif — lebih cepat & tidak kena
  // blokir Next Image optimizer (SSRF private IP).
  if (!url.startsWith("/uploads/")) return url
  const base = process.env.STRAPI_URL?.replace(/\/$/, "")

  return base ? `${base}${url}` : url
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
      ikon: IKON_LAYANAN[i % IKON_LAYANAN.length] ?? Building2,
      ringkas: teks(l.ringkas, statis?.ringkas ?? ""),
      detail: (l.detail as string[])?.length
        ? (l.detail as string[])
        : (statis?.detail ?? []),
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
      manfaat: (l.manfaat as string[])?.length
        ? (l.manfaat as string[])
        : (statis?.manfaat ?? []),
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
    }
  })
}

export type KontenSitus = {
  beranda: BerandaKonten
  tentang: {
    hero: { judul: string; deskripsi: string; keunggulan: string[] }
    statistik: { nilai: string; label: string }[]
    founder: { nama: string; jabatan: string; teks: string; kutipan: string }
    perjalanan: { tahun: string; judul: string; teks: string }[]
    visiMisi: { judul: string; teks: string }[]
    tim: { nama: string; jabatan: string; foto?: string; linkedin?: string }[]
    alasan: { judul: string; teks: string }[]
    jangkauanJudul: string
    jangkauanDeskripsi: string
    kotaProyek: { nama: string; lat: number; lng: number }[]
  }
  layanan: ReturnType<typeof layananCms>
  layananIntro: { judul: string; deskripsi: string }
  proses: { judul: string; teks: string }[]
  portfolio: {
    nama: string
    lokasi: string
    kategori: string
    gambar: string
  }[]
  portfolioHero: { judul: string; deskripsi: string }
  klien: string[]
  klienHero: { judul: string; deskripsi: string }
  karir: { nama: string; tipe: string; lokasi: string; teks: string }[]
  karirHero: { judul: string; deskripsi: string }
  kontak: {
    judul: string
    deskripsi: string
    domisili: string
    kantor: string
    telepon: string
    email: string
    jamOperasional: string
  }
  artikel: ReturnType<typeof artikelCms>
  artikelHero: { judul: string; deskripsi: string }
  situs: {
    brandNama: string
    brandTagline: string
    navigasi: { label: string; href: string }[]
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
      isi: (a.isi as string[])?.length
        ? (a.isi as string[])
        : (statis?.isi ?? []),
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
  layanan: { layanan: "smart", proses: "smart" },
  portfolio: { proyek: "smart" },
  klien: { klien: "smart" },
  karir: { posisi: "smart" },
  kontak: {},
  artikel: { artikel: "smart" },
  situs: { navigasi: "smart" },
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
        next: { revalidate: 120, tags: [strapiCacheTag(uid(nama))] },
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

const fotoGb = (l: Record<string, unknown>) =>
  teks(
    medUrl(l.gambar as { url?: unknown }, ""),
    layanan[layanan.findIndex((x) => x.nama === teks(l.judul, ""))]?.gambar ??
      "/images/annasr/layanan-perencanaan.jpg"
  )

export async function fetchKontenSitus(locale: Locale): Promise<KontenSitus> {
  const [t, lay, por, kl, kar, kon, art, sit, home] = await Promise.all([
    ambil("tentang", locale),
    ambil("layanan", locale),
    ambil("portfolio", locale),
    ambil("klien", locale),
    ambil("karir", locale),
    ambil("kontak", locale),
    ambil("artikel", locale),
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
      },
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
    layanan: layananCms(
      (lay.layanan as Record<string, unknown>[]) ?? [],
      fotoGb
    ),
    layananIntro: {
      judul: teks(
        lay.introJudul,
        "Layanan An Nasr dalam Mendukung Proyek Anda"
      ),
      deskripsi: teks(lay.introDeskripsi, ""),
    },
    proses:
      Array.isArray(lay.proses) &&
      (lay.proses as Record<string, unknown>[]).length
        ? (lay.proses as { judul?: unknown; teks?: unknown }[]).map((p) => ({
            judul: teks(p.judul, ""),
            teks: teks(p.teks, ""),
          }))
        : [],
    portfolio:
      Array.isArray(por.proyek) &&
      (por.proyek as Record<string, unknown>[]).length
        ? (
            por.proyek as {
              nama?: unknown
              lokasi?: unknown
              kategori?: unknown
              gambar?: { url?: unknown }
            }[]
          ).map((p, i) => ({
            nama: teks(p.nama, portfolio[i]?.nama ?? `Proyek ${i + 1}`),
            lokasi: teks(p.lokasi, ""),
            kategori: teks(p.kategori, "Bangunan"),
            gambar: medUrl(p.gambar, portfolio[i]?.gambar ?? ""),
          }))
        : portfolio.map((p) => ({
            nama: p.nama,
            lokasi: p.lokasi,
            kategori: p.kategori,
            gambar: p.gambar,
          })),
    portfolioHero: {
      judul: teks(por.heroJudul, "Pekerjaan yang berbicara melalui hasilnya"),
      deskripsi: teks(por.heroDeskripsi, ""),
    },
    klien:
      Array.isArray(kl.klien) && (kl.klien as Record<string, unknown>[]).length
        ? (kl.klien as { nama?: unknown }[])
            .map((c) => teks(c.nama, ""))
            .filter(Boolean)
        : [...klien],
    klienHero: {
      judul: teks(kl.heroJudul, "Kepercayaan yang terjalin di banyak pintu"),
      deskripsi: teks(kl.heroDeskripsi, ""),
    },
    karir:
      Array.isArray(kar.posisi) &&
      (kar.posisi as Record<string, unknown>[]).length
        ? (
            kar.posisi as {
              nama?: unknown
              tipe?: unknown
              lokasi?: unknown
              teks?: unknown
            }[]
          ).map((p) => ({
            nama: teks(p.nama, "Posisi"),
            tipe: teks(p.tipe, "Penuh Waktu"),
            lokasi: teks(p.lokasi, "Jombang"),
            teks: teks(p.teks, ""),
          }))
        : [],
    karirHero: {
      judul: teks(kar.heroJudul, "Tumbuh bersama tim teknik kami"),
      deskripsi: teks(kar.heroDeskripsi, ""),
    },
    kontak: {
      judul: teks(kon.heroJudul, "Mari bicarakan rencana proyek Anda"),
      deskripsi: teks(kon.heroDeskripsi, ""),
      domisili: teks(kon.domisili, perusahaan.domisili),
      kantor: teks(kon.kantor, perusahaan.kantor),
      telepon: teks(kon.telepon, perusahaan.telepon),
      email: teks(kon.email, perusahaan.email),
      jamOperasional: teks(kon.jamOperasional, perusahaan.jamOperasional),
    },
    artikel: artikelCms((art.artikel as Record<string, unknown>[]) ?? []),
    artikelHero: {
      judul: teks(art.heroJudul, "Wawasan Teknik & Konstruksi"),
      deskripsi: teks(art.heroDeskripsi, ""),
    },
    situs: {
      brandNama: teks(sit.brandNama, "CV. An Nasr Konsultan"),
      brandTagline: teks(sit.brandTagline, "Konsultan Teknik & Konstruksi"),
      navigasi:
        Array.isArray(sit.navigasi) &&
        (sit.navigasi as Record<string, unknown>[]).length
          ? (sit.navigasi as { label?: unknown; href?: unknown }[]).map(
              (n) => ({
                label: teks(n.label, ""),
                href: teks(n.href, "/"),
              })
            )
          : [
              { label: "Beranda", href: "/" },
              { label: "Layanan", href: "/layanan" },
              { label: "Proyek", href: "/portfolio" },
              { label: "Tentang Kami", href: "/tentang" },
              { label: "Artikel", href: "/artikel" },
              { label: "Karir", href: "/karir" },
              { label: "Kontak", href: "/kontak" },
            ],
    },
  }
}
