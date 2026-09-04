import type { Core } from "@strapi/strapi"

/**
 * Seed awal konten An Nasr bila entry belum ada. Idempotent: lewati bila tipe
 * sudah punya entry. Dipicu env RUN_ANNASR_SEED=true saat bootstrap.
 * (Gambar/media sengaja dikosongkan — FE memakai fallback gambar statis.)
 */

type Dok = Record<string, unknown>

function santinain(v: unknown): unknown {
  return v
}

async function seedTunggal(strapi: Core.Strapi, uid: string, data: Dok) {
  const dok = strapi.documents(uid as never)
  const ada = await dok.findFirst({})
  if (ada) return
  await dok.create({
    data: santinain(data) as Dok,
    status: "published",
  } as never)
}

/** Seed koleksi rekanan — hanya bila tabel masih kosong (idempotent). */
/**
 * Perbarui CT Navbar & Footer (milik starter) dengan konten An Nasr bila
 * masih berisi data demo — sehingga kolom "Navbar"/"Footer" di admin
 * makesense dan UI yang membaca CT ini ikut tampil benar.
 */
async function seedNavbarFooter(strapi: Core.Strapi) {
  const nav = strapi.documents("api::navbar.navbar" as never)
  const foot = strapi.documents("api::footer.footer" as never)

  const navbarAda = await nav.findFirst({
    locale: "en",
    populate: { navbarItems: { populate: { link: true } } },
  } as never)

  const navbarStarter =
    navbarAda == null ||
    (navbarAda as { navbarItems?: { link?: { label?: string } }[] })
      .navbarItems?.[0]?.link?.label !== "Beranda"

  if (navbarStarter) {
    const data = {
      navbarItems: NAV_WEB.map((n) => ({
        isCategoryLink: true,
        link: {
          type: "external" as const,
          label: n.label,
          newTab: false,
          href: n.href,
        },
        categoryItems: [],
      })),
    }
    if (navbarAda != null) {
      await nav.update({
        documentId: (navbarAda as { documentId: string }).documentId,
        locale: "en",
        data: data as never,
      } as never)
    } else {
      await nav.create({ data: data as never } as never)
    }
  }

  const footerAda = await foot.findFirst({
    locale: "en",
    populate: { sections: { populate: { links: true } } },
  } as never)

  const footerStarter =
    footerAda == null ||
    (footerAda as { sections?: { title?: string }[] }).sections?.[0]?.title !==
      "Menu"

  if (footerStarter) {
    const data = {
      sections: FOOTER_SECTIONS,
      copyRight: FOOTER_COPYRIGHT,
    }
    if (footerAda != null) {
      await foot.update({
        documentId: (footerAda as { documentId: string }).documentId,
        locale: "en",
        data: data as never,
      } as never)
    } else {
      await foot.create({ data: data as never } as never)
    }
  }
}

async function seedKoleksiRekanan(strapi: Core.Strapi) {
  const dok = strapi.documents("api::rekanan.rekanan" as never)
  const ada = await dok.findFirst({})
  if (ada) return
  for (const item of REKANAN) {
    await dok.create({
      data: item as unknown as Dok,
      status: "published",
    } as never)
  }
}

const LAYANAN = [
  {
    slug: "perencanaan",
    judul: "Jasa Perencanaan",
    ringkas:
      "Perencanaan teknis dan penyusunan desain yang matang, terukur, dan sesuai standar teknis yang berlaku.",
    deskripsi:
      "Layanan perencanaan mencakup survey awal, perhitungan struktur, gambar kerja, RKS, dan RAB sesuai SNI.",
    detail: [
      "Perencanaan Bangunan Gedung",
      "Perencanaan Jalan",
      "Perencanaan Jembatan",
      "Perencanaan Sumber Daya Air",
    ],
    manfaat: [
      "Anggaran terukur sejak awal",
      "Gambar kerja siap pakai",
      "Desain sesuai SNI",
    ],
  },
  {
    slug: "pengawasan",
    judul: "Jasa Pengawasan",
    ringkas:
      "Pengendalian mutu, biaya, dan waktu pelaksanaan melalui pengawasan lapangan yang disiplin.",
    deskripsi:
      "Pengawas memeriksa mutu bahan, volume, dan kesesuaian pelaksanaan dengan gambar, serta melaporkan progres berkala.",
    detail: [
      "Pengawasan Bangunan Gedung",
      "Pengawasan Jalan",
      "Pengawasan Jembatan",
      "Pengawasan Irigasi",
    ],
    manfaat: [
      "Mutu terkontrol tiap tahap",
      "Progres terdokumentasi",
      "Pembayaran termin sesuai realisasi",
    ],
  },
  {
    slug: "perizinan",
    judul: "Jasa Perizinan",
    ringkas:
      "Pendampingan penuh pengurusan dokumen perizinan bangunan agar proyek legal dan siap difungsikan.",
    deskripsi:
      "Pengurusan PBG dan SLF didampingi dari penyiapan berkas teknis hingga dokumen terbit.",
    detail: [
      "Persetujuan Bangunan Gedung (PBG)",
      "Sertifikat Laik Fungsi (SLF)",
    ],
    manfaat: [
      "Bangunan legal",
      "Berkas lengkap",
      "Proses terpantau sampai terbit",
    ],
  },
  {
    slug: "konstruksi",
    judul: "Jasa Konstruksi",
    ringkas:
      "Pelaksanaan konstruksi bangunan dan infrastruktur dengan metode kerja yang aman dan efisien.",
    deskripsi:
      "Tim lapangan berpengalaman, jadwal realistis, dan material sesuai spesifikasi hingga serah terima.",
    detail: [
      "Pembangunan Rumah",
      "Renovasi Rumah",
      "Gedung",
      "Jalan Aspal & Beton",
      "Jembatan",
    ],
    manfaat: [
      "Satu koordinasi desain-konstruksi",
      "Jadwal terkendali",
      "Material sesuai spesifikasi",
    ],
  },
]

const ARTIKEL = [
  {
    slug: "memahami-pbg-dan-slf",
    judul: "Memahami PBG dan SLF: Dua Dokumen Wajib Bangunan Anda",
    ringkas:
      "Persetujuan Bangunan Gedung diurus sebelum membangun, Sertifikat Laik Fungsi setelah bangunan berdiri.",
    tanggal: "12 Agustus 2026",
    kategori: "Perizinan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    isi: [
      "Setiap bangunan wajib memiliki PBG sebelum dibangun dan SLF sebelum difungsikan.",
      "Kami mendampingi pengurusan dari berkas teknis hingga dokumen terbit.",
    ],
  },
  {
    slug: "menyusun-rab-yang-realistis",
    judul: "Menyusun RAB yang Realistis agar Proyek Tidak Membengkak",
    ringkas:
      "RAB lahir dari volume terukur dan analisa harga satuan yang jujur.",
    tanggal: "29 Juli 2026",
    kategori: "Perencanaan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    isi: [
      "RAB yang baik tidak sekadar daftar harga, tetapi acuan pelaksanaan.",
      "Kami menyusun berdasarkan gambar rencana dan harga pasar wilayah proyek.",
    ],
  },
  {
    slug: "peran-pengawas-lapangan",
    judul: "Peran Pengawas Lapangan dalam Menjaga Mutu Pekerjaan",
    ringkas: "Pengawas adalah mata dan telinga pemberi tugas di lapangan.",
    tanggal: "10 Juli 2026",
    kategori: "Pengawasan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    isi: [
      "Kualitas proyek ditentukan di lapangan, bukan di meja rapat.",
      "Pengawasan kami mencakup mutu bahan, volume, dan dokumentasi berkala.",
    ],
  },
  {
    slug: "memilih-struktur-jalan-desa",
    judul: "Jalan Beton atau Jalan Aspal untuk Ruas Desa?",
    ringkas:
      "Pemilihan perkerasan bergantung pada beban, tanah dasar, dan pemeliharaan.",
    tanggal: "24 Juni 2026",
    kategori: "Konstruksi",
    penulis: "Tim CV. AN NASR KONSULTAN",
    isi: [
      "Beton unggul untuk beban berat dan genangan; aspal lebih cepat dan murah awal.",
      "Kami menghitung biaya siklus hidup sebelum merekomendasikan.",
    ],
  },
]

const KOTA = [
  { nama: "Jombang", lat: -7.5454, lng: 112.2424 },
  { nama: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { nama: "Malang", lat: -7.9777, lng: 112.6304 },
  { nama: "Semarang", lat: -6.9667, lng: 110.4167 },
  { nama: "Bandung", lat: -6.9175, lng: 107.6191 },
  { nama: "Balikpapan", lat: -1.2379, lng: 116.8529 },
  { nama: "Makassar", lat: -5.1477, lng: 119.4327 },
  { nama: "Denpasar", lat: -8.6705, lng: 115.2126 },
]

const KLIEN = [
  "Pemkab Jombang",
  "Dinas PUPR",
  "Desa Bedahlawak",
  "Yayasan Al Hikmah",
  "Ponpes Darul Ulum",
  "CV. Mitra Karya",
  "PT. Sarana Bangun",
  "RSU Amanah",
  "BUMDes Makmur",
  "PDAM Jombang",
]
/** Menu website An Nasr (kanonik) — item punya submenu (anak) bila bergrup. */
const NAV_MENU = [
  { label: "Beranda", href: "/" },
  {
    label: "Layanan",
    href: "/layanan",
    anak: [
      {
        label: "Jasa Perencanaan",
        href: "/layanan/perencanaan",
        deskripsi: "Desain, struktur, gambar kerja, RAB sesuai SNI.",
      },
      {
        label: "Jasa Pengawasan",
        href: "/layanan/pengawasan",
        deskripsi: "Pengendalian mutu, biaya, dan waktu pelaksanaan.",
      },
      {
        label: "Jasa Perizinan",
        href: "/layanan/perizinan",
        deskripsi: "Pendampingan PBG & SLF sampai dokumen terbit.",
      },
      {
        label: "Jasa Konstruksi",
        href: "/layanan/konstruksi",
        deskripsi:
          "Pelaksanaan bangunan & infrastruktur tepat mutu, biaya, waktu.",
      },
    ],
  },
  { label: "Proyek", href: "/portfolio" },
  {
    label: "Profil",
    href: "/tentang",
    anak: [
      {
        label: "Tentang Kami",
        href: "/tentang",
        deskripsi: "Perjalanan, visi, dan tim kami.",
      },
      {
        label: "Rekanan",
        href: "/rekanan",
        deskripsi: "Sertifikat kerjasama & katalog rekanan.",
      },
      {
        label: "Artikel",
        href: "/artikel",
        deskripsi: "Wawasan teknik & konstruksi dari lapangan.",
      },
      {
        label: "Karir",
        href: "/karir",
        deskripsi: "Bergabunglah bersama tim teknik kami.",
      },
    ],
  },
  { label: "Kontak", href: "/kontak" },
]

/** Perbarui navigasi situs dari menu kanonik (idempotent per nilai, ganti total). */
/**
 * Reset karir (single) supaya posisi dengan field baru (slug/status/dll)
 * ikut tersimpan — delete+create agar published & draft seragam.
 */
async function seedKarir(strapi: Core.Strapi) {
  const dok = strapi.documents("api::karir.karir" as never)
  const ada = (await dok.findFirst({})) as null | {
    documentId?: string
    heroJudul?: string
    heroDeskripsi?: string
  }
  if (!ada?.documentId) return
  await dok.delete({ documentId: ada.documentId } as never)
  await dok.create({
    status: "published",
    data: {
      heroJudul: ada.heroJudul ?? "Tumbuh bersama tim teknik kami",
      heroDeskripsi:
        ada.heroDeskripsi ??
        "Kami mencari orang yang teliti, disiplin, dan senang belajar.",
      posisi: [
        {
          nama: "Drafter Teknik Sipil",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "terbuka",
          slug: "drafter-teknik-sipil",
          ringkas:
            "Menyusun gambar kerja bangunan, jalan, dan jembatan dari konsep hingga siap konstruksi.",
          deskripsi:
            "Bergabung dengan tim perencanaan kami untuk menerjemahkan konsep desain menjadi gambar kerja yang akurat, lengkap, dan sesuai standar SNI.",
          tanggungJawab: [
            { teks: "Membuat gambar arsitektur dan struktur bangunan." },
            { teks: "Menyusun detail, RAB pendukung, dan bestek." },
            { teks: "Revisi gambar berdasarkan hasil koordinasi lapangan." },
          ],
          kualifikasi: [
            { teks: "D1-D3 Teknik Sipil / Arsitektur." },
            { teks: "Mahir AutoCAD; SketchUp nilai plus." },
            { teks: "Teliti, rapi, dan disiplin tenggat." },
          ],
          manfaat: [
            { teks: "Gaji kompetitif." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
            { teks: "Lingkungan tim yang suportif." },
          ],
        },
        {
          nama: "Pengawas Lapangan",
          tipe: "Penuh Waktu",
          lokasi: "Jombang & sekitarnya",
          status: "terbuka",
          slug: "pengawas-lapangan",
          ringkas:
            "Mengawasi mutu, volume, dan progres pekerjaan di lapangan sesuai gambar dan spesifikasi.",
          deskripsi:
            "Kami mencari pengawas yang teliti untuk memastikan setiap tahap pelaksanaan berjalan tepat mutu, biaya, dan waktu.",
          tanggungJawab: [
            { teks: "Memeriksa mutu bahan dan volume pekerjaan." },
            { teks: "Menilai kesesuaian pelaksanaan dengan gambar kerja." },
            { teks: "Menyusun laporan harian dan mingguan." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Teknik Sipil; pengalaman lapangan nilai plus." },
            { teks: "Menguasai spesifikasi teknis dan metode kerja." },
          ],
          manfaat: [
            { teks: "Tunjangan transport & makan lapangan." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
          ],
        },
        {
          nama: "Estimator / Quantity Surveyor",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "terbuka",
          slug: "estimator-quantity-surveyor",
          ringkas: "Menyusun RAB, analisa harga satuan, dan Bill of Quantity.",
          deskripsi:
            "Bersama tim kami, Anda menyusun estimasi biaya yang akurat dan menjadi dasar keputusan proyek.",
          tanggungJawab: [
            { teks: "Penyusunan RAB dan analisa harga satuan." },
            { teks: "Membuat Bill of Quantity dari gambar kerja." },
            { teks: "Evaluasi penawaran dan progress payment." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Teknik Sipil atau Ekonomi Teknik." },
            { teks: "Mahir spreadsheet & software estimasi." },
          ],
          manfaat: [
            { teks: "Insentif proyek." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
          ],
        },
        {
          nama: "Administrasi Proyek",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "ditutup",
          slug: "administrasi-proyek",
          ringkas: "Mengelola dokumen kontrak, laporan, dan perizinan proyek.",
          deskripsi:
            "Lowongan ini sementara ditutup. Pantau terus website kami untuk pembukaan kembali.",
          tanggungJawab: [
            { teks: "Mengelola dokumen kontrak dan laporan." },
            { teks: "Koordinasi perizinan proyek." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Administrasi atau Manajemen." },
            { teks: "Mahir Microsoft Office." },
          ],
          manfaat: [{ teks: "BPJS Ketenagakerjaan & Kesehatan." }],
        },
      ] as unknown as Dok,
    } as never,
  } as never)
}

async function seedMenuSitus(strapi: Core.Strapi) {
  const dok = strapi.documents("api::situs.situs" as never)
  const ada = (await dok.findFirst({})) as null | {
    documentId?: string
    brandNama?: string
    brandTagline?: string
    deskripsiLabel?: string
  }
  if (!ada?.documentId) return

  // Reset dokumen situs supaya versi published & draft sama (update biasa
  // hanya menyentuh draft, API published tidak berubah).
  await dok.delete({ documentId: ada.documentId } as never)
  await dok.create({
    status: "published",
    data: {
      brandNama: ada.brandNama ?? "CV. An Nasr Konsultan",
      brandTagline: ada.brandTagline ?? "Konsultan Teknik & Konstruksi",
      deskripsiLabel: ada.deskripsiLabel ?? "",
      navigasi: NAV_MENU as unknown as Dok,
    } as never,
  } as never)
}

const NAV_WEB = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/layanan" },
  { label: "Proyek", href: "/portfolio" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Rekanan", href: "/rekanan" },
  { label: "Artikel", href: "/artikel" },
  { label: "Karir", href: "/karir" },
  { label: "Kontak", href: "/kontak" },
]

const FOOTER_SECTIONS = [
  {
    title: "Menu",
    links: NAV_WEB.map((n) => ({
      type: "external",
      label: n.label,
      newTab: false,
      href: n.href,
    })),
  },
  {
    title: "Layanan",
    links: [
      {
        type: "external",
        label: "Jasa Perencanaan",
        newTab: false,
        href: "/layanan/perencanaan",
      },
      {
        type: "external",
        label: "Jasa Pengawasan",
        newTab: false,
        href: "/layanan/pengawasan",
      },
      {
        type: "external",
        label: "Jasa Perizinan",
        newTab: false,
        href: "/layanan/perizinan",
      },
      {
        type: "external",
        label: "Jasa Konstruksi",
        newTab: false,
        href: "/layanan/konstruksi",
      },
    ],
  },
  {
    title: "Kontak",
    links: [
      {
        type: "external",
        label: "+62 812-0000-0000",
        newTab: false,
        href: "tel:+6281200000000",
      },
      {
        type: "external",
        label: "annasrkonsultan@email.com",
        newTab: false,
        href: "mailto:annasrkonsultan@email.com",
      },
      {
        type: "external",
        label: "Jombang, Jawa Timur",
        newTab: false,
        href: "https://www.google.com/maps/search/Jombang%2C+Jawa+Timur",
      },
    ],
  },
]

const TAHUN_SEKARANG = new Date()
const FOOTER_COPYRIGHT =
  "© " +
  TAHUN_SEKARANG.getFullYear() +
  " CV. AN NASR KONSULTAN. Seluruh hak cipta dilindungi."

const REKANAN: { nama: string; instansi: string; keterangan: string }[] = [
  {
    nama: "Pemerintah Kabupaten Jombang",
    instansi: "Pemerintah Daerah",
    keterangan: "Kerja sama perencanaan dan pengawasan infrastruktur daerah.",
  },
  {
    nama: "Dinas PUPR Jombang",
    instansi: "Dinas / Instansi",
    keterangan: "Perencanaan jalan, jembatan, dan irigasi daerah.",
  },
  {
    nama: "Desa Bedahlawak",
    instansi: "Pemerintah Desa",
    keterangan: "Pembangunan dan rehabilitasi fasilitas desa.",
  },
  {
    nama: "Desa Candi Mulyo",
    instansi: "Pemerintah Desa",
    keterangan: "Pembangunan jalan desa dan gedung serbaguna.",
  },
  {
    nama: "Kecamatan Tembelang",
    instansi: "Kecamatan",
    keterangan: "Pendampingan teknis pembangunan kecamatan.",
  },
  {
    nama: "Kecamatan Ploso",
    instansi: "Kecamatan",
    keterangan: "Pengerjaan jalan dan jembatan penghubung.",
  },
  {
    nama: "Kecamatan Megaluh",
    instansi: "Kecamatan",
    keterangan: "Rehabilitasi saluran irigasi primer.",
  },
  {
    nama: "Yayasan Al Hikmah",
    instansi: "Yayasan / Lembaga",
    keterangan: "Pembangunan gedung pendidikan dan pondok.",
  },
  {
    nama: "Ponpes Darul Ulum",
    instansi: "Pesantren",
    keterangan: "Perencanaan dan renovasi gedung pesantren.",
  },
  {
    nama: "RSU Amanah",
    instansi: "Rumah Sakit",
    keterangan: "Pemeliharaan dan pengawasan gedung rumah sakit.",
  },
  {
    nama: "BUMDes Makmur",
    instansi: "Badan Usaha",
    keterangan: "Pendampingan teknis usaha desa dan sarana publik.",
  },
  {
    nama: "PDAM Jombang",
    instansi: "BUMD",
    keterangan: "Pekerjaan sarana air bersih dan jaringan perpipaan.",
  },
]

const FAQ = [
  {
    tanya: "Layanan apa saja yang bisa dikerjakan?",
    jawab:
      "Perencanaan teknis, pengawasan, perizinan PBG & SLF, serta konstruksi.",
  },
  {
    tanya: "Bagaimana tahapan kerja samanya?",
    jawab:
      "Konsultasi, survey, perencanaan, dokumen & perizinan, pelaksanaan, pengawasan, serah terima.",
  },
  {
    tanya: "Berapa lama pengurusan PBG dan SLF?",
    jawab:
      "Berkas teknis 1–2 minggu, proses pengajuan kami pantau sampai terbit.",
  },
  {
    tanya: "Apakah bisa menangani proyek di luar Jombang?",
    jawab: "Bisa, kami pernah bertugas di berbagai kota di Indonesia.",
  },
  {
    tanya: "Bagaimana skema biaya jasa?",
    jawab:
      "Berdasarkan lingkup, nilai konstruksi, dan durasi; penawaran tertulis rinci.",
  },
  {
    tanya: "Apakah progres dilaporkan berkala?",
    jawab: "Ya, laporan harian/mingguan dan dokumentasi visual pekerjaan.",
  },
]

const berandaData: Dok = {
  hero: {
    judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
    deskripsi:
      "CV. AN NASR KONSULTAN menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan.",
    keunggulan: [
      "Berdiri sejak 2014",
      "Puluhan proyek daerah",
      "Tim profesional bersertifikat",
    ],
  },
  statistik: [
    { nilai: "15+", label: "Tahun Pengalaman" },
    { nilai: "100+", label: "Proyek Daerah" },
    { nilai: "20+", label: "Kota Dijangkau" },
    { nilai: "98%", label: "Kepuasan Klien" },
  ],
  founder: {
    nama: "H. Ahmad Nasrullah, S.T.",
    jabatan: "Founder & Direktur",
    teks: "Berpengalaman lebih dari 15 tahun di bidang teknik sipil, dari perencanaan struktur hingga pelaksanaan konstruksi bangunan pemerintah dan swasta.",
    kutipan:
      "Setiap pekerjaan harus dapat dipertanggungjawabkan secara teknis maupun moral.",
  },
  layanan: LAYANAN.map((l) => ({
    slug: l.slug,
    judul: l.judul,
    ringkas: l.ringkas,
    detail: l.detail,
    manfaat: l.manfaat,
  })),
  portfolio: [
    {
      nama: "Pembangunan Gedung Serbaguna",
      lokasi: "Kec. Jombang",
      kategori: "Gedung",
    },
    {
      nama: "Peningkatan Jalan Beton Desa",
      lokasi: "Kec. Tembelang",
      kategori: "Jalan",
    },
    {
      nama: "Pembangunan Jembatan Penghubung Desa",
      lokasi: "Kec. Ploso",
      kategori: "Jembatan",
    },
    {
      nama: "Rehabilitasi Saluran Irigasi Primer",
      lokasi: "Kec. Megaluh",
      kategori: "Irigasi",
    },
    {
      nama: "Renovasi Rumah Tinggal Dua Lantai",
      lokasi: "Candi Mulyo",
      kategori: "Renovasi",
    },
    {
      nama: "Pengawasan Bangunan Penahan Air",
      lokasi: "Kab. Jombang",
      kategori: "Bangunan",
    },
  ],
  klien: KLIEN.map((nama) => ({ nama })),
  kotaProyek: KOTA,
  faq: FAQ,
  cta: {
    judul: "Konsultasikan Kebutuhan Proyek Anda Bersama Kami",
    deskripsi:
      "Sampaikan rencana pembangunan Anda, tim kami akan membantu menyusun solusi teknis yang tepat sasaran dan sesuai anggaran.",
  },
}

export async function seedAnnasr({ strapi }: { strapi: Core.Strapi }) {
  if (process.env.RUN_ANNASR_SEED !== "true") return
  const sekarang = new Date()
  const tgl = () => sekarang.toISOString()
  try {
    await seedTunggal(strapi, "api::beranda.beranda", {
      ...berandaData,
      publishedAt: tgl(),
    })
    await seedTunggal(strapi, "api::tentang.tentang", {
      hero: berandaData.hero,
      statistik: berandaData.statistik,
      founder: berandaData.founder,
      perjalanan: [
        {
          tahun: "2014",
          judul: "Berdiri di Jombang",
          teks: "Fokus pada perencanaan dan pengawasan bangunan.",
        },
        {
          tahun: "2016",
          judul: "Ekspansi Layanan",
          teks: "Perizinan PBG & SLF dan konstruksi melengkapi layanan.",
        },
        {
          tahun: "2018",
          judul: "Proyek Pemerintah Daerah",
          teks: "Dipercaya instansi dan desa untuk jalan, jembatan, irigasi.",
        },
        {
          tahun: "2021",
          judul: "Jangkauan Luar Jawa",
          teks: "Cakupan proyek meluas hingga Indonesia Timur.",
        },
      ],
      visiMisi: [
        {
          judul: "Visi",
          teks: "Menjadi mitra konsultan teknik dan konstruksi terpercaya di Jawa Timur.",
        },
        {
          judul: "Misi",
          teks: "Perencanaan akurat, pengawasan disiplin, dan konstruksi tepat mutu, biaya, waktu.",
        },
      ],
      tim: [
        { nama: "H. Ahmad Nasrullah, S.T.", jabatan: "Founder & Direktur" },
        { nama: "Rizky Pratama, S.T.", jabatan: "Project Manager" },
        { nama: "Siti Maulida, S.T., M.T.", jabatan: "Structural Engineer" },
        { nama: "Bagus Setiawan", jabatan: "Site Inspector" },
      ],
      alasan: [
        {
          judul: "Perencanaan hingga Konstruksi",
          teks: "Empat lini layanan dalam satu koordinasi.",
        },
        {
          judul: "Tenaga Ahli Bersertifikat",
          teks: "Pengalaman struktur dan infrastruktur.",
        },
        { judul: "Jangkauan Luas", teks: "Proyek tersebar di berbagai kota." },
        {
          judul: "Transparan & Tepat Waktu",
          teks: "Laporan berkala yang jelas.",
        },
      ],
      jangkauanJudul: "20+ kota di Indonesia telah kami kawal",
      jangkauanDeskripsi:
        "Berbasis di Jombang, pekerjaan kami tersebar melintasi Jawa hingga Indonesia Timur.",
      kotaProyek: KOTA,
    })
    await seedTunggal(strapi, "api::layanan.layanan", {
      introJudul: "Layanan teknik yang lengkap dan terintegrasi",
      introDeskripsi:
        "Dari studi awal hingga serah terima, seluruh kebutuhan teknis proyek ditangani dalam satu koordinasi.",
      layanan: LAYANAN.map((l) => ({
        slug: l.slug,
        judul: l.judul,
        ringkas: l.ringkas,
        deskripsi: l.deskripsi,
        detail: l.detail,
        manfaat: l.manfaat,
      })),
      proses: [
        {
          judul: "Konsultasi",
          teks: "Diskusi awal kebutuhan, lingkup, dan anggaran.",
        },
        {
          judul: "Survey Lapangan",
          teks: "Data topografi dan kondisi eksisting.",
        },
        { judul: "Perencanaan", teks: "Desain teknis, struktur, dan RAB." },
        { judul: "Dokumen", teks: "Gambar kerja, RKS, RAB, dan perizinan." },
        { judul: "Pelaksanaan", teks: "Konstruksi sesuai metode dan jadwal." },
        { judul: "Pengawasan", teks: "Kendali mutu, volume, dan progres." },
        { judul: "Serah Terima", teks: "Pemeriksaan akhir dan as built." },
      ],
    })
    await seedTunggal(strapi, "api::portfolio.portfolio", {
      heroJudul: "Pekerjaan yang berbicara melalui hasilnya",
      heroDeskripsi:
        "Dokumentasi komitmen terhadap mutu dan ketepatan pelaksanaan.",
      proyek: berandaData.portfolio as Dok[],
    })
    await seedTunggal(strapi, "api::klien.klien", {
      heroJudul: "Kepercayaan yang terjalin di banyak pintu",
      heroDeskripsi:
        "Instansi, lembaga, dan mitra usaha mempercayakan pekerjaan tekniknya kepada kami.",
      klien: KLIEN.map((nama) => ({ nama })),
    })
    await seedTunggal(strapi, "api::karir.karir", {
      heroJudul: "Tumbuh bersama tim teknik kami",
      heroDeskripsi:
        "Kami mencari orang yang teliti, disiplin, dan senang belajar.",
      posisi: [
        {
          nama: "Drafter Teknik Sipil",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "terbuka",
          slug: "drafter-teknik-sipil",
          ringkas:
            "Menyusun gambar kerja bangunan, jalan, dan jembatan dari konsep hingga siap konstruksi.",
          deskripsi:
            "Bergabung dengan tim perencanaan kami untuk menerjemahkan konsep desain menjadi gambar kerja yang akurat, lengkap, dan sesuai standar SNI.",
          tanggungJawab: [
            { teks: "Membuat gambar arsitektur dan struktur bangunan." },
            { teks: "Menyusun detail, RAB pendukung, dan bestek." },
            { teks: "Revisi gambar berdasarkan hasil koordinasi lapangan." },
            { teks: "Dokumentasi dan pengarsipan gambar proyek." },
          ],
          kualifikasi: [
            { teks: "D1–D3 Teknik Sipil/Arsitektur." },
            { teks: "Mahir AutoCAD 2D/3D; SketchUp nilai plus." },
            { teks: "Teliti, rapi, dan disiplin terhadap tenggat." },
          ],
          manfaat: [
            { teks: "Gaji kompetitif sesuai kemampuan." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
            { teks: "Lingkungan kerja tim yang suportif." },
          ],
        },
        {
          nama: "Pengawas Lapangan",
          tipe: "Penuh Waktu",
          lokasi: "Jombang & sekitarnya",
          status: "terbuka",
          slug: "pengawas-lapangan",
          ringkas:
            "Mengawasi mutu, volume, dan progres pekerjaan di lapangan sesuai gambar dan spesifikasi.",
          deskripsi:
            "Kami mencari pengawas yang teliti untuk memastikan setiap tahap pelaksanaan berjalan tepat mutu, biaya, dan waktu.",
          tanggungJawab: [
            { teks: "Memeriksa mutu bahan dan volume pekerjaan." },
            { teks: "Menilai kesesuaian pelaksanaan dengan gambar kerja." },
            { teks: "Menyusun laporan harian dan mingguan proyek." },
            { teks: "Koordinasi dengan kontraktor dan owner." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Teknik Sipil, pengalaman lapangan nilai plus." },
            { teks: "Menguasai spesifikasi teknis dan metode kerja." },
            { teks: "Jujur, komunikatif, dan siap mobilitas." },
          ],
          manfaat: [
            { teks: "Tunjangan transport & makan lapangan." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
            { teks: "Pengalaman proyek yang beragam." },
          ],
        },
        {
          nama: "Estimator / Quantity Surveyor",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "terbuka",
          slug: "estimator-quantity-surveyor",
          ringkas: "Menyusun RAB, analisa harga satuan, dan Bill of Quantity.",
          deskripsi:
            "Bersama tim kami, Anda menyusun estimasi biaya yang akurat dan menjadi dasar keputusan proyek.",
          tanggungJawab: [
            { teks: "Penyusunan RAB dan analisa harga satuan." },
            { teks: "Membuat Bill of Quantity dari gambar kerja." },
            { teks: "Evaluasi penawaran dan progress payment." },
            { teks: "Rekonsiliasi volume dan varian pekerjaan." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Teknik Sipil atau Ekonomi Teknik." },
            { teks: "Mahir spreadsheet & software estimasi." },
            { teks: "Cermat dan detail terhadap angka." },
          ],
          manfaat: [
            { teks: "Insentif proyek." },
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
            { teks: "Bimbingan senior di lapangan." },
          ],
        },
        {
          nama: "Administrasi Proyek",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          status: "ditutup",
          slug: "administrasi-proyek",
          ringkas: "Mengelola dokumen kontrak, laporan, dan perizinan proyek.",
          deskripsi:
            "Lowongan ini sementara ditutup. Pantau terus website kami untuk pembukaan kembali.",
          tanggungJawab: [
            { teks: "Mengelola dokumen kontrak dan laporan." },
            { teks: "Koordinasi perizinan proyek." },
            { teks: "Administrasi keuangan termin." },
          ],
          kualifikasi: [
            { teks: "D3/S1 Administrasi atau Manajemen." },
            { teks: "Mahir Office." },
            { teks: "Rapi dan berkomunikasi baik." },
          ],
          manfaat: [
            { teks: "BPJS Ketenagakerjaan & Kesehatan." },
            { teks: "Kerja yang terstruktur." },
          ],
        },
      ],
    })
    await seedTunggal(strapi, "api::kontak.kontak", {
      heroJudul: "Mari bicarakan rencana proyek Anda",
      heroDeskripsi:
        "Tim kami siap membantu menghitung kebutuhan teknis hingga estimasi biaya.",
      domisili:
        "Jl. Raya Tembelang RT.001 RW.003, Desa Bedahlawak, Kec. Tembelang, Jombang",
      kantor: "Perumahan Candi Regency No. A10, Desa Candi Mulyo, Kec. Jombang",
      telepon: "+62 812-0000-0000",
      email: "annasrkonsultan@email.com",
      jamOperasional: "Senin – Sabtu, 08.00 – 17.00 WIB",
      instagram: "annasrkonsultan",
      whatsapp: "6281200000000",
    })
    await seedTunggal(strapi, "api::artikel.artikel", {
      heroJudul: "Wawasan Teknik & Konstruksi",
      heroDeskripsi: "Catatan praktis dari pengalaman kami di lapangan.",
      artikel: ARTIKEL,
    })
    await seedTunggal(strapi, "api::situs.situs", {
      brandNama: "CV. An Nasr Konsultan",
      brandTagline: "Konsultan Teknik & Konstruksi",
      navigasi: NAV_MENU,
    })
    await seedKoleksiRekanan(strapi)
    await seedNavbarFooter(strapi)
    await seedKarir(strapi)
    await seedMenuSitus(strapi)
    console.log(
      "[seed] Konten An Nasr berhasil di-seed (9 tipe + rekanan + navbar/footer/menu)."
    )
  } catch (error) {
    const e = error as {
      inner?: unknown[]
      details?: unknown
      errors?: unknown[]
      message?: string
    }
    const potong = (v: unknown) => JSON.stringify(v)?.slice(0, 1200)
    console.warn(
      "[seed] gagal:",
      potong(e?.details ?? e?.errors ?? e?.inner ?? e?.message ?? error)
    )
  }
}
