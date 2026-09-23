import type { Core } from "@strapi/strapi"

/**
 * RBAC otomatis & idempotent untuk konten halaman depan:
 *
 * 1. Public role (users-permissions) diizinkan `find` tipe beranda.
 * 2. Admin role "Editor Konten" (dibuat bila belum ada) diizinkan
 *    content-manager explorer (create/read/update/delete/publish) pada
 *    tipe konten publik — TANPA akses Settings/Users/Admin.
 *
 * Pakai low-level db.query agar stabil antar versi. Env `RBAC_AUTO_SETUP`
 * (default "true") bisa dimatikan.
 */
const SUBYEK_KONTEN = [
  "api::beranda.beranda",
  "api::tentang.tentang",
  "api::layanan.layanan",
  "api::portfolio.portfolio",
  "api::klien.klien",
  "api::karir.karir",
  "api::kontak.kontak",
  "api::artikel.artikel",
  "api::situs.situs",
  "api::rekanan.rekanan",
  "api::redirect.redirect",
  "api::footer.footer",
  "api::navbar.navbar",
]

/**
 * Tipe konten publik yang boleh dibaca website TANPA token (public role).
 * Beranda sudah diizinkan sejak awal; daftar ini memperluasnya ke seluruh
 * tipe halaman depan An Nasr supaya loop CMS → FE jalan tanpa API key.
 */
const PUBLIC_FIND = [
  "beranda",
  "tentang",
  "layanan",
  "portfolio",
  "klien",
  "karir",
  "kontak",
  "artikel",
  "situs",
  "rekanan",
  "redirect",
]

const AKSI_EXPLORER = [
  "plugin::content-manager.explorer.create",
  "plugin::content-manager.explorer.read",
  "plugin::content-manager.explorer.update",
  "plugin::content-manager.explorer.delete",
  "plugin::content-manager.explorer.publish",
]

/**
 * Sinkronkan label field content-manager dari schema (`config.metadatas`) ke
 * konfigurasi yang tersimpan di DB.
 *
 * Latar belakang: Strapi menyimpan konfigurasi content-manager (termasuk
 * label field) di core store dan konfigurasi DB MENIMPA default dari schema.
 * Akibatnya label schema yang UX-friendly (mis. "Jam Operasional", "Visi &
 * Misi") tidak terlihat di admin pada environment yang konfigurasinya sudah
 * pernah dibuat dengan label nama-variabel ("jamOperasional", "visiMisi").
 *
 * Fungsi ini menimpa label dari schema ke DB setiap boot (idempotent),
 * sambil MEMPERTAHANKAN pengaturan lain (layout, settings) hasil kustomisasi
 * admin. Dipanggil `RBAC_AUTO_SETUP` — matikan dengan env yang sama bila
 * ingin nonaktif (nilai default "true").
 */
const KOMPONEN_CMS: string[] = [
  // Komponen annasr (label sudah di-set di schema masing-masing).
  "annasr.alasan",
  "annasr.alur-step",
  "annasr.artikel-item",
  "annasr.baris-teks",
  "annasr.cta",
  "annasr.dokumen-client",
  "annasr.faq-item",
  "annasr.founder",
  "annasr.hero",
  "annasr.klien-item",
  "annasr.kota",
  "annasr.layanan-item",
  "annasr.milestone",
  "annasr.persyaratan-kartu",
  "annasr.posisi",
  "annasr.proyek",
  "annasr.seo-meta",
  "annasr.stat",
  "annasr.submenu-item",
  "annasr.tim-member",
  "annasr.tombol-nav",
  "annasr.visi-misi",
  // Komponen navbar/footer.
  "layout.navbar-item",
  "utilities.image-with-link",
  "utilities.link",
  "elements.footer-item",
]

export async function syncCmsFieldLabels({ strapi }: { strapi: Core.Strapi }) {
  if (process.env.RBAC_AUTO_SETUP === "false") return

  const TABLE = "strapi_core_store_settings"
  const PREFIX_CT = "plugin_content_manager_configuration_content_types::api::"
  const PREFIX_KOMPONEN = "plugin_content_manager_configuration_components::"

  try {
    const komponenKhusus = KOMPONEN_CMS.filter(
      (k) => !k.startsWith("annasr.")
    ).map((k) => `${PREFIX_KOMPONEN}${k}`)
    const tempat = komponenKhusus.map(() => "?").join(",")

    const hasil = await strapi.db.connection.raw(
      `SELECT key, value FROM ${TABLE}
         WHERE key LIKE ? OR key LIKE ? OR key IN (${tempat})`,
      [`${PREFIX_CT}%`, `${PREFIX_KOMPONEN}annasr.%`, ...komponenKhusus]
    )
    const baris = (
      Array.isArray(hasil)
        ? (hasil as unknown[])
        : ((hasil as { rows?: unknown[] }).rows ?? [])
    ) as { key: string; value: unknown }[]

    const registry = strapi.contentTypes as unknown as Record<
      string,
      { config?: unknown }
    >
    const registryKomponen = strapi.components as unknown as Record<
      string,
      { config?: unknown }
    >

    /** Terapkan label schema ke satu konfigurasi tersimpan (bool: ada berubah). */
    const terapkanLabel = (
      nilai: { metadatas?: Record<string, { edit?: { label?: string } }> },
      metadatas: Record<string, { edit?: { label?: unknown } }>
    ): boolean => {
      if (!nilai.metadatas) nilai.metadatas = {}

      let berubah = false
      for (const [nama, meta] of Object.entries(metadatas)) {
        const label = meta?.edit?.label
        if (typeof label !== "string") continue
        const target = (nilai.metadatas[nama] ??= { edit: {} })
        target.edit ??= {}
        if (target.edit.label !== label) {
          target.edit.label = label
          berubah = true
        }
      }

      return berubah
    }

    for (const row of baris) {
      const uid = row.key.startsWith(PREFIX_CT)
        ? row.key.slice(PREFIX_CT.length) // API::xxx.xxx
        : row.key.startsWith(PREFIX_KOMPONEN)
          ? row.key.slice(PREFIX_KOMPONEN.length) // annasr.xxx / layout.xxx / …
          : null
      if (!uid) continue

      const schema = registry[uid] ?? registryKomponen[uid]
      const metadatas = (schema?.config as undefined | { metadatas?: unknown })
        ?.metadatas
      if (!schema || !metadatas || typeof metadatas !== "object") continue

      let nilai: { metadatas?: Record<string, { edit?: { label?: string } }> }
      try {
        nilai = JSON.parse(String(row.value))
      } catch {
        continue
      }

      const berubah = terapkanLabel(
        nilai,
        metadatas as Record<string, { edit?: { label?: unknown } }>
      )

      if (berubah) {
        await strapi.db.connection.raw(
          `UPDATE ${TABLE} SET value = ? WHERE key = ?`,
          [JSON.stringify(nilai), row.key]
        )
      }
    }
  } catch (error) {
    console.warn("[cms-labels] sync label content-manager gagal:", error)
  }
}

export async function setupRbac({ strapi }: { strapi: Core.Strapi }) {
  if (process.env.RBAC_AUTO_SETUP === "false") {
    return
  }

  // 1) Public role -> find semua tipe konten publik (agar website bisa baca tanpa token)
  try {
    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } })
    if (publicRole) {
      for (const nama of PUBLIC_FIND) {
        const action = `api::${nama}.${nama}.find`
        const ada = await strapi.db
          .query("plugin::users-permissions.permission")
          .findOne({
            where: { action, role: publicRole.id },
          })
        if (!ada) {
          await strapi.db.query("plugin::users-permissions.permission").create({
            data: { action, role: publicRole.id },
          })
        }
      }
    }
  } catch (error) {
    console.warn("[rbac] public find gagal dipasang:", error)
  }

  // 2) Admin role "Editor Konten"
  try {
    let role = await strapi.db
      .query("admin::role")
      .findOne({ where: { code: "content-editor" } })
    if (!role) {
      role = await strapi.admin.services.role.create({
        name: "Editor Konten",
        description: "Mengelola konten website tanpa akses settings/admin",
        code: "content-editor",
      })
    }

    for (const subyek of SUBYEK_KONTEN) {
      for (const aksi of AKSI_EXPLORER) {
        const ada = await strapi.db.query("admin::permission").findOne({
          where: { action: aksi, subject: subyek, role: role.id },
        })
        if (!ada) {
          await strapi.db.query("admin::permission").create({
            data: {
              action: aksi,
              subject: subyek,
              role: role.id,
              properties: JSON.stringify({ fields: ["*"] }),
            },
          })
        }
      }
    }
  } catch (error) {
    console.warn("[rbac] role Editor Konten gagal dipasang:", error)
  }
}
