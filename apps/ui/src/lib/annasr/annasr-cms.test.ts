import { beforeEach, describe, expect, it, vi } from "vitest"

/**
 * Audit "CMS → frontend, bukan fallback" untuk lapisan data.
 *
 * Untuk setiap content-type compro (beranda/tentang/layanan/portfolio/klien/
 * karir/kontak/artikel/situs/rekanan) kita pastikan: ketika Strapi mengirim
 * nilai, frontend MENGAMBIL nilai CMS tersebut — bukan data statis fallback
 * (`apps/ui/src/data/perusahaan.ts` / konstanta DEFAULT).
 *
 * Strategi anti-fallback: semua nilai CMS diberi prefiks "QA-" yang TIDAK ADA
 * di data statis. Kalau hasilnya sama dengan nilai CMS → terbukti bukan fallback.
 * Kalau ada satu field pun yang memakai fallback, assertion berikutnya gagal.
 */

const mocks = vi.hoisted(() => ({
  fetchOne: vi.fn(),
  fetchMany: vi.fn(),
  logNonBlockingError: vi.fn(),
  payloads: {} as Record<string, unknown>,
  rekanan: [] as unknown[],
}))

vi.mock("server-only", () => ({}))
vi.mock("@/lib/logging", () => ({
  logNonBlockingError: mocks.logNonBlockingError,
}))
vi.mock("@/lib/strapi-api", () => ({
  PublicStrapiClient: {
    fetchOne: mocks.fetchOne,
    fetchMany: mocks.fetchMany,
  },
}))

import { fetchBeranda } from "./beranda"
import { fetchKontenSitus } from "./konten"
import { fetchRekanan } from "./rekanan"

const STRAPI_URL = "https://cms.test"

beforeEach(() => {
  process.env.STRAPI_URL = STRAPI_URL
  mocks.fetchOne.mockReset()
  mocks.fetchMany.mockReset()
  mocks.fetchOne.mockImplementation(async (uid: string) => ({
    data: mocks.payloads[uid] ?? null,
  }))
  mocks.fetchMany.mockImplementation(async () => ({ data: mocks.rekanan }))
})

describe("beranda (fetchBeranda)", () => {
  const CMS = {
    hero: {
      judul: "QA hero judul",
      deskripsi: "QA hero deskripsi",
      keunggulan: ["QA-ke1", "QA-ke2"],
    },
    statistik: [{ nilai: "QA99", label: "QA stat label" }],
    founder: {
      nama: "QA nama founder",
      jabatan: "QA jabatan founder",
      teks: "QA teks founder",
    },
    layanan: [
      {
        judul: "QA layanan 1",
        ringkas: "QA ringkas 1",
        gambar: { url: "/uploads/qa-layanan-1.jpg" },
      },
    ],
    portfolio: [
      {
        nama: "QA proyek 1",
        lokasi: "QA lokasi proyek",
        kategori: "QA kategori",
        gambar: { url: "/uploads/qa-proyek-1.jpg" },
      },
    ],
    klien: [{ nama: "QA klien 1", logo: { url: "/uploads/qa-logo-1.jpg" } }],
    kotaProyek: [{ nama: "QA kota", lat: 1.5, lng: 2.5 }],
    faq: [{ tanya: "QA tanya", jawab: "QA jawab" }],
    cta: { judul: "QA cta judul", deskripsi: "QA cta deskripsi" },
  }

  it("mengambil SEMUA nilai CMS (bukan fallback) ketika CMS lengkap", async () => {
    mocks.payloads["api::beranda.beranda"] = CMS

    const r = await fetchBeranda("en")

    expect(r.hero).toEqual({
      judul: "QA hero judul",
      deskripsi: "QA hero deskripsi",
      keunggulan: ["QA-ke1", "QA-ke2"],
    })
    expect(r.statistik).toEqual([{ nilai: "QA99", label: "QA stat label" }])
    expect(r.founder).toEqual({
      nama: "QA nama founder",
      jabatan: "QA jabatan founder",
      teks: "QA teks founder",
    })
    expect(r.layanan[0]).toEqual({
      judul: "QA layanan 1",
      ringkas: "QA ringkas 1",
      gambar: `${STRAPI_URL}/uploads/qa-layanan-1.jpg`,
    })
    expect(r.portfolio[0]).toEqual({
      nama: "QA proyek 1",
      lokasi: "QA lokasi proyek",
      kategori: "QA kategori",
      gambar: `${STRAPI_URL}/uploads/qa-proyek-1.jpg`,
    })
    expect(r.klien[0]).toEqual({
      nama: "QA klien 1",
      logo: `${STRAPI_URL}/uploads/qa-logo-1.jpg`,
    })
    expect(r.kotaProyek[0]).toEqual({ nama: "QA kota", lat: 1.5, lng: 2.5 })
    expect(r.faq).toEqual([{ tanya: "QA tanya", jawab: "QA jawab" }])
    expect(r.cta).toEqual({
      judul: "QA cta judul",
      deskripsi: "QA cta deskripsi",
    })
  })

  it("memakai fallback statis hanya bila CMS kosong/tidak ada data", async () => {
    mocks.payloads["api::beranda.beranda"] = null

    const r = await fetchBeranda("en")

    expect(r.hero?.judul).toMatch(/Tepat Merencanakan/)
    expect(r.statistik.length).toBeGreaterThan(0)
    expect(r.faq.length).toBeGreaterThan(0)
  })
})

describe("konten situs (fetchKontenSitus) — tanpa terkecuali per field", () => {
  const CMS = {
    "api::tentang.tentang": {
      hero: {
        judul: "QA t hero",
        deskripsi: "QA t deskripsi",
        keunggulan: ["QA-t-ke"],
      },
      statistik: [{ nilai: "QA1", label: "QA stat" }],
      founder: {
        nama: "QA f nama",
        jabatan: "QA f jabatan",
        teks: "QA f teks",
        kutipan: "QA f kutipan",
      },
      perjalanan: [
        { tahun: "QA2014", judul: "QA jalan judul", teks: "QA jalan teks" },
      ],
      visiMisi: [{ judul: "QA visi", teks: "QA visi teks" }],
      tim: [
        {
          nama: "QA tim",
          jabatan: "QA tim jabatan",
          foto: { url: "/uploads/qa-foto.jpg" },
          linkedin: "https://linkedin.com/qa",
        },
      ],
      alasan: [{ judul: "QA alasan", teks: "QA alasan teks" }],
      jangkauanJudul: "QA jangkauan judul",
      jangkauanDeskripsi: "QA jangkauan deskripsi",
      kotaProyek: [{ nama: "QA kota2", lat: -3, lng: 4 }],
    },
    "api::layanan.layanan": {
      introJudul: "QA intro judul",
      introDeskripsi: "QA intro deskripsi",
      layanan: [
        {
          slug: "qa-layanan",
          judul: "QA layanan n",
          ringkas: "QA ringkas",
          deskripsi: "QA deskripsi",
          detail: ["QA detail"],
          manfaat: ["QA manfaat"],
          gambar: { url: "/uploads/qa-lay.jpg" },
          galeri: [
            { url: "/uploads/qa-gal-1.jpg" },
            { url: "/uploads/qa-gal-2.jpg" },
          ],
          alur: [{ judul: "QA alur", teks: "QA alur teks" }],
          persyaratan: [
            {
              judul: "QA persyaratan",
              deskripsi: "QA p deskripsi",
              daftar: ["QA p daftar"],
            },
          ],
          dokumenClient: {
            judul: "QA dc judul",
            deskripsi: "QA dc deskripsi",
            gambar: { url: "/uploads/qa-dc.jpg" },
            daftar: ["QA dc daftar"],
          },
        },
      ],
      proses: [{ judul: "QA proses", teks: "QA proses teks" }],
    },
    "api::portfolio.portfolio": {
      heroJudul: "QA portfolio hero",
      heroDeskripsi: "QA portfolio deskripsi",
      proyek: [
        {
          nama: "QA p nama",
          instansi: "QA p instansi",
          lokasi: "QA p lokasi",
          kategori: "QA p kategori",
          gambar: { url: "/uploads/qa-p.jpg" },
        },
      ],
    },
    "api::klien.klien": {
      heroJudul: "QA klien hero",
      heroDeskripsi: "QA klien deskripsi",
      klien: [{ nama: "QA klien-satu" }],
    },
    "api::karir.karir": {
      heroJudul: "QA karir hero",
      heroDeskripsi: "QA karir deskripsi",
      posisi: [
        {
          nama: "QA posisi",
          tipe: "QA tipe",
          lokasi: "QA lokasi",
          slug: "qa-posisi",
          status: "terbuka",
          ringkas: "QA ringkas",
          deskripsi: "QA deskripsi",
          tanggungJawab: [{ teks: "QA tj" }],
          kualifikasi: [{ teks: "QA kual" }],
          manfaat: [{ teks: "QA manf" }],
        },
      ],
    },
    "api::kontak.kontak": {
      heroJudul: "QA kontak hero",
      heroDeskripsi: "QA kontak deskripsi",
      domisili: "QA domisili",
      kantor: "QA kantor",
      telepon: "QA telepon",
      email: "QA email",
      jamOperasional: "QA jam",
      instagram: "QA ig",
      whatsapp: "QA wa",
    },
    "api::artikel.artikel": {
      heroJudul: "QA artikel hero",
      heroDeskripsi: "QA artikel deskripsi",
      artikel: [
        {
          slug: "qa-artikel",
          judul: "QA artikel judul",
          ringkas: "QA artikel ringkas",
          tanggal: "QA tanggal",
          kategori: "QA kategori",
          penulis: "QA penulis",
          gambar: { url: "/uploads/qa-artikel.jpg" },
          isi: ["QA isi"],
        },
      ],
    },
    "api::situs.situs": {
      brandNama: "QA brand",
      brandTagline: "QA tagline",
      navigasi: [
        {
          label: "QA nav",
          href: "/qa",
          anak: [
            { label: "QA anak", href: "/qa/1", deskripsi: "QA deskripsi anak" },
          ],
        },
      ],
    },
  }

  beforeEach(() => {
    mocks.payloads = { ...CMS }
  })

  it("tentang: hero/statistik/founder/riwayat/visi/tim/alasan/jangkauan/kota dari CMS", async () => {
    const r = (await fetchKontenSitus("en")).tentang

    expect(r.hero).toEqual({
      judul: "QA t hero",
      deskripsi: "QA t deskripsi",
      keunggulan: ["QA-t-ke"],
    })
    expect(r.statistik).toEqual([{ nilai: "QA1", label: "QA stat" }])
    expect(r.founder).toEqual({
      nama: "QA f nama",
      jabatan: "QA f jabatan",
      teks: "QA f teks",
      kutipan: "QA f kutipan",
    })
    expect(r.perjalanan).toEqual([
      { tahun: "QA2014", judul: "QA jalan judul", teks: "QA jalan teks" },
    ])
    expect(r.visiMisi).toEqual([{ judul: "QA visi", teks: "QA visi teks" }])
    expect(r.tim).toEqual([
      {
        nama: "QA tim",
        jabatan: "QA tim jabatan",
        foto: `${STRAPI_URL}/uploads/qa-foto.jpg`,
        linkedin: "https://linkedin.com/qa",
      },
    ])
    expect(r.alasan).toEqual([{ judul: "QA alasan", teks: "QA alasan teks" }])
    expect(r.jangkauanJudul).toBe("QA jangkauan judul")
    expect(r.jangkauanDeskripsi).toBe("QA jangkauan deskripsi")
    expect(r.kotaProyek).toEqual([{ nama: "QA kota2", lat: -3, lng: 4 }])
  })

  it("layanan: intro/layanan/detail/manfaat/galeri/alur/persyaratan/dokumen client/proses dari CMS", async () => {
    const r = await fetchKontenSitus("en")

    expect(r.layananIntro).toEqual({
      judul: "QA intro judul",
      deskripsi: "QA intro deskripsi",
    })
    const l = r.layanan[0]
    if (!l) throw new Error("seharusnya ada data layanan dari CMS")

    expect(l.slug).toBe("qa-layanan")
    expect(l.nama).toBe("QA layanan n")
    expect(l.alt).toBe("QA layanan n")
    expect(l.ringkas).toBe("QA ringkas")
    expect(l.detail).toEqual(["QA detail"])
    expect(l.manfaat).toEqual(["QA manfaat"])
    expect(l.gambar).toBe(`${STRAPI_URL}/uploads/qa-lay.jpg`)
    expect(l.galeri.map((g) => g.src)).toEqual([
      `${STRAPI_URL}/uploads/qa-gal-1.jpg`,
      `${STRAPI_URL}/uploads/qa-gal-2.jpg`,
    ])
    expect(l.alur).toEqual([{ judul: "QA alur", teks: "QA alur teks" }])
    expect(l.persyaratan).toEqual([
      {
        judul: "QA persyaratan",
        deskripsi: "QA p deskripsi",
        daftar: ["QA p daftar"],
      },
    ])
    expect(l.dokumenClient?.judul).toBe("QA dc judul")
    expect(l.dokumenClient?.gambar).toBe(`${STRAPI_URL}/uploads/qa-dc.jpg`)
    expect(l.dokumenClient?.daftar).toEqual(["QA dc daftar"])
    expect(r.proses).toEqual([{ judul: "QA proses", teks: "QA proses teks" }])
  })

  it("portfolio + hero dari CMS", async () => {
    const r = (await fetchKontenSitus("en")).portfolio

    expect(r).toEqual([
      {
        nama: "QA p nama",
        instansi: "QA p instansi",
        lokasi: "QA p lokasi",
        kategori: "QA p kategori",
        gambar: `${STRAPI_URL}/uploads/qa-p.jpg`,
      },
    ])
    expect((await fetchKontenSitus("en")).portfolioHero).toEqual({
      judul: "QA portfolio hero",
      deskripsi: "QA portfolio deskripsi",
    })
  })

  it("klien + hero dari CMS", async () => {
    const r = await fetchKontenSitus("en")

    expect(r.klien).toEqual(["QA klien-satu"])
    expect(r.klienHero).toEqual({
      judul: "QA klien hero",
      deskripsi: "QA klien deskripsi",
    })
  })

  it("karir: posisi + hero dari CMS", async () => {
    const r = await fetchKontenSitus("en")

    expect(r.karirHero).toEqual({
      judul: "QA karir hero",
      deskripsi: "QA karir deskripsi",
    })
    expect(r.karir[0]).toMatchObject({
      nama: "QA posisi",
      tipe: "QA tipe",
      lokasi: "QA lokasi",
      slug: "qa-posisi",
      status: "terbuka",
      ringkas: "QA ringkas",
      deskripsi: "QA deskripsi",
      tanggungJawab: ["QA tj"],
      kualifikasi: ["QA kual"],
      manfaat: ["QA manf"],
    })
  })

  it("kontak: hero + alamat/kontak dari CMS", async () => {
    const r = (await fetchKontenSitus("en")).kontak

    expect(r.judul).toBe("QA kontak hero")
    expect(r.deskripsi).toBe("QA kontak deskripsi")
    expect(r.domisili).toBe("QA domisili")
    expect(r.kantor).toBe("QA kantor")
    expect(r.telepon).toBe("QA telepon")
    expect(r.email).toBe("QA email")
    expect(r.jamOperasional).toBe("QA jam")
    expect(r.instagram).toBe("QA ig")
    expect(r.whatsapp).toBe("QA wa")
  })

  it("artikel: daftar + hero dari CMS", async () => {
    const r = await fetchKontenSitus("en")

    expect(r.artikelHero).toEqual({
      judul: "QA artikel hero",
      deskripsi: "QA artikel deskripsi",
    })
    expect(r.artikel[0]).toMatchObject({
      slug: "qa-artikel",
      judul: "QA artikel judul",
      ringkas: "QA artikel ringkas",
      tanggal: "QA tanggal",
      kategori: "QA kategori",
      penulis: "QA penulis",
      gambar: `${STRAPI_URL}/uploads/qa-artikel.jpg`,
      isi: ["QA isi"],
    })
  })

  it("situs: brand + navigasi (termasuk submenu) dari CMS", async () => {
    const r = (await fetchKontenSitus("en")).situs

    expect(r.brandNama).toBe("QA brand")
    expect(r.brandTagline).toBe("QA tagline")
    expect(r.navigasi).toEqual([
      {
        label: "QA nav",
        href: "/qa",
        anak: [
          { label: "QA anak", href: "/qa/1", deskripsi: "QA deskripsi anak" },
        ],
      },
    ])
  })

  it("fallback statis hanya dipakai bila CMS kosong", async () => {
    mocks.payloads = {}

    const r = await fetchKontenSitus("en")

    expect(r.tentang.hero.judul).toMatch(/Mitra teknik/)
    expect(r.klien.length).toBeGreaterThan(0)
    expect(r.situs.brandNama).toBe("CV. An Nasr Konsultan")
    expect(r.portfolio.length).toBeGreaterThan(0)
  })
})

describe("rekanan (fetchRekanan)", () => {
  it("daftar rekanan + sertifikat dari CMS", async () => {
    mocks.rekanan = [
      {
        nama: "QA rekanan",
        instansi: "QA instansi",
        keterangan: "QA keterangan",
        sertifikat: [
          { url: "/uploads/qa-sertifikat.jpg", alternativeText: "QA alt" },
        ],
      },
    ]

    const r = await fetchRekanan("en")

    expect(r).toEqual([
      {
        nama: "QA rekanan",
        instansi: "QA instansi",
        keterangan: "QA keterangan",
        gambar: `${STRAPI_URL}/uploads/qa-sertifikat.jpg`,
        alt: "QA alt",
      },
    ])
  })

  it("tanpa data → array kosong (bukan fallback)", async () => {
    mocks.rekanan = []

    const r = await fetchRekanan("en")

    expect(r).toEqual([])
  })
})
