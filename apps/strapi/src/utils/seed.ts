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
  artikel: ARTIKEL,
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
          teks: "Menyusun gambar kerja bangunan, jalan, dan jembatan.",
        },
        {
          nama: "Pengawas Lapangan",
          tipe: "Penuh Waktu",
          lokasi: "Jombang & sekitarnya",
          teks: "Mengawasi mutu, volume, dan progres di lapangan.",
        },
        {
          nama: "Estimator / Quantity Surveyor",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          teks: "Menyusun RAB dan analisa harga satuan.",
        },
        {
          nama: "Administrasi Proyek",
          tipe: "Penuh Waktu",
          lokasi: "Jombang",
          teks: "Mengelola dokumen kontrak, laporan, dan perizinan.",
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
    })
    await seedTunggal(strapi, "api::artikel.artikel", {
      heroJudul: "Wawasan Teknik & Konstruksi",
      heroDeskripsi: "Catatan praktis dari pengalaman kami di lapangan.",
      artikel: ARTIKEL,
    })
    await seedTunggal(strapi, "api::situs.situs", {
      brandNama: "CV. An Nasr Konsultan",
      brandTagline: "Konsultan Teknik & Konstruksi",
      navigasi: [
        { label: "Beranda", href: "/" },
        { label: "Layanan", href: "/layanan" },
        { label: "Proyek", href: "/portfolio" },
        { label: "Tentang Kami", href: "/tentang" },
        { label: "Artikel", href: "/artikel" },
        { label: "Karir", href: "/karir" },
        { label: "Kontak", href: "/kontak" },
      ],
    })
    console.log("[seed] Konten An Nasr berhasil di-seed ke 9 tipe.")
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
