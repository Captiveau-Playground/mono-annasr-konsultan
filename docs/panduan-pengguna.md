# Panduan Pengguna CMS — Website CV. An Nasr Konsultan

Panduan ini untuk **tim An Nasr yang mengelola isi website** — bukan untuk
programmer. Setelah membaca dan mencoba, Anda bisa menambah layanan, proyek,
artikel, lowongan, dan mengubah hampir seluruh teks di website **tanpa bantuan
developer**.

|                |                                                   |
| -------------- | ------------------------------------------------- |
| Website publik | <https://annasrkonsultan.com>                     |
| Admin CMS      | <https://cms.annasrkonsultan.com/admin>           |
| Butuh bantuan? | Lihat bagian [12. Bantuan](#12-bantuan--eskalasi) |
| Waktu baca     | ± 20 menit (praktik: ± 2 jam untuk semua materi)  |

---

## 1. Apa yang bisa Anda ubah

Hampir semua teks dan gambar di website berasal dari CMS:

- Teks beranda, tentang, layanan, portofolio, klien, rekanan, artikel, karier, kontak
- Gambar hero, foto founder, foto tim, galeri layanan, logo klien
- Menu navbar dan isi footer
- Judul & deskripsi halaman untuk Google (SEO)
- Lowongan kerja dan statusnya
- Alamat/redirect halaman lama

Yang **tidak** diubah dari CMS (bagian dari desain): susunan tata letak,
warna, ikon, animasi, dan gambar slider hero.

---

## 2. Masuk ke CMS

1. Buka <https://cms.annasrkonsultan.com/admin>
2. Masukkan **email** dan **password** akun Anda.
3. Setelah masuk, Anda akan melihat menu di sisi kiri.

**Dua jenis akun:**

| Peran             | Bisa apa                                                       | Tidak bisa                                       |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| **Super Admin**   | Semua, termasuk mengelola pengguna & pengaturan sistem         | —                                                |
| **Editor Konten** | Membuat, mengubah, menerbitkan, menghapus semua konten website | Mengubah pengaturan sistem dan menambah pengguna |

> Lupa password? Hubungi Super Admin perusahaan. Jangan membuat akun baru tanpa
> koordinasi — akun lama bisa menumpuk dan sulit dilacak.

---

## 3. Tiga hal yang wajib dipahami

### a. Save ≠ Publish

| Tombol      | Arti                                                       |
| ----------- | ---------------------------------------------------------- |
| **Save**    | Menyimpan sebagai **draft**. Website **belum** berubah.    |
| **Publish** | Menerbitkan. Website langsung diperbarui (beberapa detik). |

Kalau Anda mengubah teks lalu hanya menekan **Save**, pengunjung tidak akan
melihat perubahan. Selalu **Publish** bila sudah selesai.

### b. Single Type vs Collection Type

| Jenis               | Ciri di menu                                    | Contoh                                                           |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| **Single Type**     | Hanya ada **satu** dokumen, tidak bisa menambah | Beranda, Tentang Kami, Kontak, Pengaturan Global, Navbar, Footer |
| **Collection Type** | Berisi **daftar** entri; bisa tambah/hapus      | Layanan, Proyek, Klien, Artikel, Karier, Rekanan, Redirect       |

### c. Satu baris = satu poin

Banyak kolom teks di CMS ditampilkan sebagai daftar. Aturannya:

- **Setiap baris** (tekan Enter sekali) menjadi **satu poin/paragraf**.
- **Jangan** menekan Enter dua kali di tengah satu poin — akan muncul poin kosong.
- **Jangan** menyalin-tempel dari Microsoft Word atau PDF: format tersembunyi
  ikut terbawa dan tampilan bisa berantakan. Tempel ke Notepad dulu.

Contoh untuk kolom **Keunggulan**:

```
Tim berpengalaman di bidang teknik sipil
Perizinan bangunan ditangani tuntas
Pengawasan lapangan dengan laporan berkala
```

---

## 4. Tur antarmuka admin

| Area                          | Fungsi                                                          |
| ----------------------------- | --------------------------------------------------------------- |
| **Content Manager** (kiri)    | Tempat mengelola semua konten website                           |
| **Media Library**             | Semua gambar yang diunggah                                      |
| **Daftar entri**              | Menampilkan judul, status (Draft/Published), dan tanggal        |
| **Form entri**                | Tempat mengedit isi                                             |
| **Tombol Publish / Save**     | Kanan atas form                                                 |
| **Tombol "Revalidate cache"** | Muncul di form konten, untuk memaksa situs memperbarui tampilan |

Di bagian atas form entri biasanya ada tab bahasa. Website ini hanya memakai satu
bahasa isi (Indonesia), jadi cukup isi tab yang tersedia.

---

## 5. Peta: "Saya mau ubah X, di mana?"

| Yang ingin diubah                               | Buka di CMS                                         |
| ----------------------------------------------- | --------------------------------------------------- |
| Nama brand & tagline                            | **Pengaturan Global** → Brand                       |
| Menu navbar                                     | **Navbar**                                          |
| Tombol CTA di navbar                            | **Navbar** → Primary Buttons                        |
| Isi footer & copyright                          | **Footer**                                          |
| Nomor telepon, WhatsApp, email, Instagram       | **Kontak**                                          |
| Alamat, jam operasional, peta                   | **Kontak**                                          |
| Teks hero di beranda                            | **Beranda** → Hero                                  |
| Foto & kutipan founder di beranda               | **Beranda** → Founder                               |
| Keunggulan (3–6 poin) di beranda                | **Beranda** → Keunggulan                            |
| FAQ di beranda                                  | **Beranda** → FAQ                                   |
| Banner ajakan di bawah halaman                  | **Beranda** → CTA                                   |
| Sambutan "Tentang kami"                         | **Tentang Kami** → Tentang                          |
| Statistik (mis. 120+ proyek)                    | **Tentang Kami** → Statistik                        |
| Perjalanan/tonggak sejarah                      | **Tentang Kami** → Perjalanan                       |
| Visi & misi                                     | **Tentang Kami** → Visi Misi                        |
| Founder & tim                                   | **Tentang Kami** → Founder / Tim                    |
| Peta jangkauan proyek                           | **Tentang Kami** → Jangkauan + Kota Proyek          |
| Intro judul halaman (Layanan, Portofolio, dll.) | **Pengaturan Global** → _(field intro per halaman)_ |
| Judul & deskripsi untuk Google                  | **Pengaturan Global** → SEO                         |
| Daftar layanan                                  | **Layanan** (collection)                            |
| Daftar proyek                                   | **Proyek** (collection)                             |
| Logo klien                                      | **Klien** (collection)                              |
| Artikel & unggulan                              | **Artikel** (collection)                            |
| Lowongan kerja                                  | **Karier** (collection)                             |
| Sertifikat rekanan                              | **Rekanan** (collection)                            |
| Alamat halaman lama                             | **Redirect** (collection)                           |

---

## 6. Mengelola gambar

### Cara mengunggah

1. Di form entri, klik kolom gambar → **Add new assets** (atau pilih dari Media Library).
2. Pilih file dari komputer → **Upload**.
3. **Isi "Alternative text"** dengan deskripsi singkat gambar (penting untuk SEO
   dan pembaca layar). Contoh: `Kantor CV An Nasr Konsultan di Jombang`.

### Ukuran ideal

| Jenis gambar                        | Lebar disarankan | Rasio                         |
| ----------------------------------- | ---------------- | ----------------------------- |
| Foto hero / banner                  | 1600–1920 px     | 16:9 atau 21:9                |
| Foto founder / tim                  | 800–1200 px      | 3:4 (potret)                  |
| Gambar kartu layanan/proyek/artikel | 1200 px          | 4:3                           |
| Logo klien                          | 400 px           | bebas, latar transparan (PNG) |
| Galeri layanan                      | 1200 px          | bebas                         |

> **Kompres dulu** sebelum upload (mis. TinyPNG). Foto 5 MB dari kamera akan
> memperlambat website secara signifikan. Target: di bawah 400 KB per gambar.

### Batasan

- **Galeri layanan maksimal 8 gambar.** Sistem akan menolak jika lebih; kurangi
  jumlahnya terlebih dahulu.
- Format yang aman: **JPG, PNG, WebP**. Hindari SVG untuk foto.

---

## 7. Konten per bagian

### 7.1 Pengaturan Global — pusat semua halaman

Single type ini mengatur hal yang dipakai di banyak tempat:

| Grup field                              | Fungsi                                                                                                                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brand** (`brandNama`, `brandTagline`) | Nama & tagline perusahaan di navbar/footer/SEO default                                                                                                                       |
| **Navigasi** (`navigasi`)               | Daftar menu utama + submenu (label, href, anak)                                                                                                                              |
| **SEO** (`seo`)                         | Judul & deskripsi Google **per halaman** (beranda, tentang, layanan, portofolio, klien, artikel, karier, kontak)                                                             |
| **Eyebrow**                             | Label kecil di atas judul tiap section                                                                                                                                       |
| Intro per halaman                       | `layananIntro*`, `portfolioHero*`, `klienHero*`, `artikel*`, `karirHero*`, `perjalanan*`, `visiMisi*`, `tim*`, `rekananIntro*`, `keunggulan*`, `proses*`, `faq*`, `founder*` |

**Tips SEO per halaman:**

- Judul: 50–60 karakter, mengandung kata kunci + lokasi
  → `Jasa Perencanaan Konstruksi Jombang | An Nasr`
- Deskripsi: 140–160 karakter, menjelaskan layanan + alasan memilih
- Jangan mengisi semua halaman dengan judul yang sama.

### 7.2 Beranda

| Bagian     | Field                                                                      | Catatan                                |
| ---------- | -------------------------------------------------------------------------- | -------------------------------------- |
| Hero       | `eyebrow`, `judul`, `deskripsi`, `keunggulan`, `gambar`                    | `keunggulan` = satu poin per baris     |
| Founder    | `eyebrow`, `nama`, `jabatan`, `teks`, `kutipan`, `foto`, `gambarPendukung` | Kutipan tampil sebagai blockquote      |
| Keunggulan | `judul`, `teks` (repeatable)                                               | Tampil sebagai kartu; ikon otomatis    |
| FAQ        | `tanya`, `jawab` (repeatable)                                              | Juga dikirim ke Google sebagai FAQPage |
| CTA        | `eyebrow`, `judul`, `deskripsi`, `telepon`                                 | Banner ajakan di bawah halaman         |

### 7.3 Tentang Kami

Bagian yang tersedia: **Hero**, **Tentang** (judul + deskripsi + daftar),
**Gambar Tentang**, **Statistik** (nilai + label), **Perjalanan** (tahun, judul,
teks), **Visi Misi** (judul, teks), **Founder**, **Tim** (nama, jabatan, foto,
LinkedIn), **Jangkauan** (judul, deskripsi), **Kota Proyek** (nama, lat, lng).

> **Tombol LinkedIn** hanya muncul jika kolom `linkedin` diisi URL lengkap
> (mis. `https://www.linkedin.com/in/nama`). Jika kosong, tombol disembunyikan.

> **Kota proyek** mengisi peta jangkauan. `lat` dan `lng` adalah koordinat
> desimal (contoh Jombang: `-7.5460`, `112.2260`). Ambil dari Google Maps →
> klik kanan lokasi → salin angka pertama (lat) dan kedua (lng).

### 7.4 Layanan — menambah layanan baru

1. **Content Manager → Layanan → Create new entry**
2. Isi:
   - **Judul** — nama layanan, mis. `Jasa Perencanaan Konstruksi`
   - **Slug** — bagian URL, huruf kecil dan tanda hubung: `jasa-perencanaan-konstruksi`
   - **Ringkas** — 1–2 kalimat untuk kartu di daftar layanan
   - **Gambar** — gambar utama kartu
   - **Galeri** — maksimal 8 gambar
   - **Deskripsi**, **Manfaat**, **Detail** — satu poin per baris
   - **Alur** — langkah proses (judul + teks), urut dari atas
   - **Persyaratan** — kartu persyaratan (eyebrow, judul, deskripsi, daftar)
   - **Dokumen Client** — dokumen yang diterima klien
3. **Publish**.

Layanan baru **otomatis muncul** di menu navbar, dropdown, footer, daftar layanan,
dan halaman detailnya sendiri. Tidak perlu menghubungi developer.

### 7.5 Proyek (Portofolio)

Field: **nama**, **lokasi**, **kategori**, **gambar**.

- **Kategori** bebas diisi; filter di halaman portofolio dibuat otomatis dari
  kategori yang ada.
- Urutan tampil mengikuti urutan data; halaman menampilkan **9 proyek per halaman**.
- Jika gambar kosong, sistem memakai gambar default — tetapi sebaiknya selalu
  isi gambar agar konsisten.

### 7.6 Klien

Field: **nama**, **logo**. Logo sebaiknya PNG transparan, lebar ±400 px.

### 7.7 Rekanan

Field: **nama**, **instansi**, **keterangan**, **sertifikat** (gambar).
Dipakai untuk menampilkan sertifikat/kerja sama di halaman `/rekanan`.

### 7.8 Artikel

Field: **judul**, **slug**, **kategori**, **tanggal**, **penulis**, **ringkas**,
**gambar**, **isi**, **unggulan**.

- **Isi**: tulis artikel sebagai teks; **satu baris = satu paragraf**. Baris
  pertama ditampilkan dengan gaya kutipan pembuka.
- **Unggulan**: aktifkan untuk menyorot artikel di beranda.
- **Tanggal**: format `YYYY-MM-DD`, mis. `2026-11-12`.
- **Slug** harus unik; mengubah slug setelah terbit akan memutus tautan lama
  (buat entri **Redirect** bila perlu).

### 7.9 Karier (lowongan)

Field: **nama** (posisi), **tipe** (mis. `Full-time`), **lokasi**,
**statusPosisi**, **slug**, **ringkas**, **deskripsi**, **tanggungJawab**,
**kualifikasi**, **manfaat**.

**Cara menutup lowongan:** ubah **statusPosisi** menjadi `ditutup` lalu
**Publish**. Lowongan langsung hilang dari daftar dan halaman detailnya.
**Jangan menghapus** entri lama — cukup tutup, agar riwayat tetap ada.

### 7.10 Kontak

Field: **heroJudul**, **heroDeskripsi**, **domisili**, **kantor**, **telepon**,
**email**, **jamOperasional**, **instagram**, **whatsapp**, **petaEmbedUrl**,
**peta**.

Perubahan di sini langsung memengaruhi:

- Halaman `/kontak`
- Tombol WhatsApp mengambang (float) di semua halaman
- Tombol WhatsApp di navbar dan banner CTA
- Footer

**Format penting:**

| Field          | Format contoh                                               |
| -------------- | ----------------------------------------------------------- |
| `telepon`      | `+62 321 123456`                                            |
| `whatsapp`     | `6281234567890` (tanpa `+`, tanpa spasi, pakai kode negara) |
| `email`        | `info@annasrkonsultan.com`                                  |
| `instagram`    | `annasrkonsultan` (tanpa `@` dan tanpa URL)                 |
| `petaEmbedUrl` | URL embed Google Maps (Share → Embed a map → salin `src`)   |

### 7.11 Navbar & Footer

- **Navbar**: `logoImage`, `navbarItems` (label, href, anak/submenu),
  `primaryButtons` (tombol CTA).
- **Footer**: `logoImage`, `sections` (kolom), `links`, `copyRight`, `creditText`.

> Menu layanan di navbar/footer otomatis mengikuti data **Layanan**; Anda hanya
> mengatur menu non-layanan di sini.

---

## 8. Membuat perubahan terlihat di website

Alur normalnya otomatis:

```
Anda klik Publish  →  Strapi memberi tahu website  →  halaman diperbarui (beberapa detik)
```

Bila perubahan belum tampak (misalnya halaman masih menampilkan versi lama):

1. Tunggu ± 2 menit (ada cache pengaman 120 detik).
2. Buka form entri yang Anda ubah → klik tombol **Revalidate cache** di kanan atas.
3. Muat ulang halaman dengan **Ctrl/Cmd + Shift + R** (hard refresh) atau coba
   jendela **incognito** — sering kali yang lama adalah cache browser Anda sendiri.

> Perubahan pada **draft** (belum Publish) tidak akan pernah tampil di website.

---

## 9. Mengatur redirect halaman

Bila Anda mengganti slug sebuah layanan/artikel (`jasa-perencanaan` →
`perencanaan-konstruksi`), tautan lama akan mati. Perbaiki dengan:

1. **Content Manager → Redirect → Create new entry**
2. **Source**: `/layanan/jasa-perencanaan` (path lama, diawali `/`)
3. **Destination**: `/layanan/perencanaan-konstruksi` (path baru)
4. **Save**

Lakukan hal yang sama untuk artikel dan halaman yang dipindahkan.

---

## 10. Aturan penulisan konten

**Lakukan**

- Tulis singkat dan konkret: "pengalaman sejak 2009", bukan "pengalaman yang sangat luar biasa".
- Sebut lokasi (Jombang, Jawa Timur) di judul/deskripsi — membantu pencarian lokal.
- Konsisten menulis nama layanan (jangan berganti-ganti istilah).
- Isi _alt text_ pada setiap gambar.
- Satu ide per poin pada field daftar.

**Hindari**

- Menempel langsung dari Word/PDF (membawa format rusak).
- Huruf kapital semua (`JASA KAMI TERBAIK`) — terasa seperti spam.
- Menumpuk keyword di satu kalimat.
- Menghapus entri yang sudah terbit; lebih baik **unpublish**/ubah status.
- Mengubah slug tanpa membuat redirect.
- Mengunggah foto kamera tanpa dikompres.

---

## 11. Playbook cepat

### Menambah layanan baru

1. Layanan → **Create new entry**
2. Judul + slug (huruf kecil, tanda hubung)
3. Ringkas, deskripsi, manfaat, detail (satu poin per baris)
4. Gambar + galeri (maks. 8)
5. Alur & persyaratan (bila ada)
6. **Publish** → cek di `/layanan`

### Menambah proyek ke portofolio

1. Proyek → **Create new entry**
2. Nama proyek, lokasi, kategori (mis. `Jalan`, `Gedung`, `Irigasi`), gambar
3. **Publish** → cek di `/portfolio`

### Menerbitkan artikel

1. Artikel → **Create new entry**
2. Judul, slug, kategori, tanggal (`YYYY-MM-DD`), penulis, ringkas
3. Gambar (rasio 4:3) + _alt text_
4. Isi artikel (satu baris = satu paragraf)
5. Aktifkan **Unggulan** bila ingin tampil di beranda
6. **Publish** → cek di `/artikel`

### Menutup lowongan

1. Karier → buka entri posisi
2. **statusPosisi** → `ditutup`
3. **Publish**

### Mengganti nomor WhatsApp

1. Kontak → ubah `whatsapp` menjadi `628xxxxxxxxxx`
2. **Publish**
3. Cek tombol float, navbar, dan halaman kontak

---

## 12. Bantuan & eskalasi

| Situasi                                                   | Yang dilakukan                                            |
| --------------------------------------------------------- | --------------------------------------------------------- |
| Lupa password / akun terkunci                             | Hubungi Super Admin perusahaan                            |
| "Publish" berhasil tapi situs tidak berubah               | Tunggu 2 menit → **Revalidate cache** → hard refresh (§8) |
| Tombol Revalidate error                                   | Laporkan ke developer (kemungkinan secret tidak cocok)    |
| Gambar gagal diunggah                                     | Pastikan ukuran < 10 MB dan format JPG/PNG/WebP           |
| Galeri ditolak                                            | Maksimal 8 gambar — kurangi dulu                          |
| Halaman error 500/502                                     | Laporkan segera; sertakan URL dan waktu kejadian          |
| Butuh fitur baru (form database, CRM nyata, multi-bahasa) | Diskusikan sebagai pekerjaan terpisah                     |

Saat melaporkan masalah, sertakan: **URL halaman**, **waktu**, **yang dilakukan**,
dan **tangkapan layar** — ini memotong waktu perbaikan secara signifikan.

---

## 13. Lampiran: daftar field per tipe konten

<details>
<summary><strong>Beranda</strong></summary>

`hero` (eyebrow, judul, deskripsi, keunggulan, gambar) · `founder` (eyebrow,
nama, jabatan, teks, kutipan, foto, gambarPendukung) · `keunggulan` (judul, teks)
· `faq` (tanya, jawab) · `cta` (eyebrow, judul, deskripsi, telepon)

</details>

<details>
<summary><strong>Tentang Kami</strong></summary>

`hero` · `tentang` (judul, deskripsi, daftar) · `tentangGambar` · `statistik`
(nilai, label) · `perjalanan` (tahun, judul, teks) · `visiMisi` (judul, teks) ·
`founder` · `tim` (nama, jabatan, foto, linkedin) · `jangkauanJudul` ·
`jangkauanDeskripsi` · `kotaProyek` (nama, lat, lng)

</details>

<details>
<summary><strong>Layanan</strong></summary>

`judul` · `slug` · `ringkas` · `gambar` · `galeri` (maks. 8) · `deskripsi` ·
`manfaat` · `detail` · `alur` (judul, teks) · `persyaratan` (eyebrow, judul,
deskripsi, daftar) · `dokumenClient` (judul, deskripsi, gambar, daftar)

</details>

<details>
<summary><strong>Proyek</strong></summary>

`nama` · `lokasi` · `kategori` · `gambar`

</details>

<details>
<summary><strong>Klien</strong></summary>

`nama` · `logo`

</details>

<details>
<summary><strong>Rekanan</strong></summary>

`nama` · `instansi` · `keterangan` · `sertifikat`

</details>

<details>
<summary><strong>Artikel</strong></summary>

`judul` · `slug` · `kategori` · `tanggal` · `penulis` · `ringkas` · `gambar` ·
`isi` · `unggulan`

</details>

<details>
<summary><strong>Karier</strong></summary>

`nama` · `tipe` · `lokasi` · `statusPosisi` (`terbuka` / `ditutup`) · `slug` ·
`ringkas` · `deskripsi` · `tanggungJawab` · `kualifikasi` · `manfaat`

</details>

<details>
<summary><strong>Kontak</strong></summary>

`heroJudul` · `heroDeskripsi` · `domisili` · `kantor` · `telepon` · `email` ·
`jamOperasional` · `instagram` · `whatsapp` · `petaEmbedUrl` · `peta`

</details>

<details>
<summary><strong>Pengaturan Global</strong></summary>

`brandNama` · `brandTagline` · `navigasi` · `seo` (per halaman) · puluhan field
intro/eyebrow per halaman (`keunggulan*`, `layananIntro*`, `proses*`,
`portfolioHero*`, `klienHero*`, `artikel*`, `faq*`, `karirHero*`, `perjalanan*`,
`visiMisi*`, `tim*`, `rekananIntro*`, `founder*`, `proyek*`, `jangkauan*`, `cta*`)

</details>

<details>
<summary><strong>Navbar & Footer</strong></summary>

**Navbar:** `logoImage` · `navbarItems` (label, href, anak) · `primaryButtons`
**Footer:** `logoImage` · `sections` · `links` · `copyRight` · `creditText`

</details>
