# mono-annasr-konsultan

Enterprise-ready monorepo starter for building content-driven websites with **Strapi v5**, **Next.js 16**, **React 19**, **TailwindCSS v4**, **shadcn/ui**, **Turborepo**, and **pnpm workspaces**.

Build faster with a typed Strapi CMS page builder, smart population, page hierarchy, redirects, TypeScript API types, a shared design system, authentication, localization, preview, SEO helpers, media handling, browser-safe Strapi proxying, seed data, code-quality tooling, Playwright QA, Docker deployment, and CI/CD via GitHub Actions.

## Documentation

| Dokumen                                                      | Untuk siapa                         | Isi                                                                                         |
| ------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| [`docs/serah-terima.md`](./docs/serah-terima.md)             | Pemilik produk, tim teknis penerima | Deliverable, arsitektur, akses, infrastruktur, CI/CD, backup, troubleshooting, berita acara |
| [`docs/panduan-pengguna.md`](./docs/panduan-pengguna.md)     | Tim konten / admin CMS              | Cara login, mengubah konten, upload gambar, SEO, redirect, playbook, aturan penulisan       |
| [`deploy/ANALYTICS.md`](./deploy/ANALYTICS.md)               | Marketing / developer               | Setup GTM, GA4, Clarity, event tracking, SEO                                                |
| [`deploy/README.md`](./deploy/README.md)                     | DevOps                              | Deploy Docker, environment, storage media, seed                                             |
| [`docs/qa/rekap-qa-annasr.md`](./docs/qa/rekap-qa-annasr.md) | QA / PM                             | Rekap temuan QA dan tindak lanjutnya                                                        |

## Getting Started

Start locally with a short setup flow: clone the repository, install dependencies, and run the UI and Strapi apps from the monorepo root.

```bash
git clone https://github.com/Captiveau-Playground/mono-annasr-konsultan
cd mono-annasr-konsultan

pnpm install
pnpm dev:strapi
pnpm dev:ui
```
