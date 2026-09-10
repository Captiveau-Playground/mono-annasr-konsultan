# Rekap QA Compro An Nasr — Semua Temuan & Aksi Perbaikan

Tanggal rekap: 2026-09-10 · Status: ✅ selesai di kode · ⏳ butuh isi data CMS/retest · 📋 dokumentasi/konfirmasi.

## Total Issue

| Group                                            | Jumlah                           |
| ------------------------------------------------ | -------------------------------- |
| Batch 1 — Beranda                                | 11                               |
| Batch 2 — Layanan                                | 9                                |
| Batch 2 — Proyek                                 | 6                                |
| Batch 2 — Profil (Tentang/Artikel/Rekanan/Karir) | 23 (1 baris `#20 search` kosong) |
| Batch 2 — Kontak                                 | 6                                |
| Batch 2 — Footer                                 | 2                                |
| **Total**                                        | **57 baris · 56 issue nyata**    |

---

## Batch 1 — Beranda (11)

| #   | Issue                                     | Aksi                                                                      |
| --- | ----------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Icon hero tidak konsisten                 | Semua poin keunggulan pakai `<Check>` seragam (`Hero.tsx`)                |
| 2   | Keunggulan hero di CMS tampil code editor | `keunggulan` `json`→`text` (textarea) + migrasi                           |
| 3   | Logo klien tidak tampil                   | Media `/uploads`→`/api/asset` (host `strapi:1337` tidak bocor)            |
| 4   | Founder tidak sesuai CMS                  | `FounderSection` bind nama/jabatan/teks/foto dari CMS Beranda             |
| 5   | Keunggulan tak bisa di-manage di Beranda  | Field `keunggulan` (repeatable `annasr.alasan`) di Beranda                |
| 6   | Layanan ambil dari Beranda/menu Layanan?  | Homepage pakai **Beranda.layanan**                                        |
| 7   | Gambar proyek tidak tampil                | Perbaikan media global                                                    |
| 8   | Proyek ambil dari Beranda/menu portfolio? | Tetap **Beranda.portfolio**                                               |
| 9   | Jangkauan beda dengan CMS                 | Pakai `beranda.kotaProyek` + `jangkauanJudul/Deskripsi` + stat di Beranda |
| 10  | Artikel tak bisa di-manage di Beranda     | Field `artikel` (repeatable `annasr.artikel-item`) di Beranda             |
| 11  | FAQ tak punya title di admin              | `tanya` `text`→`string` + migrasi                                         |

## Batch 2 — Layanan (9)

| #   | Issue                                          | Aksi                                                                   |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Jasa baru tak muncul di dropdown, hanya footer | Dropdown Navbar "Layanan" pakai daftar layanan live CMS (`layananNav`) |
| 2   | Gambar & galeri tidak tampil                   | Media proxy fix                                                        |
| 3   | Galeri maksimal berapa?                        | Tampilan dibatasi maks 8 foto                                          |
| 4   | Manfaat & detail lingkup code editor           | `detail`/`manfaat` `json`→`text` + migrasi                             |
| 5   | Alur input 2, wording tampil 6                 | Wording dinamis `{jumlah langkah}`                                     |
| 6   | Persyaratan code editor                        | `persyaratan.daftar` `json`→`text` + migrasi                           |
| 7   | Gambar "diterima klien" tak muncul             | Media proxy fix                                                        |
| 8   | Daftar "diterima klien" code editor            | `dokumenClient.daftar` `json`→`text` + migrasi                         |
| 9   | Alur mobile tanpa panah                        | Panah vertikal di mobile                                               |

## Batch 2 — Proyek (6)

| #   | Issue                                     | Aksi                                                |
| --- | ----------------------------------------- | --------------------------------------------------- |
| 1   | Title "portfolio" tidak baku              | → **"Portofolio"**                                  |
| 2   | Kategori baru tak jadi filter             | Filter dicek dari data proyek (bukan daftar statis) |
| 3   | Gambar proyek tidak tampil                | Media proxy fix                                     |
| 4   | Pagination maksimal berapa?               | Tetap 9/halaman (📋)                                |
| 5   | "Dipercaya berbagai klien" manage di mana | Data = **CMS Beranda → klien** (📋)                 |
| 6   | Jangkauan proyek manage di mana           | Kelola di **Tentang**; kartu stat dari CMS (📋)     |

## Batch 2 — Profil (22 issue nyata dari 23 baris)

| #   | Group   | Issue                             | Aksi                                                                      |
| --- | ------- | --------------------------------- | ------------------------------------------------------------------------- |
| 1   | Tentang | Keunggulan code editor            | `annasr.hero.keunggulan` `json`→`text` (komponen bersama) + migrasi       |
| 2   | Tentang | "Tentang kami" tak bisa di-manage | `TentangInti` konsumsi CMS **Tentang → tentang** (judul/deskripsi/daftar) |
| 3   | Tentang | Button "Portfolio"                | → **"Portofolio"**                                                        |
| 4   | Tentang | Perjalanan manage di mana         | Field `perjalanan` (`Tonggak Perjalanan`) sudah ada (📋)                  |
| 5   | Tentang | Title visi misi manage            | Field `visiMisi` sudah ada (📋)                                           |
| 6   | Tentang | Founder tidak sinkron             | `Founder.tsx` pakai `data.nama/teks/kutipan` CMS                          |
| 7   | Tentang | Foto founder tak bisa di-manage   | Field `foto` di `annasr.founder` + dirender                               |
| 8   | Tentang | Wording tim miring (web)          | ⏳ butuh retest + evidence                                                |
| 9   | Tentang | Foto tim tidak tampil             | `TimTentang` render foto bila ada + media fix                             |
| 10  | Tentang | Button LinkedIn tanpa data/href   | Tombol hanya muncul bila `linkedin` terisi → URL LinkedIn                 |
| 11  | Tentang | Kotak jangkauan size tak sinkron  | Kartu stat dari CMS `statistik`                                           |
| 12  | Tentang | Kotak mobile tak rapi             | `grid-cols-1 sm:grid-cols-3`                                              |
| 13  | Rekanan | Foto sertifikat tak tampil        | Media proxy fix (`rekanan.ts`)                                            |
| 14  | Rekanan | Wording rekanan manage            | Field `rekananIntroJudul/Deskripsi` di Pengaturan Global                  |
| 15  | Artikel | Wording artikel tak sinkron       | `teks` hero dari `artikelHero.deskripsi`                                  |
| 16  | Artikel | Artikel unggulan manage           | Boolean `unggulan` di `artikel-item`                                      |
| 17  | Artikel | Gambar list artikel tak muncul    | Media proxy fix                                                           |
| 18  | Artikel | Gambar detail artikel tak muncul  | Media proxy fix                                                           |
| 19  | Artikel | Field isi seperti code editor     | `isi` `json`→`text` + migrasi (+ `unggulan`)                              |
| 20  | —       | _(baris kosong "search")_         | N/A                                                                       |
| 21  | Karir   | Lowongan ditutup masih tampil     | Posisi `ditutup` disembunyikan dari daftar                                |
| 22  | Karir   | Deskripsi justify                 | `text-justify`                                                            |
| 23  | Karir   | Icon bintang tak lurus (mobile)   | `items-start` + `shrink-0`                                                |

## Batch 2 — Kontak (6)

| #   | Issue                       | Aksi                                                     |
| --- | --------------------------- | -------------------------------------------------------- |
| 1–5 | Telepon/email/WA/IG dummy   | Halaman + form WA baca **CMS Kontak** (⏳ isi data asli) |
| 6   | Update CMS cuma kena footer | Hero + `KontakSection` ambil dari **CMS Kontak**         |

## Batch 2 — Footer (2)

| #   | Issue                                 | Aksi                                                                                  |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | List jasa tak sinkron menu vs layanan | Menu & footer sama-sama pakai daftar layanan CMS                                      |
| 2   | Wording & kontak footer manage        | Kelola: Footer (sections/copyRight) · Pengaturan Global (brand/tagline) · Kontak (📋) |

---

## Fix Infrastruktur

1. **Media global** — `/uploads` → proxy `/api/asset` di `beranda.ts`, `konten.ts`, `rekanan.ts` (memperbaiki semua "gambar tidak tampil").
2. **6 file migrasi DB** (`apps/strapi/database/migrations/`): `detail`, `manfaat`, `persyaratan.daftar`, `dokumenClient.daftar`, `artikel.isi`, `hero.keunggulan` (`json`→`text`) + `faq.tanya` (`text`→`string`) + konversi data.
3. **CI** — build tag kini publish `:latest`.
4. **Verifikasi** — typecheck UI & Strapi ✅, tes 72/72 ✅, lint 0 error.

## Status Deploy

`v3.7.8` → build ✅ → deploy VPS ✅ → **live masih kode lama** karena `.env` server mem-pin image lama. Langkah terakhir di server:

```bash
cd /opt/mono-annasr-konsultan/deploy
sed -i 's|IMAGE_STRAPI=.*|IMAGE_STRAPI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-strapi:latest|; s|IMAGE_UI=.*|IMAGE_UI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-ui:latest|' .env
docker compose pull ui strapi
docker compose up -d
```
