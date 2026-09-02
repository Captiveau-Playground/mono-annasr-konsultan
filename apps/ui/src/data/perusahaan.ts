import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  type LucideIcon,
} from "lucide-react"

export const perusahaan = {
  nama: "CV. AN NASR KONSULTAN",
  singkat:
    "Penyedia jasa konsultansi teknik sipil, perencanaan, pengawasan, perizinan, dan konstruksi di Kabupaten Jombang, Jawa Timur.",
  telepon: "+62 812-0000-0000",
  whatsapp: "6281200000000",
  email: "annasrkonsultan@email.com",
  jamOperasional: "Senin – Sabtu, 08.00 – 17.00 WIB",
  domisili:
    "Jl. Raya Tembelang RT.001 RW.003, Desa Bedahlawak, Kecamatan Tembelang, Kabupaten Jombang",
  kantor:
    "Perumahan Candi Regency No. A10, Desa Candi Mulyo, Kecamatan Jombang, Kabupaten Jombang",
}

export const founder = {
  nama: "H. Ahmad Nasrullah, S.T.",
  jabatan: "Founder & Direktur",
  teks: "Berpengalaman lebih dari 15 tahun di bidang teknik sipil, mulai dari perencanaan struktur, pengawasan proyek infrastruktur, hingga pelaksanaan konstruksi bangunan pemerintah dan swasta. Beliau mendirikan CV. AN NASR KONSULTAN dengan satu prinsip sederhana: setiap pekerjaan harus dapat dipertanggungjawabkan secara teknis maupun moral.",
}

export const klien = [
  "Pemkab Jombang",
  "Dinas PUPR",
  "Desa Bedahlawak",
  "Desa Candi Mulyo",
  "Kec. Tembelang",
  "Kec. Ploso",
  "Kec. Megaluh",
  "Yayasan Al Hikmah",
  "SMK Nusantara",
  "MI Al Falah",
  "Ponpes Darul Ulum",
  "CV. Mitra Karya",
  "CV. Bumi Persada",
  "PT. Sarana Bangun",
  "PT. Tirta Mandiri",
  "Koperasi Sejahtera",
  "RSU Amanah",
  "BUMDes Makmur",
  "PDAM Jombang",
  "Perumda Tirta",
]

export const kotaProyek = [
  { nama: "Jombang", atas: "76%", kiri: "36.5%" },
  { nama: "Mojokerto", atas: "75%", kiri: "37.6%" },
  { nama: "Kediri", atas: "78%", kiri: "35.8%" },
  { nama: "Nganjuk", atas: "76%", kiri: "35%" },
  { nama: "Surabaya", atas: "73.5%", kiri: "38.4%" },
  { nama: "Lamongan", atas: "73%", kiri: "37%" },
  { nama: "Malang", atas: "79.5%", kiri: "37%" },
  { nama: "Semarang", atas: "73%", kiri: "31%" },
  { nama: "Bandung", atas: "76%", kiri: "24%" },
  { nama: "Balikpapan", atas: "47%", kiri: "44%" },
  { nama: "Makassar", atas: "60%", kiri: "50%" },
  { nama: "Denpasar", atas: "83%", kiri: "44%" },
]

export const sesiMingguan = [
  { minggu: "M1", sesi: 210 },
  { minggu: "M2", sesi: 268 },
  { minggu: "M3", sesi: 245 },
  { minggu: "M4", sesi: 312 },
  { minggu: "M5", sesi: 356 },
  { minggu: "M6", sesi: 330 },
  { minggu: "M7", sesi: 398 },
  { minggu: "M8", sesi: 441 },
]

export type Layanan = {
  slug: string
  nama: string
  ikon: LucideIcon
  ringkas: string
  detail: string[]
  gambar: string
  alt: string
  galeri: { src: string; alt: string }[]
  deskripsi: string
  manfaat: string[]
}

export const layanan: Layanan[] = [
  {
    slug: "perencanaan",
    nama: "Jasa Perencanaan",
    ikon: Building2,
    ringkas:
      "Perencanaan teknis dan penyusunan desain yang matang, terukur, dan sesuai standar teknis yang berlaku.",
    gambar: "/images/annasr/layanan-perencanaan.jpg",
    alt: "Tim teknik CV. AN NASR KONSULTAN menyusun gambar rencana bangunan di kantor",
    deskripsi:
      "Layanan perencanaan kami mencakup survey awal, perhitungan struktur, penyusunan gambar kerja, rencana kerja dan syarat (RKS), hingga rencana anggaran biaya (RAB). Seluruh desain disusun mengikuti SNI dan kebutuhan nyata di lapangan agar pelaksanaan berjalan tanpa perubahan besar di tengah jalan.",
    manfaat: [
      "Anggaran proyek terukur sejak awal",
      "Gambar kerja siap dipakai pelaksana",
      "Desain aman dan sesuai standar SNI",
      "Meminimalkan pekerjaan tambah kurang",
    ],
    galeri: [
      {
        src: "/images/annasr/proyek-gedung.jpg",
        alt: "Perencanaan bangunan gedung bertingkat",
      },
      {
        src: "/images/annasr/proyek-jembatan.jpg",
        alt: "Perencanaan struktur jembatan penghubung desa",
      },
      {
        src: "/images/annasr/proyek-bendungan.jpg",
        alt: "Perencanaan bangunan sumber daya air",
      },
    ],
    detail: [
      "Perencanaan Bangunan Gedung",
      "Perencanaan Jalan",
      "Perencanaan Jembatan",
      "Perencanaan Sumber Daya Air",
      "Saluran Irigasi",
      "Penahan Tanah",
      "Bendungan",
    ],
  },
  {
    slug: "pengawasan",
    nama: "Jasa Pengawasan",
    ikon: ClipboardCheck,
    ringkas:
      "Pengendalian mutu, biaya, dan waktu pelaksanaan pekerjaan melalui pengawasan lapangan yang disiplin.",
    gambar: "/images/annasr/layanan-pengawasan.jpg",
    alt: "Pengawas lapangan memeriksa progres pekerjaan konstruksi dengan alat ukur",
    deskripsi:
      "Kami menempatkan tenaga pengawas yang memeriksa mutu bahan, volume pekerjaan, serta kesesuaian pelaksanaan dengan gambar rencana. Laporan harian, mingguan, dan dokumentasi visual disampaikan secara berkala kepada pemberi tugas.",
    manfaat: [
      "Mutu pekerjaan terkontrol setiap tahap",
      "Progres proyek terdokumentasi rapi",
      "Penyimpangan cepat terdeteksi",
      "Pembayaran termin sesuai realisasi",
    ],
    galeri: [
      {
        src: "/images/annasr/proyek-jalan.jpg",
        alt: "Pengawasan pekerjaan jalan beton",
      },
      {
        src: "/images/annasr/proyek-irigasi.jpg",
        alt: "Pengawasan rehabilitasi saluran irigasi",
      },
      {
        src: "/images/annasr/proyek-gedung.jpg",
        alt: "Pengawasan pembangunan gedung",
      },
    ],
    detail: [
      "Pengawasan Bangunan Gedung",
      "Pengawasan Jalan",
      "Pengawasan Jembatan",
      "Pengawasan Irigasi",
      "Pengawasan Penahan Tanah",
      "Pengawasan Bendungan",
    ],
  },
  {
    slug: "perizinan",
    nama: "Jasa Perizinan",
    ikon: FileCheck2,
    ringkas:
      "Pendampingan penuh pengurusan dokumen perizinan bangunan agar proyek Anda legal dan siap difungsikan.",
    gambar: "/images/annasr/layanan-perizinan.jpg",
    alt: "Pendampingan pengurusan dokumen perizinan bangunan PBG dan SLF",
    deskripsi:
      "Pengurusan dokumen perizinan bangunan kami dampingi dari penyiapan berkas teknis, pengajuan melalui sistem, hingga terbitnya persetujuan. Anda tidak perlu bolak-balik mengurus administrasi sendiri.",
    manfaat: [
      "Bangunan legal dan siap difungsikan",
      "Berkas teknis disiapkan lengkap",
      "Proses pengajuan dipantau sampai terbit",
      "Menghindari risiko sanksi administratif",
    ],
    galeri: [
      {
        src: "/images/annasr/proyek-gedung.jpg",
        alt: "Dokumen PBG untuk bangunan gedung",
      },
      {
        src: "/images/annasr/proyek-renovasi.jpg",
        alt: "Pengurusan SLF bangunan rumah tinggal",
      },
    ],
    detail: [
      "Persetujuan Bangunan Gedung (PBG)",
      "Sertifikat Laik Fungsi (SLF)",
    ],
  },
  {
    slug: "konstruksi",
    nama: "Jasa Konstruksi",
    ikon: HardHat,
    ringkas:
      "Pelaksanaan pekerjaan konstruksi bangunan dan infrastruktur dengan metode kerja yang aman dan efisien.",
    gambar: "/images/annasr/layanan-konstruksi.jpg",
    alt: "Pekerja konstruksi membangun struktur bangunan dua lantai",
    deskripsi:
      "Pelaksanaan pekerjaan dilakukan tim lapangan berpengalaman dengan metode kerja yang aman, jadwal yang realistis, serta material yang sesuai spesifikasi. Progres dilaporkan terbuka sampai serah terima pekerjaan.",
    manfaat: [
      "Satu koordinasi dari desain ke pelaksanaan",
      "Jadwal kerja terkendali",
      "Material sesuai spesifikasi teknis",
      "Garansi masa pemeliharaan pekerjaan",
    ],
    galeri: [
      {
        src: "/images/annasr/proyek-renovasi.jpg",
        alt: "Renovasi rumah tinggal dua lantai",
      },
      {
        src: "/images/annasr/proyek-jalan.jpg",
        alt: "Pekerjaan jalan beton desa",
      },
      {
        src: "/images/annasr/proyek-jembatan.jpg",
        alt: "Pembangunan jembatan penghubung",
      },
    ],
    detail: [
      "Pembangunan Rumah",
      "Renovasi Rumah",
      "Gedung",
      "Kantor",
      "Sekolah",
      "Jalan Aspal",
      "Jalan Beton",
      "Jembatan",
      "Saluran Irigasi",
      "Penahan Tanah",
      "Bendungan",
    ],
  },
]

export const prosesKerja = [
  {
    judul: "Konsultasi",
    teks: "Diskusi awal untuk memahami kebutuhan, lingkup, serta anggaran proyek Anda.",
  },
  {
    judul: "Survey Lapangan",
    teks: "Pengukuran, pengambilan data topografi, dan pemeriksaan kondisi eksisting lokasi.",
  },
  {
    judul: "Perencanaan",
    teks: "Penyusunan desain teknis, perhitungan struktur, dan rencana anggaran biaya.",
  },
  {
    judul: "Penyusunan Dokumen",
    teks: "Gambar kerja, RKS, RAB, serta dokumen perizinan disiapkan secara lengkap.",
  },
  {
    judul: "Pelaksanaan",
    teks: "Pekerjaan konstruksi dijalankan sesuai metode kerja dan jadwal yang disepakati.",
  },
  {
    judul: "Pengawasan",
    teks: "Pengendalian mutu bahan, volume, dan progres pekerjaan di lapangan setiap tahap.",
  },
  {
    judul: "Serah Terima",
    teks: "Pemeriksaan akhir, penyerahan dokumen as built, dan serah terima pekerjaan.",
  },
]

export const kategoriPortfolio = [
  "Semua",
  "Bangunan",
  "Jalan",
  "Jembatan",
  "Irigasi",
  "Gedung",
  "Renovasi",
]

export const portfolio = [
  {
    nama: "Pembangunan Gedung Serbaguna",
    lokasi: "Kecamatan Jombang, Jombang",
    kategori: "Gedung",
    gambar: "/images/annasr/proyek-gedung.jpg",
    tinggi: "tall",
  },
  {
    nama: "Peningkatan Jalan Beton Desa",
    lokasi: "Kecamatan Tembelang, Jombang",
    kategori: "Jalan",
    gambar: "/images/annasr/proyek-jalan.jpg",
    tinggi: "short",
  },
  {
    nama: "Pembangunan Jembatan Penghubung Desa",
    lokasi: "Kecamatan Ploso, Jombang",
    kategori: "Jembatan",
    gambar: "/images/annasr/proyek-jembatan.jpg",
    tinggi: "tall",
  },
  {
    nama: "Rehabilitasi Saluran Irigasi Primer",
    lokasi: "Kecamatan Megaluh, Jombang",
    kategori: "Irigasi",
    gambar: "/images/annasr/proyek-irigasi.jpg",
    tinggi: "short",
  },
  {
    nama: "Renovasi Rumah Tinggal Dua Lantai",
    lokasi: "Candi Mulyo, Jombang",
    kategori: "Renovasi",
    gambar: "/images/annasr/proyek-renovasi.jpg",
    tinggi: "short",
  },
  {
    nama: "Pengawasan Bangunan Penahan Air",
    lokasi: "Kabupaten Jombang",
    kategori: "Bangunan",
    gambar: "/images/annasr/proyek-bendungan.jpg",
    tinggi: "short",
  },
  {
    nama: "Pembangunan Gedung Sekolah Dua Lantai",
    lokasi: "Kecamatan Diwek, Jombang",
    kategori: "Gedung",
    gambar: "/images/annasr/proyek-gedung.jpg",
    tinggi: "short",
  },
  {
    nama: "Peningkatan Jalan Lingkungan Perumahan",
    lokasi: "Kecamatan Peterongan, Jombang",
    kategori: "Jalan",
    gambar: "/images/annasr/proyek-jalan.jpg",
    tinggi: "short",
  },
  {
    nama: "Normalisasi Saluran Irigasi Sekunder",
    lokasi: "Kecamatan Kesamben, Jombang",
    kategori: "Irigasi",
    gambar: "/images/annasr/proyek-irigasi.jpg",
    tinggi: "short",
  },
]

export const navigasi = [
  { label: "Beranda", to: "/" },
  { label: "Layanan", to: "/layanan" },
  { label: "Proyek", to: "/portfolio" },
  { label: "Tentang Kami", to: "/tentang" },
  { label: "Artikel", to: "/artikel" },
  { label: "Karir", to: "/karir" },
  { label: "Hubungi Kami", to: "/kontak" },
] as const

export const artikel = [
  {
    slug: "memahami-pbg-dan-slf",
    judul: "Memahami PBG dan SLF: Dua Dokumen Wajib Bangunan Anda",
    ringkas:
      "Persetujuan Bangunan Gedung diurus sebelum membangun, Sertifikat Laik Fungsi setelah bangunan berdiri. Keduanya menentukan legalitas bangunan.",
    tanggal: "12 Agustus 2026",
    kategori: "Perizinan",
    gambar: "/images/annasr/layanan-perizinan.jpg",
  },
  {
    slug: "menyusun-rab-yang-realistis",
    judul: "Menyusun RAB yang Realistis agar Proyek Tidak Membengkak",
    ringkas:
      "Rencana anggaran biaya yang disusun dari analisa harga satuan dan volume terukur menekan risiko pekerjaan tambah kurang di lapangan.",
    tanggal: "29 Juli 2026",
    kategori: "Perencanaan",
    gambar: "/images/annasr/layanan-perencanaan.jpg",
  },
  {
    slug: "peran-pengawas-lapangan",
    judul: "Peran Pengawas Lapangan dalam Menjaga Mutu Pekerjaan",
    ringkas:
      "Pengawas memastikan mutu bahan, volume, dan metode kerja sesuai gambar rencana, serta mendokumentasikan progres secara berkala.",
    tanggal: "10 Juli 2026",
    kategori: "Pengawasan",
    gambar: "/images/annasr/layanan-pengawasan.jpg",
  },
  {
    slug: "memilih-struktur-jalan-desa",
    judul: "Jalan Beton atau Jalan Aspal untuk Ruas Desa?",
    ringkas:
      "Pemilihan perkerasan bergantung pada beban lalu lintas, kondisi tanah dasar, dan kemampuan pemeliharaan jangka panjang.",
    tanggal: "24 Juni 2026",
    kategori: "Konstruksi",
    gambar: "/images/annasr/layanan-konstruksi.jpg",
  },
]
