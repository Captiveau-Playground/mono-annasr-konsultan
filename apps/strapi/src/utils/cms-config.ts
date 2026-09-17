import type { Core } from "@strapi/strapi"

import { logger } from "./logging"

/**
 * Field judul (mainField) per atribut komponen repeatable di Content Manager.
 *
 * Tanpa ini, accordion komponen repeatable di admin hanya menampilkan
 * "FAQ (Item) 1/2/3" — isinya tidak kelihatan tanpa dibuka. Dengan
 * `mainField` (mis. `faq.tanya`), judul accordion menunjukkan pertanyaan.
 *
 * Idempotent: hanya ditulis bila `mainField` belum di-set (masih `id` /
 * undefined), jadi pengaturan manual admin tetap dihormati.
 */
const MAIN_FIELD_PER_UID: Record<string, Record<string, string>> = {
  "api::beranda.beranda": {
    faq: "tanya",
    keunggulan: "judul",
  },
  "api::tentang.tentang": {
    statistik: "label",
    perjalanan: "judul",
    visiMisi: "judul",
    tim: "nama",
    alasan: "judul",
    kotaProyek: "nama",
  },
  "api::layanan.layanan": { alur: "judul", persyaratan: "judul" },
  "api::portfolio.portfolio": {},
  "api::klien.klien": {},
  "api::karir.karir": {
    tanggungJawab: "teks",
    kualifikasi: "teks",
    manfaat: "teks",
  },
  "api::artikel.artikel": {},
  "api::situs.situs": { seo: "halaman", proses: "judul" },
}

export async function seedCmsMainField({ strapi }: { strapi: Core.Strapi }) {
  try {
    const conf = strapi.plugin("content-manager").service("configuration")

    // Pastikan konfigurasi tersimpan utk semua content type.
    if (typeof conf.syncConfigurations === "function") {
      await conf.syncConfigurations()
    }

    for (const [uid, fields] of Object.entries(MAIN_FIELD_PER_UID)) {
      const current = await conf.getConfiguration(uid)
      if (!current?.metadatas) continue

      const metadatas = { ...current.metadatas }
      let berubah = false

      for (const [field, mainField] of Object.entries(fields)) {
        const meta = metadatas[field] as
          | undefined
          | { edit?: { mainField?: string } }
        const lama = meta?.edit?.mainField
        if (!lama || lama === "id") {
          metadatas[field] = {
            ...meta,
            edit: { ...meta?.edit, mainField },
          }
          berubah = true
        }
      }

      if (berubah) {
        await conf.setConfiguration(uid, { ...current, metadatas })
      }
    }

    logger.info("[cms-config] mainField komponen diselaraskan")
  } catch (error) {
    logger.warn(`[cms-config] gagal menyelaraskan mainField: ${String(error)}`)
  }
}
