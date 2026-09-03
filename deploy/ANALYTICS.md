# Analytics & SEO Setup — GA4 + GTM + MS Clarity

Stack terpasang: **Google Tag Manager (GTM)** sebagai hub → **GA4** + **MS Clarity**.
Semua event dikirim ke `dataLayer`; tag GA4 & pengaturan marketing dikelola di
[konsol GTM](https://tagmanager.google.com) tanpa deploy ulang kode.

## 1. Setup awal (sekali)

| Langkah | Di mana                                                | Yang dilakukan                                                                                                                             |
| ------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | [analytics.google.com](https://analytics.google.com)   | Buat property GA4 + **Web data stream**, catat ID (G-XXXXXXX). Nanti dipakai di GTM.                                                       |
| 2       | [tagmanager.google.com](https://tagmanager.google.com) | Buat container **Web** → dapat `GTM-XXXXXXX`.                                                                                              |
| 3       | [clarity.microsoft.com](https://clarity.microsoft.com) | Buat project → dapat ID Clarity (10–12 karakter).                                                                                          |
| 4       | Env                                                    | Isi `GTM_ID` & `MS_CLARITY_ID` (`.env.local` dev / `deploy/.env` prod). Tanpa keduanya → **tidak ada script dimuat** (aman untuk staging). |

Mekanisme: `apps/ui/src/components/analytics/Analytics.tsx` (server) membaca env
runtime → merender GTM (`@next/third-parties`) + Clarity (`next/script`).
CSP (`apps/ui/src/lib/proxies/securityHeaders.ts`) sudah me-allowlist
`googletagmanager.com`, `google-analytics.com`, `clarity.ms`, `analytics.google.com`.

## 2. Tag di GTM (buat sekali, lalu kelola di sana)

### GA4 Configuration (halaman semua)

- Tag **Google Tag Manager → GA4 Configuration**, `Measurement ID` = G-XXXXXXX.
- Trigger: **All Pages**.

### GA4 Events (dari dataLayer) — buat trigger + pasang di tag GA4 Event

1. **Variable** (User-Defined) untuk tiap property yang dipakai:
   `dlv - cta`, `dlv - channel`, `dlv - location`, `dlv - layanan`, `dlv - form`,
   `dlv - slug` (☰ Variables → New → **Data Layer Variable**, key `cta`, dst.).
2. **Trigger** per event (☰ → Triggers → Custom Event):
   - `cta_clicked` — Custom Event `cta_clicked`
   - `contact_channel_clicked` — Custom Event `contact_channel_clicked`
   - `form_submitted` — Custom Event `form_submitted`
   - `article_read` — Custom Event `article_read`
   - 📈 Opsional: `remove_scale` scroll depth & `outbound_click` (built-in GTM
     triggers: **Scroll Depth** (25/50/75/100%) & **Click → Just Links**, Enable
     when URL scheme tel:/mailto/https eksternal).
3. **Tag GA4 Event** per trigger di atas (Event Name diisi `{event}` via variable
   `dlv - event` atau nama event langsung). Kirim parameter via variabel dlv.
4. **GA4 AdSense/Conversion**: tandai event penting sebagai **Conversion** di
   GA4 (Admin → Conversions → New: `cta_clicked`, `contact_channel_clicked`,
   `form_submitted`).

### MS Clarity (alternatif: lewat GTM)

Bisa tetap dikelola via env (code di atas). Bila ingin semua di GTM:
hapus pemuatan env, lalu buat tag **Custom HTML** di GTM berisi snippet Clarity
(script `clarity.ms/tag/ID`) dengan trigger All Pages.

## 3. Event yang dikirim aplikasi (full event)

Naming: `object_action` huruf kecil. Konteks di property, bukan nama event.

| Event                          | Property                                                                                                                                       | Dipicu                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `page_view`                    | (otomatis GTM)                                                                                                                                 | Semua halaman                                                   |
| `cta_clicked`                  | `cta: hero_konsultasi / hero_layanan / cta_banner / nav_kontak / layanan_card / layanan_detail / artikel_card` , `layanan` (ops), `slug` (ops) | Klik tombol/CTA                                                 |
| `contact_channel_clicked`      | `channel: whatsapp / phone / email`, `location: float / nav_cta / form_kontak / kontak_page`                                                   | Klik kanal kontak (WA float, WA navbar, WA form, tel:, mailto:) |
| `form_submitted`               | `form: kontak`, `layanan: <jenis layanan dipilih>`                                                                                             | Submit form kontak                                              |
| `article_read`                 | `slug: <slug artikel>`                                                                                                                         | Halaman detail artikel dibuka                                   |
| `scroll_depth` (GTM trigger)   | threshold 25/50/75/100%                                                                                                                        | Scroll halaman                                                  |
| `outbound_click` (GTM trigger) | link url                                                                                                                                       | Klik link eksternal                                             |

## 4. Debug

- Dev: buka `localhost:3000` → Console → `dataLayer` (array berisi event).
  Aktifkan **GTM Preview Mode** untuk melihat tag mana yang fire.
- GA4 **Realtime** + **DebugView** untuk verifikasi event masuk.
- Clarity: dashboard project menampilkan sesi/rekaman begitu ada traffic.

## 5. SEO (JSON-LD & metadata) — sudah terpasang

| Halaman           | Schema                                                                       | File                                   |
| ----------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| Semua (layout)    | `metadataBase`, canonical, OpenGraph, Twitter Card, `<title>`/desc dari CMS  | `app/[locale]/layout.tsx`              |
| Beranda           | `ProfessionalService` (LocalBusiness) + `WebSite` + `FAQPage` (dari CMS FAQ) | `app/[locale]/page.tsx`                |
| `/layanan`        | `BreadcrumbList` + `ItemList`/`Service`                                      | `app/[locale]/layanan/page.tsx`        |
| `/artikel/{slug}` | `BreadcrumbList` + `Article`                                                 | `app/[locale]/artikel/[slug]/page.tsx` |
| `/kontak`         | `BreadcrumbList` + `ContactPage`                                             | `app/[locale]/kontak/page.tsx`         |
| Sitemap           | `sitemap.xml` (CMS slug + statis), `robots.txt`                              | `app/sitemap.ts`, `app/robots.ts`      |

## 6. Catatan untuk "nasional / lokal #1"

- `ProfessionalService` memakai alamat + jam operasional dari CMS `kontak`
  (Jombang, Jawa Timur, Indonesia) — kunci SEO lokal "konsultan teknik Jombang".
- **Belum**: locale `id` (halaman saat ini en/cs) — saran menambah bahasa ID agar
  Google memahami target pasar Indonesia (lihat skill `add-locale`).
- **Hindari** schema palsu (AggregateRating tanpa basis nyata, Review buatan) —
  Google menghapus hasil "spammy" / menurunkan peringkat.
- Daftar ke Google Search Console + Bing Webmaster, kirim `sitemap.xml`.
