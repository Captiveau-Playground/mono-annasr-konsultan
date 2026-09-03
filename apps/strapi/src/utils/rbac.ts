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
  "api::page.page",
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
]

const AKSI_EXPLORER = [
  "plugin::content-manager.explorer.create",
  "plugin::content-manager.explorer.read",
  "plugin::content-manager.explorer.update",
  "plugin::content-manager.explorer.delete",
  "plugin::content-manager.explorer.publish",
]

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
