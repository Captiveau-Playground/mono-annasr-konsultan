# Dokumen Serah Terima — Website CV. An Nasr Konsultan

| Field                | Nilai                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Versi dokumen        | 1.0                                                                |
| Tanggal serah terima | 12 November 2026                                                   |
| Situs produksi       | <https://annasrkonsultan.com>                                      |
| CMS admin            | <https://cms.annasrkonsultan.com/admin>                            |
| Repositori           | `Captiveau-Playground/mono-annasr-konsultan` (private, GitHub)     |
| Commit acuan         | `d4fdaaa` — tag rilis **v3.18.2**                                  |
| Image produksi       | `ghcr.io/Captiveau-Playground/mono-annasr-konsultan-ui:latest`     |
|                      | `ghcr.io/Captiveau-Playground/mono-annasr-konsultan-strapi:latest` |
| Penyusun             | Captiveau                                                          |
| Penerima             | CV. An Nasr Konsultan                                              |

> **Cara pakai dokumen ini.** Bagian 1–10 menjelaskan _apa_ yang diserahkan dan
> _bagaimana_ sistemnya bekerja. Bagian 11–14 adalah prosedur operasional yang
> dipakai sehari-hari. Bagian 17–18 ditandatangani setelah verifikasi.
> Untuk pengelola konten (bukan teknis), gunakan **[`panduan-pengguna.md`](./panduan-pengguna.md)**.

---

## 1. Ringkasan proyek

Website profil perusahaan (company profile) CV. An Nasr Konsultan: situs publik
berbahasa Indonesia yang menampilkan layanan konsultasi teknik, portofolio
proyek, klien, artikel, lowongan kerja, dan kontak — seluruhnya dapat diubah
sendiri oleh tim An Nasr melalui CMS tanpa menyentuh kode.

| Aspek          | Keterangan                                                           |
| -------------- | -------------------------------------------------------------------- |
| Jenis          | Company profile + CMS (situs publik, bukan portal internal)          |
| Halaman publik | 9 halaman statis + halaman detail dinamis (layanan, artikel, karier) |
| Bahasa         | Indonesia (lihat catatan rute bahasa di §4)                          |
| Pengelolaan    | Strapi 5 Content Manager — tambah/ubah konten mandiri                |
| Analytics      | Google Tag Manager + GA4 (terpasang & aktif)                         |
| SEO            | Metadata per halaman, JSON-LD, sitemap, robots, canonical            |
| Hosting        | 1 VPS Docker (PostgreSQL + Strapi + Next.js), image dari GHCR        |
| CI/CD          | GitHub Actions → GHCR → deploy otomatis ke VPS                       |

---

## 2. Checklist deliverable

| #   | Deliverable                                                                             | Status | Bukti / Lokasi                                     |
| --- | --------------------------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| 1   | Situs publik live                                                                       | ✅     | <https://annasrkonsultan.com> (HTTP 200)           |
| 2   | Halaman: Beranda, Tentang, Layanan, Portofolio, Klien, Rekanan, Artikel, Karier, Kontak | ✅     | `/sitemap.xml`                                     |
| 3   | Detail layanan, detail artikel, detail lowongan                                         | ✅     | rute dinamis `/[jenis]/[slug]`                     |
| 4   | CMS Strapi + PostgreSQL                                                                 | ✅     | <https://cms.annasrkonsultan.com/admin>            |
| 5   | 13 tipe konten terkelola (6 single type + 7 collection)                                 | ✅     | §5                                                 |
| 6   | Peran admin "Editor Konten" otomatis                                                    | ✅     | `apps/strapi/src/utils/rbac.ts`                    |
| 7   | Media library + tampilan gambar (proxy same-origin)                                     | ✅     | `/api/asset/*`                                     |
| 8   | SEO per halaman (judul & deskripsi dari CMS)                                            | ✅     | `Pengaturan Global → SEO`                          |
| 9   | Sitemap.xml, robots.txt, JSON-LD, canonical, hreflang                                   | ✅     | `/sitemap.xml`, `/robots.txt`                      |
| 10  | GA4 + GTM terpasang                                                                     | ✅     | GTM `GTM-TJPCCLSL` → GA4 `G-Z9QPY3QG57`            |
| 11  | Auto revalidate cache saat publish                                                      | ✅     | document middleware + `/api/strapi-revalidate`     |
| 12  | Responsif (mobile/tablet/desktop) + aksesibilitas dasar                                 | ✅     | QA aksesibilitas Playwright                        |
| 13  | CI/CD + image container                                                                 | ✅     | `.github/workflows/*`                              |
| 14  | Dokumentasi serah terima + panduan pengguna                                             | ✅     | file ini + `panduan-pengguna.md`                   |
| 15  | Google Search Console                                                                   | ⚠️     | **perlu diselesaikan penerima** — lihat §10        |
| 16  | Microsoft Clarity                                                                       | ⚠️     | belum diaktifkan (opsional, butuh `MS_CLARITY_ID`) |

---

## 3. Arsitektur & stack

```
                     ┌──────────────────────────────┐
   Pengunjung ──────▶ │  annasrkonsultan.com (HTTPS) │
                     │  reverse proxy (Caddy/Nginx) │
                     └───────┬──────────────┬───────┘
                             │              │
                  :3006 ─────┘              └───── :1337
                     │                             │
            ┌────────▼────────┐          ┌─────────▼─────────┐
            │  Container: ui  │  HTTP    │ Container: strapi │
            │  Next.js 16 SSR │ ───────▶ │ Strapi 5 + admin  │
            │  + ISR cache    │  REST    │ + Media Library   │
            └─────────────────┘          └─────────┬─────────┘
                                                   │
                                         ┌─────────▼─────────┐
                                         │ Container: db     │
                                         │ PostgreSQL 16     │
                                         │ volume: pgdata    │
                                         └───────────────────┘
```

| Lapisan   | Teknologi                                         |
| --------- | ------------------------------------------------- |
| Frontend  | Next.js 16 (App Router), React 19, TailwindCSS v4 |
| CMS       | Strapi 5 + PostgreSQL 16                          |
| Monorepo  | pnpm workspaces + Turborepo                       |
| Kontainer | Docker Compose (`db`, `strapi`, `ui`)             |
| Registry  | GitHub Container Registry (GHCR)                  |
| CI/CD     | GitHub Actions                                    |
| Analytics | Google Tag Manager → GA4                          |

**Struktur folder penting**

| Path                     | Isi                                                      |
| ------------------------ | -------------------------------------------------------- |
| `apps/ui`                | Situs publik Next.js + modul CRM demo                    |
| `apps/strapi`            | CMS, schema konten, RBAC, seeder, middleware             |
| `packages/strapi-types`  | Tipe TypeScript hasil generate dari schema Strapi        |
| `packages/design-system` | Token warna, tipografi, style CKEditor                   |
| `deploy/`                | `docker-compose.yml`, `.env.example`, dokumentasi deploy |
| `docs/`                  | Dokumen serah terima, panduan pengguna, rekap QA         |
| `qa/tests/playwright`    | E2E, aksesibilitas, SEO, visual, Lighthouse              |

---

## 4. Peta situs produksi

Diverifikasi dengan `curl https://annasrkonsultan.com/sitemap.xml` pada 12 Nov 2026.

| URL                           | Isi                                                               | Sumber konten CMS               |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------- |
| `/`                           | Beranda: hero, founder, keunggulan, FAQ, CTA                      | `Beranda` + `Pengaturan Global` |
| `/tentang`                    | Profil, statistik, perjalanan, visi-misi, founder, tim, jangkauan | `Tentang`                       |
| `/layanan`                    | Daftar layanan                                                    | `Layanan` (collection)          |
| `/layanan/[slug]`             | Detail layanan + galeri + alur + persyaratan                      | `Layanan`                       |
| `/portfolio`                  | Portofolio proyek + filter kategori (9/halaman)                   | `Proyek` (collection)           |
| `/klien`                      | Logo & daftar klien                                               | `Klien` (collection)            |
| `/rekanan`                    | Rekanan + sertifikat                                              | `Rekanan` (collection)          |
| `/artikel`                    | Daftar artikel + unggulan                                         | `Artikel` (collection)          |
| `/artikel/[slug]`             | Detail artikel                                                    | `Artikel`                       |
| `/karir`                      | Lowongan aktif                                                    | `Karir` (collection)            |
| `/karir/[slug]`               | Detail lowongan + lamar                                           | `Karir`                         |
| `/kontak`                     | Kontak, jam operasional, peta, form                               | `Kontak`                        |
| `/crm/*`                      | **Modul CRM demo** — lihat §14 batasan                            | localStorage browser            |
| `/auth/*`                     | Halaman autentikasi (register, signin, reset)                     | Better Auth                     |
| `/sitemap.xml`, `/robots.txt` | SEO otomatis                                                      | —                               |

**Rute bahasa.** Routing `next-intl` memakai default `en` tanpa prefix dan locale
kedua `cs` berprefix. Karena itu halaman Indonesia dilayani di `/` (bukan `/id`)
dan `<html lang="id">`. Ini warisan template; lihat §14 bila ingin dirapikan.

**Endpoint teknis**

| Endpoint                      | Fungsi                                                  |
| ----------------------------- | ------------------------------------------------------- |
| `GET /api/health`             | Health check UI (`{"data":"OK"}`)                       |
| `GET /api/asset/*`            | Proxy gambar Strapi (same-origin, aman untuk `<Image>`) |
| `POST /api/strapi-revalidate` | Revalidate cache Next (dipanggil Strapi)                |
| `POST /api/cdn-purge`         | Purge CDN (opsional, inert bila provider kosong)        |
| `/api/public-proxy/*`         | Proxy baca Strapi untuk browser                         |
| `/api/private-proxy/*`        | Proxy tulis Strapi (butuh token)                        |
| `/api/auth/*`                 | Better Auth                                             |

---

## 5. Model konten CMS

### Single type — satu dokumen, mengatur banyak tempat

| Konten            | UID       | Dipakai di                                                                   |
| ----------------- | --------- | ---------------------------------------------------------------------------- |
| Beranda           | `beranda` | Hero, founder, keunggulan, FAQ, CTA banner                                   |
| Tentang Kami      | `tentang` | Hero, profil, statistik, perjalanan, visi-misi, founder, tim, jangkauan peta |
| Kontak            | `kontak`  | Halaman kontak, WhatsApp float, footer                                       |
| Pengaturan Global | `situs`   | Brand, navigasi, intro tiap halaman, eyebrow, SEO per halaman                |
| Navbar            | `navbar`  | Menu atas + tombol CTA                                                       |
| Footer            | `footer`  | Kolom footer, copyright, credit                                              |

### Collection type — daftar, tiap entri satu halaman/kartu

| Konten   | UID         | Field utama                                                                                        | Perilaku khusus                                                                              |
| -------- | ----------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Layanan  | `layanan`   | judul, slug, ringkas, gambar, galeri, deskripsi, manfaat, detail, alur, persyaratan, dokumenClient | Maks **8** gambar galeri (dipaksa di server). Muncul otomatis di navbar, footer, dan beranda |
| Proyek   | `portfolio` | nama, lokasi, kategori, gambar                                                                     | Filter kategori dibuat otomatis dari data; **9** kartu/halaman                               |
| Klien    | `klien`     | nama, logo                                                                                         | —                                                                                            |
| Artikel  | `artikel`   | judul, slug, kategori, tanggal, penulis, ringkas, gambar, isi, unggulan                            | `unggulan` menyorot artikel di beranda                                                       |
| Karier   | `karir`     | nama, tipe, lokasi, statusPosisi, slug, ringkas, deskripsi, tanggungJawab, kualifikasi, manfaat    | `statusPosisi = ditutup` menyembunyikan lowongan dari daftar & detail                        |
| Rekanan  | `rekanan`   | nama, instansi, keterangan, sertifikat                                                             | —                                                                                            |
| Redirect | `redirect`  | source, destination                                                                                | Redirect 301/302 dikelola admin                                                              |

### Komponen yang sering dipakai

| Komponen                   | Field                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `annasr.hero`              | eyebrow, judul, deskripsi, keunggulan, gambar                |
| `annasr.alasan`            | judul, teks (keunggulan)                                     |
| `annasr.faq-item`          | tanya, jawab                                                 |
| `annasr.cta`               | eyebrow, judul, deskripsi, telepon                           |
| `annasr.seo-meta`          | halaman, judul, deskripsi (**SEO per halaman**)              |
| `annasr.stat`              | nilai, label                                                 |
| `annasr.milestone`         | tahun, judul, teks                                           |
| `annasr.visi-misi`         | judul, teks                                                  |
| `annasr.founder`           | eyebrow, nama, jabatan, teks, kutipan, foto, gambarPendukung |
| `annasr.tim-member`        | nama, jabatan, foto, linkedin                                |
| `annasr.alur-step`         | judul, teks                                                  |
| `annasr.persyaratan-kartu` | eyebrow, judul, deskripsi, daftar                            |
| `annasr.dokumen-client`    | judul, deskripsi, gambar, daftar                             |
| `annasr.kota`              | nama, lat, lng (peta jangkauan)                              |
| `annasr.map-item`          | label, url                                                   |

> **Aturan input penting:** field bertipe `text` yang tampil sebagai daftar
> (keunggulan, manfaat, detail, persyaratan, isi artikel) dipisah **per baris**
> — satu baris = satu poin/paragraf. Jangan gunakan enter ganda di tengah satu poin.

---

## 6. Akses & kredensial

Isi tabel ini saat serah terima. **Jangan simpan password di Git** — gunakan
password manager bersama, dan rotasi setelah serah terima.

| #   | Akses                          | Pemilik akun | Catatan rotasi                       | Terisi |
| --- | ------------------------------ | ------------ | ------------------------------------ | ------ |
| 1   | Registrar domain               |              | Domain atas nama An Nasr             | ☐      |
| 2   | DNS / nameserver               |              | A record apex → IP VPS               | ☐      |
| 3   | VPS + akses SSH                |              | `/opt/mono-annasr-konsultan/deploy`  | ☐      |
| 4   | Strapi Super Admin             |              | Buat minimal 2 akun                  | ☐      |
| 5   | Strapi role "Editor Konten"    |              | Untuk staf konten                    | ☐      |
| 6   | Organisasi GitHub              |              | Akses repo `mono-annasr-konsultan`   | ☐      |
| 7   | GHCR (packages)                |              | Pull image `-ui` / `-strapi`         | ☐      |
| 8   | Google Tag Manager             |              | Container `GTM-TJPCCLSL`             | ☐      |
| 9   | Google Analytics 4             |              | Property `G-Z9QPY3QG57`              | ☐      |
| 10  | Google Search Console          |              | **belum terhubung**                  | ☐      |
| 11  | Microsoft Clarity              |              | opsional                             | ☐      |
| 12  | CARTO basemaps (peta)          |              | key `NEXT_PUBLIC_CARTO_BASEMAPS_KEY` | ☐      |
| 13  | Backup storage (rclone/restic) |              | §11                                  | ☐      |

**Membuat akun admin pertama** (bila suatu saat DB kosong): buka
`https://cms.annasrkonsultan.com/admin` → halaman registrasi hanya aktif saat
belum ada admin. Role **Editor Konten** dibuat otomatis saat Strapi boot
(`RBAC_AUTO_SETUP=true`).

---

## 7. Infrastruktur produksi

`deploy/docker-compose.yml` menjalankan tiga service:

| Service  | Image                       | Port host                 | Volume / mount                              | Healthcheck       |
| -------- | --------------------------- | ------------------------- | ------------------------------------------- | ----------------- |
| `db`     | `postgres:16-alpine`        | internal                  | `pgdata:/var/lib/postgresql/data`           | `pg_isready`      |
| `strapi` | `ghcr.io/...-strapi:latest` | `1337`                    | `./uploads:/app/apps/strapi/public/uploads` | `GET /api/health` |
| `ui`     | `ghcr.io/...-ui:latest`     | `3006` → container `3000` | —                                           | `GET /api/health` |

**Lokasi di server:** `/opt/mono-annasr-konsultan/deploy`

| Path                 | Isi                                            |
| -------------------- | ---------------------------------------------- |
| `.env`               | seluruh konfigurasi produksi (**gitignored**)  |
| `docker-compose.yml` | definisi service                               |
| `uploads/`           | file media hasil upload CMS (**wajib backup**) |
| `pull-server.sh`     | skrip pull + up manual                         |

> **Penting:** `.env` **hanya ada di server**. Mengubah `deploy/.env` di laptop
> tidak berpengaruh apa pun — file itu di-ignore Git dan tidak ikut ter-deploy.

---

## 8. Environment variables

Seluruhnya dibaca **saat runtime** (kecuali yang berawalan `NEXT_PUBLIC_`, yang
di-_bake_ saat build image).

| Variabel                                                                              | Wajib | Dipakai    | Keterangan                                    |
| ------------------------------------------------------------------------------------- | ----- | ---------- | --------------------------------------------- |
| `IMAGE_UI`, `IMAGE_STRAPI`                                                            | ✅    | compose    | Tag image GHCR; ganti untuk pin/rollback      |
| `UI_PUBLIC_URL`                                                                       | ✅    | compose    | `https://annasrkonsultan.com`                 |
| `STRAPI_PUBLIC_URL`                                                                   | ✅    | compose    | `https://cms.annasrkonsultan.com`             |
| `POSTGRES_USER/_PASSWORD/_DB`                                                         | ✅    | db         | Jangan diubah setelah data ada                |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT` | ✅    | strapi     | `openssl rand -base64 32`                     |
| `STRAPI_URL`                                                                          | ✅    | ui         | Alamat internal Strapi (`http://strapi:1337`) |
| `STRAPI_REST_READONLY_API_KEY`                                                        | ✅    | ui         | API token baca dari admin Strapi              |
| `STRAPI_REST_CUSTOM_API_KEY`                                                          | ⬜    | ui         | Untuk operasi tulis via proxy                 |
| `STRAPI_REVALIDATE_SECRET`                                                            | ✅    | ui+strapi  | **harus sama** di kedua service               |
| `STRAPI_CDN_PURGE_SECRET`                                                             | ⬜    | ui+strapi  | Hanya bila CDN purge dipakai                  |
| `STRAPI_CACHE_TTL`                                                                    | ⬜    | ui         | TTL ISR, default 120 detik                    |
| `GTM_ID`                                                                              | ⬜    | ui         | Default `GTM-TJPCCLSL` (ada fallback di kode) |
| `MS_CLARITY_ID`                                                                       | ⬜    | ui         | Kosong → Clarity tidak dimuat                 |
| `NEXT_PUBLIC_CARTO_BASEMAPS_KEY`                                                      | ⬜    | ui (build) | GitHub **Variables**, bukan `.env` server     |
| `BETTER_AUTH_SECRET`                                                                  | ⬜    | ui         | Hanya bila fitur login dipakai                |
| `AWS_*`                                                                               | ⬜    | strapi     | Kosong → media di volume lokal                |
| `RUN_ANNASR_SEED`                                                                     | ⬜    | strapi     | `true` sekali saat DB kosong, lalu `false`    |
| `AUTO_SEED_ENABLED`                                                                   | ⬜    | strapi     | Default `false` di produksi                   |
| `RBAC_AUTO_SETUP`                                                                     | ⬜    | strapi     | Default `true`                                |

---

## 9. CI/CD & rilis

| Workflow             | Pemicu                          | Hasil                                           |
| -------------------- | ------------------------------- | ----------------------------------------------- |
| `ci.yml`             | Pull request ke `main`/`dev`    | Lint, format check, typecheck, test, build      |
| `release.yml`        | Push ke `main`                  | semantic-release: tag `vX.Y.Z` + GitHub Release |
| `docker-publish.yml` | Push tag `v*` **atau** manual   | Build & push image `-ui` dan `-strapi` ke GHCR  |
| `deploy-server.yml`  | Setelah `docker-publish` sukses | SSH ke VPS → `docker compose pull` + `up -d`    |

> ⚠️ Push biasa ke `main` **tidak** otomatis membangun image (sengaja, untuk
> menghemat menit build). Jadi alur rilisnya:
> **push → Release (tag) → jalankan “Build & Push Docker images (GHCR)” → deploy otomatis.**

### Deploy manual (di server)

```bash
cd /opt/mono-annasr-konsultan/deploy
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
curl -fsS localhost:3006/api/health
```

### Rollback ke versi sebelumnya

```bash
cd /opt/mono-annasr-konsultan/deploy
sed -i 's|IMAGE_UI=.*|IMAGE_UI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-ui:v3.18.1|' .env
sed -i 's|IMAGE_STRAPI=.*|IMAGE_STRAPI=ghcr.io/Captiveau-Playground/mono-annasr-konsultan-strapi:v3.18.1|' .env
docker compose pull && docker compose up -d --force-recreate
```

> `docker compose restart` **tidak** membaca ulang `.env`. Selalu pakai
> `up -d --force-recreate` setelah mengubah environment.

### Perintah developer

```bash
pnpm install        # pasang dependency
pnpm dev            # UI + Strapi sekaligus
pnpm dev:ui         # UI saja (localhost:3000)
pnpm dev:strapi     # Strapi saja (localhost:1337)
pnpm lint           # ESLint semua paket
pnpm typecheck      # TypeScript semua paket
pnpm test           # Vitest semua paket
pnpm build          # build produksi
pnpm generate:types # regenerasi tipe Strapi (otomatis saat Strapi restart)
```

---

## 10. Analytics, SEO & performa

### Status analytics (terverifikasi di browser, 12 Nov 2026)

| Komponen           | ID             | Status                                                   |
| ------------------ | -------------- | -------------------------------------------------------- |
| Google Tag Manager | `GTM-TJPCCLSL` | ✅ aktif, snippet ada di HTML awal                       |
| Google Analytics 4 | `G-Z9QPY3QG57` | ✅ terkonfigurasi **di dalam** GTM, `page_view` terkirim |
| Microsoft Clarity  | —              | ⬜ belum aktif (isi `MS_CLARITY_ID`)                     |

Tag GTM dirender dari server (`apps/ui/src/components/analytics/GoogleTagManager.tsx`)
supaya terdeteksi checker instalasi Google dan tidak menunggu hydration.

### Event yang dikirim aplikasi ke `dataLayer`

| Event                     | Property                   | Dipicu                                                          |
| ------------------------- | -------------------------- | --------------------------------------------------------------- |
| `cta_clicked`             | `cta`, `layanan?`, `slug?` | Klik CTA di hero, navbar, banner, kartu layanan/artikel, karier |
| `contact_channel_clicked` | `channel`, `location`      | Klik WhatsApp/telepon/email                                     |
| `form_submitted`          | `form`, `layanan`          | Submit form kontak                                              |
| `article_read`            | `slug`                     | Halaman detail artikel dibuka                                   |

Panduan membuat tag/trigger di GTM: [`deploy/ANALYTICS.md`](../deploy/ANALYTICS.md).

### SEO yang sudah terpasang

| Item                                                           | Lokasi                                    |
| -------------------------------------------------------------- | ----------------------------------------- |
| Metadata per halaman (dari CMS)                                | `Pengaturan Global → SEO`                 |
| JSON-LD `ProfessionalService`, `WebSite`, `FAQPage`            | Beranda                                   |
| JSON-LD `BreadcrumbList`, `ItemList`, `Article`, `ContactPage` | Halaman dalam                             |
| Canonical + hreflang (`id`, `cs`, `x-default`)                 | `apps/ui/src/lib/seo/urls.ts`             |
| `sitemap.xml`, `robots.txt`                                    | `apps/ui/src/app/sitemap.ts`, `robots.ts` |

### Yang masih harus dilakukan penerima

1. **Google Search Console** — verifikasi domain `annasrkonsultan.com`, submit
   `https://annasrkonsultan.com/sitemap.xml`, lalu pantau Coverage & Core Web Vitals.
2. **GA4** — tandai `cta_clicked`, `contact_channel_clicked`, `form_submitted`
   sebagai _conversion_ (Admin → Events → Mark as conversion).
3. **Bing Webmaster Tools** (opsional) — import dari GSC.

---

## 11. Backup & restore

**Yang wajib di-backup**

| Data            | Lokasi                                      | Frekuensi disarankan |
| --------------- | ------------------------------------------- | -------------------- |
| Database        | volume Docker `pgdata`                      | harian               |
| Media upload    | `/opt/mono-annasr-konsultan/deploy/uploads` | harian               |
| `.env` produksi | `/opt/mono-annasr-konsultan/deploy/.env`    | setiap kali berubah  |

**Backup database**

```bash
cd /opt/mono-annasr-konsultan/deploy
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "backup/db-$(date +%F-%H%M).sql.gz"
```

**Backup media**

```bash
tar czf "backup/uploads-$(date +%F).tar.gz" -C /opt/mono-annasr-konsultan/deploy uploads
```

**Restore database**

```bash
gunzip -c backup/db-2026-11-12-0300.sql.gz \
  | docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

**Restore media**

```bash
tar xzf backup/uploads-2026-11-12.tar.gz -C /opt/mono-annasr-konsultan/deploy
docker compose restart strapi   # agar Strapi membaca ulang folder uploads
```

> Jadwalkan dengan `cron` dan kirim hasilnya ke storage eksternal
> (rclone ke S3/R2/B2). Backup yang hanya ada di server yang sama bukan backup.

---

## 12. Operasional rutin

| Frekuensi         | Tugas                                                                            |
| ----------------- | -------------------------------------------------------------------------------- |
| Harian (otomatis) | Backup DB + uploads; cek container `healthy`                                     |
| Mingguan          | Cek GA4 Realtime & Search Console; tinjau artikel/lowongan yang perlu diperbarui |
| Bulanan           | Cek ruang disk (`df -h`), ukuran `uploads`, versi image yang dipakai             |
| Bulanan           | Review konten: lowongan ditutup, proyek baru, artikel baru                       |
| Triwulanan        | Uji restore backup di lingkungan terpisah                                        |
| Tahunan           | Perpanjang domain & VPS; review biaya (§15); audit dependency                    |

**Cek cepat kesehatan sistem**

```bash
cd /opt/mono-annasr-konsultan/deploy
docker compose ps                      # semua service harus healthy
curl -fsS localhost:3006/api/health    # UI
curl -fsS localhost:1337/api/health    # Strapi
docker compose logs --tail=80 ui       # log UI
docker compose logs --tail=80 strapi   # log Strapi
```

---

## 13. Troubleshooting

| Gejala                           | Penyebab umum                                      | Perbaikan                                                                |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| Situs 502 setelah deploy         | Container UI masih restart                         | Tunggu 1–3 menit; cek `docker compose ps` dan `logs ui`                  |
| Perubahan CMS tidak muncul       | Cache ISR (TTL 120 s) atau draft belum dipublish   | Klik **Publish**, lalu tombol **Revalidate cache** di content manager    |
| Tombol Revalidate gagal          | `STRAPI_REVALIDATE_SECRET` beda antara Strapi & UI | Samakan nilainya di `.env`, lalu `up -d --force-recreate`                |
| Gambar tidak tampil              | File belum diupload / `uploads` tidak ter-mount    | Cek Media Library; `ls deploy/uploads`; cek permission `chown 1001:1001` |
| Image container tidak ter-update | `.env` mem-pin tag lama                            | Ganti `IMAGE_UI`/`IMAGE_STRAPI`, `docker compose pull`                   |
| GTM tidak terdeteksi             | Env tidak sampai ke container                      | Cek `docker compose exec ui printenv \| grep GTM_ID`; recreate container |
| Gambar besar / lambat            | Upload tanpa kompresi                              | Kompres sebelum upload (lebar maks ±1600 px)                             |
| Admin CMS tidak bisa login       | Lupa password / akun terkunci                      | Reset via admin lain, atau `strapi admin:reset-user-password`            |
| DB penuh                         | `pgdata` membesar                                  | Cek `docker system df`, bersihkan log image lama                         |

---

## 14. Batasan & hal yang perlu diketahui

| #   | Hal                                             | Dampak                                                                                    | Saran                                                                                                               |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | **Modul CRM (`/crm`) masih demo**               | Data disimpan di `localStorage` browser, akun hardcoded, tidak tersinkron antar perangkat | Jangan dipakai untuk data pelanggan nyata. Bila dibutuhkan, kembangkan menjadi modul dengan database + autentikasi  |
| 2   | **Locale default `en` berisi bahasa Indonesia** | URL Indonesia di `/`, hreflang memakai `id`                                               | Fungsional untuk SEO, tapi membingungkan developer. Bisa dirapikan dengan menambah locale `id` (skill `add-locale`) |
| 3   | **`www.annasrkonsultan.com` belum aktif**       | TLS error untuk `www`                                                                     | Tambahkan DNS A/CNAME + redirect 301 `www` → apex                                                                   |
| 4   | **Media disimpan di disk lokal server**         | Tidak bisa multi-server, wajib backup                                                     | Bila upload bertambah, pindah ke S3/R2 (cukup isi `AWS_*` + `AWS_ENDPOINT`)                                         |
| 5   | **Belum ada cookie consent banner**             | GTM/Clarity langsung memuat script                                                        | Tambahkan consent banner bila ingin patuh UU PDP secara eksplisit                                                   |
| 6   | **Google Search Console belum terhubung**       | Data pencarian organik belum terpantau                                                    | Selesaikan pada minggu pertama setelah serah terima                                                                 |
| 7   | **Deploy single-server, ada downtime singkat**  | ~1–3 menit 502 saat recreate                                                              | Bila butuh nol downtime: blue-green / rolling di belakang proxy                                                     |
| 8   | **Email form kontak**                           | Form mengandalkan kanal WhatsApp/email yang diisi di CMS                                  | Pastikan `Kontak` berisi nomor & email aktif                                                                        |

---

## 15. Biaya perpanjangan (indikatif)

| Item                   | Perkiraan                  | Catatan                              |
| ---------------------- | -------------------------- | ------------------------------------ |
| Domain `.com`          | ± Rp 150.000–250.000/tahun | Tergantung registrar                 |
| VPS                    | sesuai paket penyedia      | Lihat tagihan berjalan               |
| Google Analytics/GTM   | Rp 0                       | Gratis                               |
| Search Console         | Rp 0                       | Gratis                               |
| Clarity                | Rp 0                       | Gratis                               |
| Maintenance (opsional) | sesuai kesepakatan         | Update dependency, backup monitoring |

---

## 16. Kepemilikan & lisensi

| Aset                      | Status                                                   |
| ------------------------- | -------------------------------------------------------- |
| Kode sumber               | Milik CV. An Nasr Konsultan (repo GitHub milik penerima) |
| Desain & aset visual      | Milik CV. An Nasr Konsultan                              |
| Konten (teks, foto, logo) | Milik CV. An Nasr Konsultan                              |
| Domain & hosting          | Terdaftar atas nama CV. An Nasr Konsultan                |
| Akun Google (GTM/GA4/GSC) | Harus dimiliki akun Google perusahaan                    |
| Dependency open-source    | Lisensi masing-masing paket (MIT/Apache)                 |

---

## 17. Checklist serah terima

**Teknis**

- [ ] Situs produksi terbuka normal (desktop & mobile)
- [ ] CMS admin bisa dibuka & login
- [ ] Akun **Super Admin** (min. 2) dan role **Editor Konten** tersedia
- [ ] Semua 13 tipe konten tampil di Content Manager
- [ ] Tambah 1 entri uji di Layanan → muncul di situs setelah Publish
- [ ] Upload 1 gambar uji → tampil di situs
- [ ] Tombol **Revalidate cache** berfungsi (tanpa error)
- [ ] GTM terdeteksi di GTM console / GA4 Realtime menerima `page_view`
- [ ] `/sitemap.xml` dan `/robots.txt` dapat diakses
- [ ] Backup DB + uploads dijalankan sekali & file hasilnya diperiksa
- [ ] `.env` produksi disimpan di password manager
- [ ] Repo GitHub & akses GHCR dialihkan/dikonfirmasi ke penerima

**Non-teknis**

- [ ] Penerima sudah mengikuti sesi training CMS (± 2 jam)
- [ ] Penerima bisa menambah layanan, proyek, artikel, dan lowongan sendiri
- [ ] Penerima tahu kontak eskalasi bila terjadi gangguan
- [ ] Dokumen `panduan-pengguna.md` diterima

---

## 18. Berita acara serah terima

Pada hari ini, .................. tanggal .................. 20...., telah
dilakukan serah terima pekerjaan Website CV. An Nasr Konsultan dari **Captiveau**
kepada **CV. An Nasr Konsultan**, dengan hasil verifikasi checklist pada bagian 17
dinyatakan **LENGKAP / LENGKAP DENGAN CATATAN** \*) dan disetujui kedua pihak.

| Pihak                            | Nama | Jabatan | Tanda tangan | Tanggal |
| -------------------------------- | ---- | ------- | ------------ | ------- |
| Penyerah (Captiveau)             |      |         |              |         |
| Penerima (CV. An Nasr Konsultan) |      |         |              |         |
| Saksi (opsional)                 |      |         |              |         |

\*) Coret yang tidak perlu. Catatan sisa pekerjaan ditulis di lampiran berita acara.

---

## 19. Lampiran & referensi

| Dokumen                          | Lokasi                                                  |
| -------------------------------- | ------------------------------------------------------- |
| Panduan pengguna CMS             | [`docs/panduan-pengguna.md`](./panduan-pengguna.md)     |
| Analytics & GTM (setup tag)      | [`deploy/ANALYTICS.md`](../deploy/ANALYTICS.md)         |
| Deploy Docker                    | [`deploy/README.md`](../deploy/README.md)               |
| Rekap QA & tindak lanjut         | [`docs/qa/rekap-qa-annasr.md`](./qa/rekap-qa-annasr.md) |
| Panduan kontributor & arsitektur | [`AGENTS.md`](../AGENTS.md)                             |
| Skema konten                     | `apps/strapi/src/api/*/content-types/*/schema.json`     |
| Workflow CI/CD                   | `.github/workflows/`                                    |
| Konfigurasi runtime              | `deploy/docker-compose.yml`, `deploy/.env.example`      |
