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

## Follow-up QA (Need Confirm & Need Refixing) → v3.7.9

| Ref # | Module  | Status QA     | Follow-up                                                                  | Aksi yang dikerjakan                                                                                                                  | Status |
| ----- | ------- | ------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 4     | Beranda | Need Confirm  | Founder: field selain kutipan DONE, tapi **kutipan tidak tampil di web**   | `FounderSection` (beranda) kini render blockquote kutipan dari CMS (fallback statis)                                                  | ✅     |
| 9     | Beranda | Need Confirm  | Jangkauan minta diambil dari CMS proyek biar sinkron + info di CMS Beranda | Jangkauan dipakai **satu sumber Tentang** di semua halaman (Beranda, `/portfolio`, Tentang); kartu stat dari `tentang.statistik`      | ✅     |
| 14    | Layanan | Need Confirm  | Galeri: grid better genap + field CMS dibatasin (masih bisa pilih >7)      | Guard document-middleware: maks **8 file** di CMS; UI grid rapi (≤8 thumbnail, item ganjil dilebarkan)                                | ✅     |
| 17    | Layanan | Need Confirm  | Persyaratan: "satu kata diajukan" nempel di baris sendiri                  | ⏳ kemungkinan isi teks CMS (newline di dalam item) — perlu dipastikan teks persisnya                                                 | ⏳     |
| 26    | Proyek  | Need Confirm  | Jangkauan: 5 input hanya muncul 3 + ukuran kotak beda tergantung isi teks  | Tetap maks 3 kartu (dokumentasi) + **tinggi kartu disamakan** (`h-full` + `justify-center`)                                           | ✅     |
| 1     | Beranda | Need Refixing | Icon keunggulan DONE, tapi **icon jasa belum konsisten**                   | Ikon layanan kini **per-slug stabil** (`ikonLayanan`) — tidak berubah saat urutan/jumlah layanan di CMS berubah                       | ✅     |
| 6     | Beranda | Need Refixing | Detail layanan **404**; layanan baru tak muncul di navbar/footer           | Homepage pakai **single type Layanan** (sama dgn navbar/footer/list/detail) → satu katalog, detail tidak 404                          | ✅     |
| 8     | Beranda | Need Refixing | Proyek baru di CMS beranda tak muncul di "Semua Proyek"                    | Homepage pakai **single type Portfolio** (sama dgn `/portfolio`) → satu katalog                                                       | ✅     |
| 11    | Beranda | Need Refixing | FAQ di CMS **masih tanpa title**                                           | Seeder `mainField` Content-Manager (`faq→tanya` + field komponen lain di semua single type) — berlaku setelah deploy & restart Strapi | ✅ ⏳  |
| 20    | Layanan | Need Refixing | Panah mobile kurang rapi                                                   | Panah mobile dipindah ke **dalam kartu** (bukan absolute)                                                                             | ✅     |
| 24    | Proyek  | Need Refixing | Page 2 tanpa gambar (CMS kosong) + next page perlu scroll ke atas          | **Default gambar** `proyek-gedung.jpg` bila CMS kosong + `scrollIntoView` ke `#proyek` saat ganti halaman/kategori                    | ✅     |

> Semua dikerjakan di commit `eefad2f` (tag **v3.7.9**). ⏳ #17 menunggu konfirmasi isi teks CMS dari QA; #11 perlu deploy + restart Strapi agar seeder `mainField` aktif di admin.
> Catatan: field `beranda.layanan`/`beranda.portfolio`/`beranda.kotaProyek`/`beranda.jangkauan*` kini tidak dipakai halaman (katalog dikelola di single type Layanan/Portfolio/Tentang).

---

## Audit coverage CMS ↔ FE (satu sumber per section)

Menyelesaikan single-source di seluruh halaman legacy + menutup bagian FE yang sebelumnya hardcoded:

| Perubahan                     | Detail                                                                                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Artikel satu sumber**       | Homepage kini baca `artikel` (single type) — sama dengan `/artikel` & `/artikel/[slug]`. Field duplikat `beranda.artikel` dihapus.                                                                                               |
| **Klien satu sumber**         | Homepage dan `/klien` baca `klien` (single type, dengan logo). `beranda.klien` dihapus.                                                                                                                                          |
| **Field beranda dibersihkan** | `statistik`, `layanan`, `portfolio`, `klien`, `kotaProyek`, `jangkauanJudul/Deskripsi`, `artikel` dihapus dari schema (migrasi `20260917_beranda_single_source_cleanup.js`). Beranda hanya: hero, founder, keunggulan, faq, cta. |
| **WhatsApp float**            | `WhatsAppFloat` kini baca `kontak.whatsapp` dari CMS (sebelumnya hardcoded `perusahaan.whatsapp`).                                                                                                                               |
| **Halaman `/klien`**          | `PageHero` ← `klienHero`, `KlienSection` ← `klien.klien`, `PetaSection` ← `tentang.kotaProyek` (sebelumnya hardcoded / kosong).                                                                                                  |
| **CTA banner**                | Semua halaman dalam (`layanan`, `tentang`, `portfolio`, `klien`, detail) kini pakai `beranda.cta` dari CMS, bukan teks default.                                                                                                  |
| **Heading section**           | `KlienSection` & `PetaSection` menerima judul dari CMS (`klienHero.judul`, `tentang.jangkauanJudul`) dengan fallback.                                                                                                            |
| **SEO per halaman**           | Komponen `annasr.seo-meta` (+ field `situs.seo`) — judul & deskripsi meta per halaman di-manage di CMS dengan fallback ke default FE. Semua halaman legacy kini `generateMetadata` dari CMS.                                     |
| **Tetap statis (sengaja)**    | Gambar slider Hero, logo navbar/footer, dan heading-sub adalah aset desain FE (bukan konten).                                                                                                                                    |

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

---

## Single type vs Collection type (pemisahan arsitektur CMS)

Mengikuti arahan: **single type = konfigurasi halaman, collection type = daftar konten** (tiap item dokumen sendiri di admin). Konversi dilakukan & diuji live dengan Docker:

| Tipe                                               | Sebelum                                                  | Sesudah                                                                                                             |
| -------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Layanan                                            | single type + komponen `layanan` (4 kartu dalam 1 entri) | **collection** `layanans` — 1 layanan = 1 dokumen (slug, gambar, galeri, alur, persyaratan, dokumenClient)          |
| Portfolio                                          | single type + `proyek`                                   | **collection** `portfolios` (nama, instansi, lokasi, kategori, gambar)                                              |
| Klien                                              | single type + `klien`                                    | **collection** `kliens` (nama, logo)                                                                                |
| Karir                                              | single type + `posisi`                                   | **collection** `karirs` (tiap lowongan = dokumen; `status` → `statusPosisi` karena reserved)                        |
| Artikel                                            | single type + `artikel`                                  | **collection** `artikels` (judul, slug, isi, unggulan, gambar)                                                      |
| Intro halaman (heroJudul, introJudul, proses, dsb) | di single type masing-masing                             | **pindah ke `situs` (Pengaturan Global)** — 1 entri berisi intro tiap halaman + proses + navigasi + SEO per halaman |
| Yang tetap single type                             | —                                                        | `Beranda`, `Tentang`, `Kontak`, `Pengaturan Global` (situs), `Navbar`, `Footer`                                     |
| Collection lain (tetap)                            | —                                                        | `Rekanan`, `Page`, `Redirect`, `Subscriber`                                                                         |

**Mekanika teknis**

- Migrasi data aman: `20260917_convert_lists_to_collections.js` meng-copy komponen lama ke staging `_mig_*` SEBELUM schema sync, lalu bootstrap `src/utils/lift-lists.ts` membuat dokumen collection dari staging (idempotent; skip bila sudah terisi).
- REST collection bentuk plural: `/api/layanans`, `/api/portfolios`, `/api/kliens`, `/api/karirs`, `/api/artikels` (FE `API_ENDPOINTS` diperbarui).
- Bonding uid tetap (`api::layanan.layanan`, dsb.) → RBAC & middleware tak berubah fungsi.
- Seeder (`seed.ts`): koleksi dibuat per dokumen via `seedKoleksi` (idempotent); `seedMenuSitus` kini update+publish (tak lagi delete+create agar intro/SEO situs tidak hilang).
- Baseline seed export di-regenerasi (`seed/exports/strapi-export-2026-09-17-*.tar.gz`) supaya `pnpm dev` fresh langsung memakai model baru.

**Hasil tes live (Docker aktif, Postgres via compose, AUTO_SEED baseline baru)**

- Migrasi + schema sync + lift + seed jalan: `layanans` 4, `portfolios` 6, `kliens` 10, `karirs` 4, `artikels` 4, situs dengan intro & proses & navigasi; media (gambar/galeri) terpasang.
- Alur admin (create+draft/publish/kirim uid) diverifikasi OK — tidak ada blok "must be unique" saat operasi normal.
- Verifikasi: UI typecheck 0 error · UI tests 72/72 · UI lint 0 error · Strapi tests 62/62 · Strapi lint 0 error.
- Catatan kecil: `seedCmsMainField` menulis warning `syncConfigurations` (preexisting, tertangkap try/catch) — tidak memblokir boot.

---

## Hapus content type dormant (page-builder + subscriber)

Berdasarkan audit pemakaian FE live — yang **dormant dihapus**, yang **dipakai dipertahankan**:

| Dihapus                   | Alasan                                                                        | Ikut dihapus                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Page` (collection)       | page-builder tidak terjangkau dari nav live (semua halaman pakai rute legacy) | rute `/dynamic/...`, `StrapiPageView`, `components/page-builder/*`, `lib/metadata/*`, `Breadcrumbs`,`usePages`, `hooks/useAppForm`, `dev/pages-overview` & `components-overview`, bagian MockedStrapi di showcase, migrasi `20260917_remove_unused_content_types.js`, baseline seed di-re-export (tanpa Page) |
| `Hierarchy` (single)      | bagian page-builder (breadcrumb/tree)                                         | folder `api/hierarchy`, admin `extensions/Hierarchy`, tests hierarchy-\*                                                                                                                                                                                                                                      |
| `Subscriber` (collection) | hanya dipakai form newsletter/kontak milik page-builder yang dormant          | folder `api/subscriber`, `useAppForm` (kontak form ke `/subscribers`), entri endpoint & RBAC                                                                                                                                                                                                                  |

**Dipertahankan (beralasan):** `Redirect` — dibaca middleware `proxy.ts` (`redirectsProxy`) tiap request (redirect SEO dari CMS); plugin **users-permissions** — penyedia "Public role" yang menjadi sumber izin baca publik semua konten (mencabutnya = seluruh halaman tak bisa baca CMS).

Efek samping yang dibersihkan: relasi `page` di komponen `utilities.link` dihapus (sendi boot gagal `Metadata for api::page.page not found`), RBAC `SUBYEK_KONTEN`, `seed-check` (kini butuh Navbar+Footer saja), `API_ENDPOINTS` FE (`/pages`, `/subscribers`), revalidate middleware (config page path-field dihapus; poin redirect tetap).

**Hasil verifikasi final (DB fresh + AUTO_SEED baseline baru):**

- `pages`/`subscribers`/`hierarchies` → 404; `layanans`/`artikels`/`rekanans`/`redirects`/`situs` → 200
- UI rerender dari CMS (`/`, `/artikel`, `/layanan` 200)
- UI typecheck 0 · UI tests 72/72 · UI lint 0 · Strapi tests 29/29 · Strapi lint 0

---

## Audit ulang "semua FE call Strapi?" + test semua input & changes

Pass audit menyeluruh (tanpa terkecuali) + tes live semua route & input:

**Hasil audit data per halaman:** 12 halaman publik + 3 tipe detail semuanya render dari Strapi (`fetchKontenSitus` / `fetchBeranda` / `fetchRekanan` / `fetchFooter`) — diuji langsung `curl` tiap route, marker konten CMS ada di semua (status 200; `/artikel`, `/layanan`, `/karir` detail pakai slug asli DB). SEO title/description per halaman terpasang (sumber: `situs.seo`, fallback FE).

**Input & perubahan yang diuji:**

- Form kontak `/kontak`: pilihan layanan (dari collection Layanan), WhatsApp (dari `kontak.whatsapp`), alamat/email/jam (dari `kontak`) ✓ — submit sengaja ke WhatsApp + CRM lokal (bukan simpan Strapi, by design).
- Navbar & WhatsAppFloat: nomor WA dari CMS ✓ · Footer kolom dari footer CT ✓ · auth (users-permissions + Strapi auth plugin) render OK.

**Gap konten yang ditutup di pass ini** (judul section & brand yang tadinya literali FE → CMS):
| Section | Field CMS baru di `situs` (Pengaturan Global) |
| --- | --- |
| Mengapa Memilih (KenapaKami) | `keunggulanJudul` |
| Proses Kerja | `prosesJudul`, `prosesDeskripsi` |
| FAQ | `faqJudul`, `faqDeskripsi` |
| Artikel home | `artikelJudul`, `artikelDeskripsi` |
| Perjalanan (tentang) | `perjalananJudul`, `perjalananDeskripsi` |
| Visi & Misi | `visiMisiJudul` |
| Tim | `timJudul`, `timDeskripsi` |
| Caption peta ("Kota Proyek — brand") | brand dari `situs.brandNama` (PetaMap via Jangkauan/PetaSection) |
| JobCard (brand/tagline) | `brandNama`/`brandTagline` dari `situs` |
| Byline TentangInti | brand dari `situs.brandNama` |

**Yang tetap statis sengaja (UI chrome, bukan konten):** label tombol/CTA/eyebrow ("Konsultasi", "Lihat Detail", "Hubungi Kami", "Kirim Pesan", "FAQ", "Tim Kami", …), empty-state microcopy, aset gambar (hero slider, logo), kredit "Dibuat oleh Captiveau", nama layanan di select "Lainnya".

**Verifikasi akhir:** UI typecheck 0 · UI tests **73/73** · UI lint 0 · Strapi tests **29/29** · Strapi lint 0 · baseline seed di-re-export (model baru + field section situs).
