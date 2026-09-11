# Rekap QA Compro An Nasr — 1 Tabel (per Module)

Tanggal rekap: 2026-09-10 · Total: **57 baris · 56 issue nyata** (1 baris #20 kosong).

**Legenda status:**

| Label | Arti                                                                                         |
| ----- | -------------------------------------------------------------------------------------------- |
| ✅    | Selesai di kode (commit + lolos typecheck/test/lint) — belum tentu live, butuh deploy        |
| ✅ ⏳ | Kode selesai + menunggu isi data CMS (field baru kosong → fallback statis) dan/atau deploy   |
| 📋    | Dokumentasi / perlu konfirmasi (bukan bug kode; data sudah bisa dikelola di tempat tertentu) |
| ✅ 📋 | Kode selesai + catatan di mana mengelola datanya di CMS                                      |
| ⏳    | Butuh retest / akar masalah belum dipastikan (mis. belum ada evidence visual)                |

| #   | Module  | Issue                                           | Expected            | Actual                 | Aksi                                                                              | Status |
| --- | ------- | ----------------------------------------------- | ------------------- | ---------------------- | --------------------------------------------------------------------------------- | ------ |
| 1   | Beranda | Tampilan icon tidak konsisten                   | icon konsisten      | icon berbeda           | Semua poin keunggulan pakai `<Check>` seragam                                     | ✅     |
| 2   | Beranda | Field keunggulan hero tampil code editor        | bukan code editor   | code editor JSON       | `keunggulan` `json`→`text` (textarea) + migrasi                                   | ✅     |
| 3   | Beranda | Logo klien tidak tampil                         | logo tampil         | tidak tampil           | Media `/uploads`→`/api/asset` (host `strapi:1337` tidak bocor)                    | ✅     |
| 4   | Beranda | Founder tidak sesuai CMS                        | sesuai CMS          | tidak sesuai           | `FounderSection` bind nama/jabatan/teks/foto dari CMS Beranda                     | ✅     |
| 5   | Beranda | Keunggulan manage di CMS bagian mana?           | ada field           | tidak ada field        | Tambah field `keunggulan` (repeatable `annasr.alasan`) di Beranda                 | ✅ ⏳  |
| 6   | Beranda | Layanan ambil dari beranda atau menu layanan?   | perlu konfirmasi    | dari Layanan           | Homepage pakai **Beranda.layanan**                                                | ✅ ⏳  |
| 7   | Beranda | Gambar proyek tidak tampil                      | gambar tampil       | tidak tampil           | Perbaikan media global                                                            | ✅     |
| 8   | Beranda | Proyek ambil dari portfolio beranda atau menu?  | perlu konfirmasi    | dari beranda           | Dikonfirmasi tetap **Beranda.portfolio**                                          | ✅     |
| 9   | Beranda | Jangkauan proyek beda dengan CMS                | sesuai CMS          | tidak sesuai           | Pakai `beranda.kotaProyek` + `jangkauanJudul/Deskripsi` + stat dari Beranda       | ✅ ⏳  |
| 10  | Beranda | Artikel manage dari mana? (tak ada di Beranda)  | ada field           | tidak ada field        | Tambah field `artikel` (repeatable `annasr.artikel-item`) di Beranda              | ✅ ⏳  |
| 11  | Beranda | Field FAQ diberi title                          | ada title           | tidak ada title        | `tanya` `text`→`string` + migrasi                                                 | ✅     |
| 12  | Layanan | Jasa baru tak muncul di dropdown (hanya footer) | muncul di dropdown  | tidak muncul           | Dropdown Navbar "Layanan" pakai daftar layanan live CMS                           | ✅     |
| 13  | Layanan | Gambar & galeri tidak tampil                    | tampil              | tidak tampil           | Media proxy fix                                                                   | ✅     |
| 14  | Layanan | Galeri maksimal berapa foto?                    | perlu konfirmasi    | 10 foto, memanjang     | Tampilan dibatasi maks 8 foto (1 besar + grid)                                    | ✅     |
| 15  | Layanan | Manfaat & detail lingkup code editor            | bukan code editor   | code editor            | `detail`/`manfaat` `json`→`text` + migrasi                                        | ✅     |
| 16  | Layanan | Alur input 2, wording tampil 6                  | sesuai input        | wording "Enam langkah" | Wording dinamis mengikuti jumlah alur CMS                                         | ✅     |
| 17  | Layanan | Persyaratan code editor                         | bukan code editor   | code editor            | `persyaratan.daftar` `json`→`text` + migrasi                                      | ✅     |
| 18  | Layanan | Gambar "diterima klien" tak muncul              | tampil              | tidak tampil           | Media proxy fix                                                                   | ✅     |
| 19  | Layanan | Daftar "diterima klien" code editor             | bukan code editor   | code editor            | `dokumenClient.daftar` `json`→`text` + migrasi                                    | ✅     |
| 20  | Layanan | Alur mobile tanpa panah (web ada)               | perlu konfirmasi    | panah hanya web        | Panah vertikal ditambahkan utk mobile                                             | ✅     |
| 21  | Proyek  | Title "portfolio" bukan baku Indonesia          | portofolio          | portfolio              | Dijadikan **"Portofolio"**                                                        | ✅     |
| 22  | Proyek  | Kategori baru tak tampil di filter              | kategori CMS muncul | tidak muncul           | Filter kategori di-derive dari data proyek                                        | ✅     |
| 23  | Proyek  | Gambar proyek tidak tampil                      | tampil              | tidak tampil           | Media proxy fix                                                                   | ✅     |
| 24  | Proyek  | Pagination maksimal berapa per page?            | perlu konfirmasi    | per evidence           | Dikonfirmasi tetap 9/halaman                                                      | 📋     |
| 25  | Proyek  | "Dipercaya berbagai klien" manage di mana?      | perlu konfirmasi    | per evidence           | Data = **CMS Beranda → klien**                                                    | 📋     |
| 26  | Proyek  | Jangkauan proyek manage di mana?                | perlu konfirmasi    | per evidence           | Kelola di **Tentang** (jangkauan\*/kota/statistik); kartu stat dari CMS           | ✅ 📋  |
| 27  | Tentang | Keunggulan di CMS tampil code editor            | bukan code editor   | code editor            | `annasr.hero.keunggulan` `json`→`text` (komponen bersama) + migrasi               | ✅     |
| 28  | Tentang | "Tentang kami" manage di mana?                  | ada field           | tidak ditemukan        | `TentangInti` konsumsi CMS **Tentang → tentang** (judul/deskripsi/daftar)         | ✅ ⏳  |
| 29  | Tentang | Button "Portfolio" tidak baku                   | Portofolio          | Portfolio              | Dijadikan **"Portofolio"**                                                        | ✅     |
| 30  | Tentang | "Perjalanan kami" manage di mana?               | perlu konfirmasi    | tidak ditemukan        | Field `perjalanan` (`Tonggak Perjalanan`) sudah ada di CMS                        | 📋     |
| 31  | Tentang | Title visi misi manage di mana?                 | perlu konfirmasi    | tidak ditemukan        | Field `visiMisi` sudah ada (judul kartu dari CMS)                                 | 📋     |
| 32  | Tentang | Section founder tak sinkron CMS                 | sinkron             | tidak sinkron          | `Founder.tsx` pakai `data.nama/teks/kutipan` CMS                                  | ✅     |
| 33  | Tentang | Foto founder manage di mana?                    | ada field foto      | tidak ada field        | Field `foto` di `annasr.founder` + dirender                                       | ✅ ⏳  |
| 34  | Tentang | Wording tim kami miring (web)                   | lurus               | miring                 | ⏳ butuh retest + evidence                                                        | ⏳     |
| 35  | Tentang | Foto tim tidak tampil                           | tampil              | tidak tampil           | `TimTentang` render foto bila ada + media fix                                     | ✅     |
| 36  | Tentang | Button LinkedIn belum ada data/href             | ada data & mengarah | belum                  | Tombol muncul hanya bila `linkedin` terisi → URL LinkedIn                         | ✅ ⏳  |
| 37  | Tentang | Kotak jangkauan ukuran tak sinkron + manage?    | sinkron + ada field | tidak sinkron          | Kartu statistik dari CMS **statistik**                                            | ✅ ⏳  |
| 38  | Tentang | Kotak jangkauan mobile tidak rapi               | rapi                | tidak rapi             | `grid-cols-3`→`grid-cols-1 sm:grid-cols-3`                                        | ✅     |
| 39  | Rekanan | Foto sertifikat tidak tampil                    | tampil              | tidak tampil           | Media proxy fix (`rekanan.ts`)                                                    | ✅     |
| 40  | Rekanan | Wording rekanan manage di mana?                 | perlu konfirmasi    | tidak ditemukan        | Field `rekananIntroJudul/Deskripsi` di **Pengaturan Global**                      | ✅ ⏳  |
| 41  | Artikel | Wording artikel tak sinkron CMS                 | sinkron             | tidak sinkron          | `teks` hero dari `artikelHero.deskripsi` (CMS)                                    | ✅ ⏳  |
| 42  | Artikel | Artikel unggulan manage di mana?                | ada feature         | tidak ada              | Boolean **`unggulan`** di `artikel-item`                                          | ✅ ⏳  |
| 43  | Artikel | Gambar list artikel tak muncul                  | tampil              | tidak tampil           | Media proxy fix                                                                   | ✅     |
| 44  | Artikel | Gambar detail artikel tak muncul                | tampil              | tidak tampil           | Media proxy fix                                                                   | ✅     |
| 45  | Artikel | Field isi tampil text editor, harus JSON        | bukan code editor   | code editor            | `isi` `json`→`text` + migrasi (+ field `unggulan`)                                | ✅     |
| 46  | Karir   | Lowongan ditutup masih tampil & bisa akses      | perlu konfirmasi    | masih tampil           | Posisi `ditutup` disembunyikan dari daftar                                        | ✅     |
| 47  | Karir   | Deskripsi pekerjaan justify                     | rapi                | kurang rapi            | `text-justify`                                                                    | ✅     |
| 48  | Karir   | Icon bintang tak lurus (mobile)                 | sejajar             | tidak sejajar          | `items-start` + icon `shrink-0`                                                   | ✅     |
| 49  | Kontak  | Nomor telepon dummy                             | valid               | dummy                  | Halaman + tombol baca **CMS Kontak** (isi data asli)                              | ✅ ⏳  |
| 50  | Kontak  | Email dummy                                     | perlu konfirmasi    | @email.com             | Baca **CMS Kontak** (isi data asli)                                               | ✅ ⏳  |
| 51  | Kontak  | Nomor WhatsApp dummy                            | valid               | dummy                  | Baca **CMS Kontak** (isi data asli)                                               | ✅ ⏳  |
| 52  | Kontak  | Username Instagram tidak tersedia               | valid               | not found              | Baca **CMS Kontak** (isi data asli)                                               | ✅ ⏳  |
| 53  | Kontak  | Button konsultasi/chat masih WA dummy           | valid               | dummy                  | Baca **CMS Kontak** (isi data asli)                                               | ✅ ⏳  |
| 54  | Kontak  | Update CMS cuma kena footer, halaman tidak      | halaman update      | hanya footer           | Hero + `KontakSection` kini ambil dari **CMS Kontak**                             | ✅     |
| 55  | Footer  | List jasa tak sinkron menu vs layanan           | sinkron             | tidak sinkron          | Menu & footer sama-sama pakai daftar layanan CMS                                  | ✅     |
| 56  | Footer  | Wording & kontak footer manage di mana?         | ada field           | tidak ada field        | Kelola: **Footer** (sections/copyRight) · **Global** (brand/tagline) · **Kontak** | 📋     |

## Follow-up putaran 2 (v3.7.9) — hasil retest QA

| #   | Module  | Follow-up                                          | Aksi                                                                                                                       | Status |
| --- | ------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| 4   | Beranda | Founder: kutipan tidak tampil di web               | `FounderSection` kini render blockquote kutipan (dari CMS, fallback statis)                                                | ✅     |
| 9   | Beranda | Jangkauan harus sinkron & maintain via CMS proyek  | Satu sumber: **Tentang** dipakai utk semua halaman (Beranda + `/portfolio` + Tentang); kartu stat dari `tentang.statistik` | ✅ 📋  |
| 1   | Beranda | Icon jasa belum konsisten                          | Ikon layanan kini per-slug stabil (`ikonLayanan`) — tidak nempel urutan                                                    | ✅     |
| 6   | Beranda | Detail layanan 404 & tidak muncul di navbar/footer | Homepage pakai **single type Layanan** (sama dgn navbar/footer/list/detail) → satu katalog                                 | ✅     |
| 8   | Beranda | Proyek tambahan tak muncul di "Semua Proyek"       | Homepage pakai **single type Portfolio** (sama dgn `/portfolio`) → satu katalog                                            | ✅     |
| 11  | Beranda | FAQ masih tanpa title di admin                     | Seeder `mainField` Content-Manager (`faq→tanya` + field komponen lain)                                                     | ✅ ⏳  |
| 14  | Layanan | Galeri genap & limit di CMS                        | Guard CMS maks 8 file + grid rapi (item ganjil dilebarkan)                                                                 | ✅     |
| 17  | Layanan | Persyaratan: "satu kata" nempel di baris sendiri   | ⏳ kemungkinan isi teks CMS (newline) — perlu dipastikan teksnya                                                           | ⏳     |
| 20  | Layanan | Panah mobile kurang rapi                           | Panah mobile dipindah ke dalam kartu (bukan absolute)                                                                      | ✅     |
| 24  | Proyek  | Page 2 tanpa gambar + butuh scroll ke section      | Default gambar bila CMS kosong + `scrollIntoView` ke `#proyek` saat ganti halaman/kategori                                 | ✅     |
| 26  | Proyek  | Kartu jangkauan 3 tampil (5 input) + size beda     | Tetap maks 3 kartu (dokumentasi) + tinggi kartu disamakan                                                                  | ✅ 📋  |

> Catatan: field `beranda.layanan`/`beranda.portfolio`/`beranda.kotaProyek`/`beranda.jangkauan*` kini tidak dipakai halaman (katalog dikelola di single type Layanan/Portfolio/Tentang).

---

## Catatan

- **Fix infrastruktur**: media `/uploads`→`/api/asset` (beranda/konten/rekanan) · 6 migrasi DB (`detail`, `manfaat`, `persyaratan.daftar`, `dokumenClient.daftar`, `artikel.isi`, `hero.keunggulan` `json`→`text`; `faq.tanya` `text`→`string`) · CI tag build kini publish `:latest` · verifikasi typecheck + tes **72/72** + lint 0 error.
- **Deploy**: `v3.7.8` build ✅ → deploy VPS ✅ → live masih kode lama karena `.env` server mem-pin image lama. Langkah terakhir di server:

```bash
cd /opt/mono-annasr-konsultan/deploy
sed -i 's|IMAGE_STRAPI=.*|IMAGE_STRAPI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-strapi:latest|; s|IMAGE_UI=.*|IMAGE_UI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-ui:latest|' .env
docker compose pull ui strapi
docker compose up -d
```
