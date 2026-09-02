export const statusLead = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
] as const
export type StatusLead = (typeof statusLead)[number]

export const statusProyek = ["Planning", "On Going", "Completed"] as const
export type StatusProyek = (typeof statusProyek)[number]

export const jenisAktivitas = [
  "WhatsApp",
  "Telepon",
  "Email",
  "Meeting",
  "Follow-up",
  "Proposal",
  "Catatan",
] as const
export type JenisAktivitas = (typeof jenisAktivitas)[number]

export const sumberLead = [
  "Form Website",
  "WhatsApp",
  "Referensi",
  "Tender",
  "Input Manual",
] as const

export type Lead = {
  id: string
  nama: string
  perusahaan: string
  jabatan: string
  email: string
  whatsapp: string
  layanan: string
  sumber: string
  kebutuhan: string
  pic: string
  potensiNilai: number
  status: StatusLead
  tanggalMasuk: string
  clientId?: string
}

export type Client = {
  id: string
  perusahaan: string
  pic: string
  jabatan: string
  email: string
  whatsapp: string
  alamat: string
  industri: string
  catatan: string
  tanggalGabung: string
}

export type Project = {
  id: string
  nama: string
  clientId: string
  pic: string
  layanan: string
  lokasi: string
  nilai: number
  mulai: string
  target: string
  status: StatusProyek
  progress: number
  catatan: string
}

export type Activity = {
  id: string
  jenis: JenisAktivitas
  tanggal: string
  pic: string
  status: "Terjadwal" | "Selesai" | "Batal"
  catatan: string
  leadId?: string
  clientId?: string
}

export const daftarPic = [
  "Ahmad Nasrullah",
  "Rizky Pratama",
  "Siti Maulida",
  "Bagus Setiawan",
]

export type CrmUser = { nama: string; email: string; peran: string }

export const akunInternal: {
  email: string
  password: string
  user: CrmUser
}[] = [
  {
    email: "admin@annasrkonsultan.id",
    password: "annasr123",
    user: {
      nama: "Ahmad Nasrullah",
      email: "admin@annasrkonsultan.id",
      peran: "Direktur",
    },
  },
  {
    email: "marketing@annasrkonsultan.id",
    password: "annasr123",
    user: {
      nama: "Rizky Pratama",
      email: "marketing@annasrkonsultan.id",
      peran: "Marketing",
    },
  },
]

const hariLalu = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)

  return d.toISOString().slice(0, 10)
}
const hariDepan = (n: number) => hariLalu(-n)

export const seedLeads: Lead[] = [
  {
    id: "L-001",
    nama: "Bapak Hendra Wijaya",
    perusahaan: "PT. Sarana Bangun Persada",
    jabatan: "Project Manager",
    email: "hendra@saranabangun.co.id",
    whatsapp: "081234567801",
    layanan: "Jasa Perencanaan",
    sumber: "Form Website",
    kebutuhan:
      "Perencanaan gedung kantor 3 lantai di Jombang, butuh RAB dan gambar kerja.",
    pic: "Rizky Pratama",
    potensiNilai: 185000000,
    status: "New",
    tanggalMasuk: hariLalu(1),
  },
  {
    id: "L-002",
    nama: "Ibu Nurul Hidayah",
    perusahaan: "Yayasan Al Hikmah",
    jabatan: "Bendahara Yayasan",
    email: "nurul@alhikmah.sch.id",
    whatsapp: "081234567802",
    layanan: "Jasa Konstruksi",
    sumber: "WhatsApp",
    kebutuhan: "Pembangunan ruang kelas baru 4 lokal beserta sanitasi.",
    pic: "Siti Maulida",
    potensiNilai: 640000000,
    status: "Contacted",
    tanggalMasuk: hariLalu(6),
  },
  {
    id: "L-003",
    nama: "Bapak Sugeng Riyadi",
    perusahaan: "CV. Mitra Karya",
    jabatan: "Direktur",
    email: "sugeng@mitrakarya.id",
    whatsapp: "081234567803",
    layanan: "Jasa Pengawasan",
    sumber: "Referensi",
    kebutuhan: "Pengawasan peningkatan jalan beton sepanjang 1,2 km.",
    pic: "Rizky Pratama",
    potensiNilai: 95000000,
    status: "Qualified",
    tanggalMasuk: hariLalu(12),
  },
  {
    id: "L-004",
    nama: "Bapak Andi Kurniawan",
    perusahaan: "PT. Tirta Mandiri",
    jabatan: "Kepala Teknik",
    email: "andi@tirtamandiri.co.id",
    whatsapp: "081234567804",
    layanan: "Jasa Perizinan",
    sumber: "Form Website",
    kebutuhan: "Pengurusan PBG dan SLF untuk gudang produksi 1.800 m².",
    pic: "Siti Maulida",
    potensiNilai: 120000000,
    status: "Proposal",
    tanggalMasuk: hariLalu(18),
  },
  {
    id: "L-005",
    nama: "Bapak Imam Syafi'i",
    perusahaan: "Ponpes Darul Ulum",
    jabatan: "Pengurus Sarpras",
    email: "imam@darululum.or.id",
    whatsapp: "081234567805",
    layanan: "Jasa Konstruksi",
    sumber: "Referensi",
    kebutuhan: "Renovasi asrama santri dua lantai.",
    pic: "Bagus Setiawan",
    potensiNilai: 410000000,
    status: "Negotiation",
    tanggalMasuk: hariLalu(25),
  },
  {
    id: "L-006",
    nama: "Ibu Dewi Anggraini",
    perusahaan: "Perumda Tirta Kencana",
    jabatan: "Manajer Proyek",
    email: "dewi@perumdatirta.id",
    whatsapp: "081234567806",
    layanan: "Jasa Perencanaan",
    sumber: "Tender",
    kebutuhan: "Perencanaan jaringan pipa dan bak penampung.",
    pic: "Ahmad Nasrullah",
    potensiNilai: 265000000,
    status: "Won",
    tanggalMasuk: hariLalu(48),
    clientId: "C-001",
  },
  {
    id: "L-007",
    nama: "Bapak Yusuf Maulana",
    perusahaan: "CV. Bumi Persada",
    jabatan: "Owner",
    email: "yusuf@bumipersada.id",
    whatsapp: "081234567807",
    layanan: "Jasa Pengawasan",
    sumber: "Input Manual",
    kebutuhan: "Pengawasan pembangunan ruko 6 unit, anggaran terbatas.",
    pic: "Bagus Setiawan",
    potensiNilai: 78000000,
    status: "Lost",
    tanggalMasuk: hariLalu(60),
  },
  {
    id: "L-008",
    nama: "Bapak Rahmat Hidayat",
    perusahaan: "Pemerintah Desa Bedahlawak",
    jabatan: "Kepala Desa",
    email: "desa@bedahlawak.id",
    whatsapp: "081234567808",
    layanan: "Jasa Konstruksi",
    sumber: "Form Website",
    kebutuhan: "Pembangunan saluran irigasi tersier 800 meter.",
    pic: "Ahmad Nasrullah",
    potensiNilai: 320000000,
    status: "Won",
    tanggalMasuk: hariLalu(90),
    clientId: "C-002",
  },
]

export const seedClients: Client[] = [
  {
    id: "C-001",
    perusahaan: "Perumda Tirta Kencana",
    pic: "Ibu Dewi Anggraini",
    jabatan: "Manajer Proyek",
    email: "dewi@perumdatirta.id",
    whatsapp: "081234567806",
    alamat: "Jl. KH. Wahid Hasyim No. 12, Jombang",
    industri: "Air Minum & Utilitas",
    catatan: "Klien rutin, pembayaran termin lancar. Butuh laporan mingguan.",
    tanggalGabung: hariLalu(45),
  },
  {
    id: "C-002",
    perusahaan: "Pemerintah Desa Bedahlawak",
    pic: "Bapak Rahmat Hidayat",
    jabatan: "Kepala Desa",
    email: "desa@bedahlawak.id",
    whatsapp: "081234567808",
    alamat: "Kantor Desa Bedahlawak, Kec. Tembelang, Jombang",
    industri: "Pemerintahan Desa",
    catatan: "Proyek bersumber Dana Desa, administrasi harus lengkap.",
    tanggalGabung: hariLalu(85),
  },
  {
    id: "C-003",
    perusahaan: "Yayasan Pendidikan Nusantara",
    pic: "Bapak Slamet Riyanto",
    jabatan: "Ketua Yayasan",
    email: "slamet@ypnusantara.sch.id",
    whatsapp: "081234567809",
    alamat: "Jl. Pattimura No. 5, Jombang",
    industri: "Pendidikan",
    catatan: "Rencana pengembangan kampus bertahap sampai 2028.",
    tanggalGabung: hariLalu(150),
  },
]

export const seedProjects: Project[] = [
  {
    id: "P-001",
    nama: "Perencanaan Jaringan Pipa & Bak Penampung",
    clientId: "C-001",
    pic: "Ahmad Nasrullah",
    layanan: "Jasa Perencanaan",
    lokasi: "Kecamatan Jombang, Jombang",
    nilai: 265000000,
    mulai: hariLalu(40),
    target: hariDepan(20),
    status: "On Going",
    progress: 62,
    catatan: "Menunggu hasil uji tanah untuk penempatan bak penampung.",
  },
  {
    id: "P-002",
    nama: "Pembangunan Saluran Irigasi Tersier",
    clientId: "C-002",
    pic: "Bagus Setiawan",
    layanan: "Jasa Konstruksi",
    lokasi: "Desa Bedahlawak, Tembelang",
    nilai: 320000000,
    mulai: hariLalu(80),
    target: hariLalu(5),
    status: "Completed",
    progress: 100,
    catatan: "Serah terima pekerjaan selesai, masa pemeliharaan berjalan.",
  },
  {
    id: "P-003",
    nama: "Pengawasan Pembangunan Gedung Kelas",
    clientId: "C-003",
    pic: "Siti Maulida",
    layanan: "Jasa Pengawasan",
    lokasi: "Kecamatan Jombang, Jombang",
    nilai: 148000000,
    mulai: hariLalu(15),
    target: hariDepan(75),
    status: "On Going",
    progress: 28,
    catatan: "Progres struktur lantai 1 sesuai jadwal.",
  },
  {
    id: "P-004",
    nama: "Perizinan PBG Gedung Serbaguna",
    clientId: "C-003",
    pic: "Rizky Pratama",
    layanan: "Jasa Perizinan",
    lokasi: "Kecamatan Jombang, Jombang",
    nilai: 65000000,
    mulai: hariDepan(10),
    target: hariDepan(70),
    status: "Planning",
    progress: 0,
    catatan: "Menunggu kelengkapan gambar arsitektur dari owner.",
  },
]

export const seedActivities: Activity[] = [
  {
    id: "A-001",
    jenis: "WhatsApp",
    tanggal: hariLalu(0),
    pic: "Rizky Pratama",
    status: "Terjadwal",
    catatan: "Follow-up penawaran perencanaan gedung kantor.",
    leadId: "L-001",
  },
  {
    id: "A-002",
    jenis: "Telepon",
    tanggal: hariLalu(3),
    pic: "Siti Maulida",
    status: "Selesai",
    catatan: "Konfirmasi kebutuhan ruang kelas dan jadwal survey.",
    leadId: "L-002",
  },
  {
    id: "A-003",
    jenis: "Meeting",
    tanggal: hariLalu(2),
    pic: "Rizky Pratama",
    status: "Terjadwal",
    catatan: "Rapat pembahasan lingkup pengawasan jalan beton.",
    leadId: "L-003",
  },
  {
    id: "A-004",
    jenis: "Proposal",
    tanggal: hariLalu(4),
    pic: "Siti Maulida",
    status: "Selesai",
    catatan: "Proposal PBG & SLF gudang produksi terkirim.",
    leadId: "L-004",
  },
  {
    id: "A-005",
    jenis: "Follow-up",
    tanggal: hariDepan(1),
    pic: "Bagus Setiawan",
    status: "Terjadwal",
    catatan: "Negosiasi harga renovasi asrama santri.",
    leadId: "L-005",
  },
  {
    id: "A-006",
    jenis: "Email",
    tanggal: hariLalu(1),
    pic: "Ahmad Nasrullah",
    status: "Selesai",
    catatan: "Kirim laporan mingguan progres jaringan pipa.",
    clientId: "C-001",
  },
  {
    id: "A-007",
    jenis: "Meeting",
    tanggal: hariDepan(0),
    pic: "Siti Maulida",
    status: "Terjadwal",
    catatan: "Rapat koordinasi progres gedung kelas dengan yayasan.",
    clientId: "C-003",
  },
]

export const rupiah = (n: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })

  return formatter.format(n)
}

export const tanggalID = (iso: string) => {
  const tanggal = new Date(iso)

  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export const isoHariIni = () => {
  const sekarang = new Date()

  return sekarang.toISOString().slice(0, 10)
}
