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
  { nama: "Jombang", lat: -7.5454, lng: 112.2424 },
  { nama: "Mojokerto", lat: -7.4667, lng: 112.4333 },
  { nama: "Kediri", lat: -7.8167, lng: 112.0167 },
  { nama: "Nganjuk", lat: -7.6039, lng: 111.9035 },
  { nama: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { nama: "Lamongan", lat: -7.1165, lng: 112.4181 },
  { nama: "Malang", lat: -7.9777, lng: 112.6304 },
  { nama: "Semarang", lat: -6.9667, lng: 110.4167 },
  { nama: "Bandung", lat: -6.9175, lng: 107.6191 },
  { nama: "Balikpapan", lat: -1.2379, lng: 116.8529 },
  { nama: "Makassar", lat: -5.1477, lng: 119.4327 },
  { nama: "Denpasar", lat: -8.6705, lng: 115.2126 },
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
  /** Langkah-langkah alur pengerjaan (opsional, untuk layanan perencanaan & pengawasan). */
  alur?: { judul: string; teks: string }[]
  /** Kartu persyaratan pengurusan (opsional, untuk layanan perizinan). */
  persyaratan?: { judul: string; deskripsi: string; daftar: string[] }[]
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
    alur: [
      {
        judul: "Konsultasi & Briefing",
        teks: "Menggali kebutuhan, lingkup pekerjaan, dan anggaran yang direncanakan pemilik proyek.",
      },
      {
        judul: "Survey & Pengukuran",
        teks: "Pendataan kondisi eksisting, topografi, dan titik-titik acuan di lapangan.",
      },
      {
        judul: "Perhitungan Struktur",
        teks: "Analisis pembebanan dan dimensi elemen struktur sesuai standar SNI.",
      },
      {
        judul: "Desain & Gambar Kerja",
        teks: "Penyusunan denah, tampak, potongan, dan detail teknis yang siap dipakai pelaksana.",
      },
      {
        judul: "RKS & RAB",
        teks: "Spesifikasi teknis pekerjaan dan rencana anggaran biaya yang terukur.",
      },
      {
        judul: "Finalisasi Dokumen",
        teks: "Review akhir, pengesahan, dan serah terima berkas disertai asistensi perizinan.",
      },
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
    alur: [
      {
        judul: "Penelaahan Kontrak",
        teks: "Memahami gambar rencana, spesifikasi, dan jadwal pelaksanaan proyek.",
      },
      {
        judul: "Rapat Persiapan",
        teks: "Menyamakan pemahaman lingkup, metode kerja, dan prosedur keselamatan (K3).",
      },
      {
        judul: "Pengawasan Pelaksanaan",
        teks: "Pemeriksaan mutu bahan, dimensi, dan kesesuaian metode dengan gambar rencana.",
      },
      {
        judul: "Pengendalian Volume",
        teks: "Verifikasi progres dan realisasi pekerjaan sebagai dasar pembayaran termin.",
      },
      {
        judul: "Pelaporan Berkala",
        teks: "Laporan harian, mingguan, dan dokumentasi visual untuk pemberi tugas.",
      },
      {
        judul: "Serah Terima",
        teks: "Inspeksi akhir, penyusunan as built drawing, dan serah terima pekerjaan.",
      },
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
    persyaratan: [
      {
        judul: "Persyaratan PBG",
        deskripsi:
          "Dokumen yang harus disiapkan untuk mengajukan Persetujuan Bangunan Gedung.",
        daftar: [
          "Formulir permohonan PBG dan bukti hak atas tanah",
          "KTP serta NPWP pemohon",
          "Gambar arsitektur (denah, tampak, potongan)",
          "Gambar struktur beserta perhitungannya",
          "Gambar instalasi mekanikal, elektrikal, dan proteksi kebakaran",
          "Kesesuaian pemanfaatan lahan dengan rencana tata ruang (RTRW)",
        ],
      },
      {
        judul: "Persyaratan SLF",
        deskripsi:
          "Dokumen untuk memperoleh Sertifikat Laik Fungsi setelah bangunan berdiri.",
        daftar: [
          "Formulir permohonan SLF",
          "Salinan PBG yang telah terbit",
          "Denah dan foto bangunan sesuai kondisi as built",
          "Laporan struktur dan konstruksi bangunan",
          "Sertifikat K3 konstruksi serta bukti laik operasi instalasi listrik",
          "Hasil pemeriksaan kelaikan teknis oleh tenaga ahli bersertifikat",
        ],
      },
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
  { label: "Rekanan", to: "/rekanan" },
  { label: "Artikel", to: "/artikel" },
  { label: "Karir", to: "/karir" },
  { label: "Kontak", to: "/kontak" },
] as const

export const artikel = [
  {
    slug: "memahami-pbg-dan-slf",
    judul: "Memahami PBG dan SLF: Dua Dokumen Wajib Bangunan Anda",
    ringkas:
      "Persetujuan Bangunan Gedung diurus sebelum membangun, Sertifikat Laik Fungsi setelah bangunan berdiri. Keduanya menentukan legalitas bangunan.",
    tanggal: "12 Agustus 2026",
    kategori: "Perizinan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/layanan-perizinan.jpg",
    isi: [
      "Setiap bangunan yang akan didirikan atau difungsikan wajib memiliki dokumen legalitas yang diatur dalam Undang-Undang Cipta Kerja dan Peraturan Pemerintah Nomor 16 Tahun 2021. Dokumen tersebut adalah Persetujuan Bangunan Gedung (PBG) dan Sertifikat Laik Fungsi (SLF).",
      "PBG diterbitkan sebelum pekerjaan konstruksi dimulai, menggantikan izin mendirikan bangunan (IMB). Prosesnya memerlukan gambar rencana, perhitungan struktur, dan kesesuaian penggunaan lahan yang diverifikasi secara sistem. Setelah bangunan berdiri, pemilik wajib mengurus SLF untuk memastikan bangunan layak fungsi, aman, sehat, dan tidak mengganggu lingkungan.",
      "Sebagai konsultan, kami mendampingi dari penyiapan berkas teknis, pengajuan melalui sistem online perizinan, hingga pemantauan sampai dokumen terbit. Dengan pengurusan yang benar dan terjadwal, Anda menghindari sanksi administratif yang justru lebih mahal dibanding biaya pendampingan.",
      "Pastikan arsitek atau konsultan yang Anda libatkan memahami persyaratan teknis kota/kabupaten setempat. Kesalahan gambar atau spesifikasi sejak awal adalah penyebab paling umum pengajuan PBG ditolak.",
    ],
  },
  {
    slug: "menyusun-rab-yang-realistis",
    judul: "Menyusun RAB yang Realistis agar Proyek Tidak Membengkak",
    ringkas:
      "Rencana anggaran biaya yang disusun dari analisa harga satuan dan volume terukur menekan risiko pekerjaan tambah kurang di lapangan.",
    tanggal: "29 Juli 2026",
    kategori: "Perencanaan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/layanan-perencanaan.jpg",
    isi: [
      "Rencana Anggaran Biaya (RAB) yang baik bukan sekadar daftar harga. RAB lahir dari volume pekerjaan yang terukur dan analisa harga satuan yang jujur, sehingga angka yang tertera benar-benar dapat dijadikan acuan pelaksanaan.",
      "Kesalahan paling umum adalah memakai harga satuan yang tidak memperhitungkan kondisi lapangan: jarak sumber material, mobilitas alat, hingga fluktuasi harga. Akibatnya muncul pekerjaan tambah kurang yang membuat anggaran membengkak di tengah jalan.",
      "Dalam penyusunan RAB, kami memulai dari gambar rencana dan perhitungan volume yang akurat, lalu menyusun analisa harga satuan berdasarkan harga pasar di wilayah proyek. Cadangan anggaran (contingency) juga disiapkan secara wajar, bukan sekadar menaikkan harga satuan.",
      "Hasilnya, pemberi tugas dapat memantau realisasi biaya per termin dengan bukti fisik yang jelas, dan perubahan lingkup dapat dihitung konsekuensi biayanya sebelum diputuskan.",
    ],
  },
  {
    slug: "peran-pengawas-lapangan",
    judul: "Peran Pengawas Lapangan dalam Menjaga Mutu Pekerjaan",
    ringkas:
      "Pengawas memastikan mutu bahan, volume, dan metode kerja sesuai gambar rencana, serta mendokumentasikan progres secara berkala.",
    tanggal: "10 Juli 2026",
    kategori: "Pengawasan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/layanan-pengawasan.jpg",
    isi: [
      "Kualitas sebuah proyek ditentukan pada malam hari, bukan di atas meja rapat: mutu beton yang dituang, tebal lapisan yang dipadatkan, dan kerapian penulangan. Di sinilah pengawas lapangan berperan sebagai mata dan telinga pemberi tugas.",
      "Tugas pengawas mencakup pemeriksaan mutu bahan sebelum dipakai, pengendalian volume pekerjaan, serta kesesuaian metode kerja dengan gambar rencana dan spesifikasi. Setiap temuan dicatat dan dilaporkan secara berkala, baik laporan harian maupun mingguan, lengkap dengan dokumentasi visual.",
      "Pengawasan yang disiplin juga melindungi pemberi tugas dalam hal pembayaran termin. Volume yang dibayarkan harus sesuai realisasi di lapangan, sehingga tidak ada pemborosan karena pekerjaan tersamar atau material yang tidak sesuai spesifikasi.",
      "Kami menempatkan pengawas yang familiar dengan jenis pekerjaan, karena pengalaman memahami titik rawan mutu jauh lebih berharga daripada sekadar mencatat progres.",
    ],
  },
  {
    slug: "memilih-struktur-jalan-desa",
    judul: "Jalan Beton atau Jalan Aspal untuk Ruas Desa?",
    ringkas:
      "Pemilihan perkerasan bergantung pada beban lalu lintas, kondisi tanah dasar, dan kemampuan pemeliharaan jangka panjang.",
    tanggal: "24 Juni 2026",
    kategori: "Konstruksi",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/layanan-konstruksi.jpg",
    isi: [
      "Pertanyaan klasik perencanaan jalan perdesaan: beton atau aspal? Keduanya memiliki kelebihan dan keterbatasan, dan jawabannya sangat bergantung pada kondisi spesifik tiap ruas.",
      "Perkerasan beton unggul untuk lalu lintas kendaraan berat, tahan genangan, dan perawatannya ringan dalam jangka panjang — asalkan tanah dasar dipersiapkan baik. Kelemahannya adalah biaya awal yang lebih besar dan perbaikan lokal yang lebih sulit bila terjadi kerusakan.",
      "Perkerasan aspal lebih nyaman, lebih cepat dikerjakan, dan biaya awalnya lebih rendah. Namun aspal sensitif terhadap genangan dan membutuhkan pemeliharaan berkala (pelapisan ulang) yang harus dianggarkan pemerintah desa.",
      "Kami biasanya menyusun perbandingan biaya siklus hidup (life cycle cost) kedua jenis perkerasan berdasarkan volume lalu lintas, kondisi tanah, dan anggaran pemeliharaan desa, sebelum merekomendasikan jenis perkerasan.",
    ],
  },
  {
    slug: "memilih-konsultan-konstruksi",
    judul: "Kriteria Memilih Konsultan Konstruksi yang Tepat",
    ringkas:
      "Legalitas, portofolio, tenaga ahli, dan transparansi biaya adalah hal pertama yang perlu diperiksa sebelum menunjuk konsultan.",
    tanggal: "5 Juni 2026",
    kategori: "Perencanaan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/tim-engineer.jpg",
    isi: [
      "Memilih konsultan konstruksi adalah keputusan jangka panjang: keputusan ini menentukan apakah proyek berjalan tepat mutu, tepat biaya, dan tepat waktu. Karena itu, pemeriksaan awal perlu dilakukan secara sistematis.",
      "Pertama, pastikan legalitas: badan usaha berbadan hukum, memiliki tenaga ahli bersertifikat (misalnya SKA/SKT), dan pengalaman sesuai jenis pekerjaan. Kedua, periksa portofolio — bukan hanya jumlah proyek, tetapi kemiripan lingkup dan skala dengan kebutuhan Anda.",
      "Ketiga, perhatikan transparansi. Konsultan yang baik bersedia memaparkan struktur biaya jasa, metode kerja, dan jadwal penugasan secara tertulis sejak awal. Keempat, pastikan ada PIC tunggal yang bertanggung jawab memantau penugasan, bukan sekadar tim yang berganti-ganti.",
      "Konsultasi awal biasanya dapat dilakukan tanpa biaya. Gunakan kesempatan itu untuk mengukur kedalaman pemahaman konsultan terhadap kondisi lapangan di wilayah proyek Anda.",
    ],
  },
  {
    slug: "tips-membangun-rumah-tinggal",
    judul: "Tips Membangun Rumah Tinggal: Fase yang Sering Terlewat",
    ringkas:
      "Survei tanah, gambar kerja lengkap, dan perizinan sering dianggap sepele padahal menentukan kelancaran pembangunan rumah.",
    tanggal: "19 Mei 2026",
    kategori: "Konstruksi",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/proyek-renovasi.jpg",
    isi: [
      "Sebagian besar pembangunan rumah tinggal bermasalah bukan karena tukang, melainkan karena fase perencanaan yang disederhanakan berlebihan. Padahal tiga persiapan kecil menentukan kelancaran keseluruhan proyek.",
      "Pertama, survei dan uji tanah. Daya dukung tanah menentukan jenis pondasi; membangun di tanah yang berbeda tanpa uji tanah adalah undian. Kedua, gambar kerja yang lengkap: denah, tampak, potongan, detail, sampai jadwal material — semuanya mencegah revisi di tengah pekerjaan.",
      "Ketiga, perizinan. PBG bukan sekadar formalitas; kesalahan struktur yang terverifikasi melalui perizinan dapat menyelamatkan Anda dari kerugian yang jauh lebih besar. Prosesnya juga harus dimulai sebelum pekerjaan, bukan setelahnya.",
      "Dengan tiga fase ini dikerjakan dengan benar oleh tenaga yang tepat, pembangunan rumah umumnya berjalan lebih cepat dan biayanya lebih terkendali dibanding proyek yang 'langsung tancap bangun'.",
    ],
  },
  {
    slug: "pentingnya-as-built-drawing",
    judul: "Pentingnya Gambar As Built untuk Pemeliharaan Bangunan",
    ringkas:
      "Gambar as built adalah dokumen paling berharga pasca konstruksi — acuan pemeliharaan, renovasi, dan audit teknis bangunan.",
    tanggal: "2 Mei 2026",
    kategori: "Perencanaan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/proyek-gedung.jpg",
    isi: [
      "Ketika sebuah gedung selesai dibangun, dokumen yang paling jarang diperhatikan justru paling menentukan masa depannya: gambar as built. Ini adalah gambar yang merekam kondisi pelaksanaan sebenarnya, termasuk setiap penyesuaian yang terjadi di lapangan.",
      "Tanpa as built, pemeliharaan menjadi tebak-tebakan: letak pipa, jalur kabel, dimensi utilitas, hingga posisi tulangan tidak terdokumentasi. Ketika renovasi dilakukan bertahun-tahun kemudian, ketidaktahuan ini sering berujung pada tembus pipa, potong kabel, atau kesalahan struktur.",
      "Pada setiap proyek yang kami kawal, penyusunan gambar as built adalah bagian wajib dari serah terima. Dokumen disusun bersama kontraktor dan diverifikasi di lapangan sebelum diserahkan kepada pemberi tugas.",
      "Jika bangunan Anda belum memiliki as built, kami dapat melakukan redrawing dari kondisi eksisting — investasi kecil yang nilainya terasa ketika kebutuhan renovasi atau audit teknis muncul.",
    ],
  },
  {
    slug: "pengawasan-rehabilitasi-irigasi",
    judul: "Mengawal Rehabilitasi Saluran Irigasi agar Berumur Panjang",
    ringkas:
      "Pengawasan irigasi bukan hanya mengecek dimensi, tetapi memastikan kemiringan, mutu pasangan, dan titik pembuangan air benar.",
    tanggal: "15 April 2026",
    kategori: "Pengawasan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/proyek-irigasi.jpg",
    isi: [
      "Saluran irigasi yang salah kemiringan akan menggenang, bukan mengalir. Karena itulah pengawasan rehabilitasi irigasi menuntut ketelitian pada elemen yang tidak terlihat saat pekerjaan selesai.",
      "Pengawas harus memeriksa kemiringan memanjang (gradien) sesuai desain, mutu pasangan batu dan beton, ketebalan plesteran, hingga elevasi pintu air dan titik pembuangan. Penyimpangan kecil pada dimensi dapat mengurangi luas areal yang terlayani secara signifikan.",
      "Dokumentasi juga penting: kondisi sebelum, saat, dan sesudah pekerjaan menjadi dasar penilaian volumenya. Tanpa dokumentasi yang baik, pembayaran termin sulit dipertanggungjawabkan secara transparan.",
      "Pengalaman kami menangani rehabilitasi irigasi primer dan sekunder di Jawa Timur menunjukkan bahwa pengawasan yang disiplin sejak minggu pertama menekan pekerjaan ulang hingga akhir masa pemeliharaan.",
    ],
  },
  {
    slug: "sertifikat-laik-fungsi-gedung",
    judul:
      "SLF Wajib untuk Gedung yang Sudah Berdiri: Apa yang Harus Disiapkan?",
    ringkas:
      "Bangunan yang tidak memiliki SLF berisiko sanksi administratif. Ketahui persyaratan dan proses pengurusannya.",
    tanggal: "2 April 2026",
    kategori: "Perizinan",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/proyek-bendungan.jpg",
    isi: [
      "Setelah bangunan berdiri dan sebelum difungsikan, pemilik wajib mengurus Sertifikat Laik Fungsi (SLF). Sertifikat ini merupakan pernyataan bahwa bangunan telah memenuhi persyaratan kelaikan teknis: keselamatan, kesehatan, kenyamanan, dan kemudahan.",
      "Prosesnya melibatkan verifikasi kesesuaian pelaksanaan dengan PBG, pemeriksaan struktur, arsitektur, mekanikal-elektrikal, hingga proteksi kebakaran. Bangunan yang banyak melakukan perubahan dari izin awal biasanya memerlukan penyesuaian dokumen terlebih dahulu.",
      "Untuk mempercepat proses, siapkan gambar as built, laporan struktur, dan bukti pemeliharaan bangunan. Konsultan dapat melakukan pemeriksaan pendahuluan untuk mendeteksi hal-hal yang berpotensi menjadi temuan sebelum verifikasi resmi.",
      "Gedung perkantoran, ruko, dan bangunan umum yang telah beroperasi tanpa SLF dapat dikenai sanksi administratif. Menyiapkan pengurusan sejak masa pemeliharaan bangunan adalah langkah paling hemat.",
    ],
  },
  {
    slug: "kenalan-dengan-mutu-beton",
    judul: "Kenali Mutu Beton dan Kaitannya dengan Struktur Bangunan",
    ringkas:
      "Memahami istilah K-225, K-300, dan fc-25 membantu Anda berkomunikasi dengan tepat bersama pelaksana konstruksi.",
    tanggal: "18 Maret 2026",
    kategori: "Konstruksi",
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: "/images/annasr/layanan-konstruksi.jpg",
    isi: [
      "Saat proyek berjalan, Anda akan menemui istilah mutu beton seperti K-225, K-300, atau fc-21. Keduanya adalah cara mengukur kuat tekan beton — K menggunakan satuan kg/cm², sedangkan fc menggunakan MPa — dan keduanya sering disalahartikan.",
      "Pemilihan mutu beton bergantung pada fungsi elemen: pondasi, kolom, balok, atau pelat, serta beban yang direncanakan. Struktur bertingkat umumnya membutuhkan mutu yang lebih tinggi pada elemen yang menahan beban besar, dengan proporsi campuran yang diverifikasi melalui uji laboratorium.",
      "Yang lebih penting dari angka adalah konsistensi pelaksanaannya: penakaran yang benar, waktu pengadukan, pemadatan, hingga perawatan (curing) setelah pengecoran. Beton berkualitas akan gagal jika pelaksanaan tidak terkontrol.",
      "Konsultan struktur menyusun spesifikasi mutu beton dan melakukan pengujian sampel. Ketika Anda memahami dasar ini, Anda bisa berdialog setara dengan pelaksana dan meminta bukti hasil uji, bukan sekadar janji.",
    ],
  },
]

export type Artikel = (typeof artikel)[number]
