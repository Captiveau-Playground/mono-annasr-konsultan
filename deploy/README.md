# Deploy Docker (GHCR)

Runtime produksi: **PostgreSQL + Strapi + UI** via `docker compose`.
Image di-build dari monorepo dan di-push otomatis ke **GHCR** oleh
workflow `.github/workflows/docker-publish.yml` saat push ke `main`
(tag `latest` + `sha-…`) atau push tag `v1.2.3` (tag semver).

## 1. Build image (di GitHub)

1. Push ke `main` (atau tag `v1.0.0`) → workflow berjalan di tab **Actions**.
2. Cek hasil: `https://github.com/{org}/{repo}/pkgs/container/{repo}-ui`
   dan `…-strapi`. Image bernama `ghcr.io/{org}/{repo}-ui` / `…-strapi`.

> Optionally set **visibility Public** di package settings jika server
> akan pull tanpa login (GHCR). Untuk image private, server butuh PAT
> dengan scope `read:packages`.

## 2. Di server

```bash
# Login ke GHCR (sekali)
echo "$GITHUB_PAT" | docker login ghcr.io -u {github-username} --password-stdin

# Setup env
cd deploy
cp .env.example .env
$EDITOR .env          # isi URL, secret, token (lihat catatan)

# Jalankan
docker compose up -d --pull always
docker compose ps     # db, strapi, ui → healthy
```

## 3. Verifikasi

| Service | Health                                                           |
| ------- | ---------------------------------------------------------------- |
| UI      | `curl http://localhost:3000/api/health` → `{"data":"OK"}`        |
| Strapi  | `curl http://localhost:1337/api/health` → JSON health            |
| Admin   | buka `http://localhost:1337/admin`, daftarkan user admin pertama |

## 4. Reverse proxy (Caddy/Nginx)

Expose hanya port 80/443; arahkan:

- `www.domain-anda.com` → `localhost:3000` (UI)
- `cms.domain-anda.com` → `localhost:1337` (admin + API Strapi)

Contoh Caddyfile:

```caddy
www.domain-anda.com {
    reverse_proxy localhost:3000
}
cms.domain-anda.com {
    reverse_proxy localhost:1337
}
```

Setelah proxy hidup: `STRAPI_URL` di `.env` UI sebaiknya diubah ke
`https://cms.domain-anda.com` (bukan `http://strapi:1337`) supaya gambar
upload yang dirender `<Image>` Next bisa melewati optimizer (Next
memblokir IP privat/private-host oleh default SSRF).

## 5. Update

```bash
docker compose pull && docker compose up -d
```

Ganti tag di `.env` (`latest` / `sha-…` / `v1.2.3`) untuk pin versi.

## Catatan penting

- **Upload media:** default tersimpan di volume `uploads`
  (`/app/apps/strapi/public/uploads`). Volume lokal ini _tidak_ cocok
  untuk multi-host dan wajib di-backup. Kalau upload sungguhan mulai
  dipakai, alihkan ke object storage (lihat bagian storage di bawah).
- **Seed:** `AUTO_SEED_ENABLED=false` default saat produksi. Untuk
  first-boot dengan DB kosong, set `AUTO_SEED_ENABLED=true`
  `AUTO_SEED_MODE=empty` sekali (impor baseline Page/Navbar/Footer),
  tunggu healthy, lalu matikan lagi.
- **Strapi admin:** tidak ada user admin bawaan — buat lewat
  `/admin` (halaman daftar) di deploy pertama. Role "Editor Konten"
  dibuat otomatis oleh `RBAC_AUTO_SETUP`.
- **Backup:** jadwalkan `pg_dump` volume `pgdata` + backup volume
  `uploads` (mis. `restic`/`rclone` ke storage eksternal).

## Pilihan storage (selain AWS S3)

Config upload `apps/strapi/config/plugins/upload.ts` otomatis memakai:

1. **Local volume Docker** (default, tanpa env AWS\_\*)
   — paling sederhana; aman kalau upload masih sedikit; wajib backup;
   hanya untuk satu server.

2. **AWS S3** — aktif dengan `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET`,
   `AWS_REGION`, `AWS_BUCKET`. (Provider `@strapi/provider-upload-aws-s3`
   sudah terpasang.)

3. **S3-compatible lain** — aktif dengan tambahan `AWS_ENDPOINT`
   (sudah didukung kode, tanpa install apa pun):
   - **Cloudflare R2** — endpoint `https://<account>.r2.cloudflarestorage.com`; **tanpa biaya egress**.
   - **Backblaze B2** — endpoint `https://s3.<region>.backblazeb2.com`; paling murah per GB.
   - **DigitalOcean Spaces** — endpoint `https://<region>.digitaloceanspaces.com`; mudah.
   - **MinIO** (self-host) — `http://minio:9000` + `AWS_FORCE_PATH_STYLE=true`.
   - Bonus: semua ini mendukung `CDN_URL` (baseUrl publik) & `CDN_ROOT_PATH`.

4. **Azure Blob Storage** — kode pendukungnya sudah ada
   (`prepareAzureStorageConfig`, pakai env `STORAGE_ACCOUNT`,
   `STORAGE_CONTAINER_NAME`, `STORAGE_ACCOUNT_KEY`/SAS, atau MSI), **tetapi**
   package `strapi-provider-upload-azure-storage` belum terpasang —
   perlu `pnpm -F @repo/strapi add strapi-provider-upload-azure-storage`
   jika ingin memakai ini.

> Rekomendasi untuk project ini: mulai dengan **volume lokal + backup
> terjadwal** karena media saat ini nyaris nol (gambar statis dari FE).
> Saat upload CMS mulai dipakai sungguhan, pindah ke **Cloudflare R2**
> atau **Backblaze B2** — kompatibel S3, murah, tanpa egress — cukup isi
> env `AWS_*` + `AWS_ENDPOINT`, tanpa ubah kode.
