import type { Core } from "@strapi/strapi"

import { logger } from "./logging"

/**
 * Service Content Manager yang benar di Strapi v5 (nama `configuration` lama
 * sudah tidak di-expose — diganti `content-types` / `components`).
 */
type CmService = {
  syncConfigurations?: () => Promise<void>
  findConfiguration?: (
    model: unknown
  ) => Promise<{ metadatas?: Record<string, unknown> }>
  updateConfiguration?: (
    model: unknown,
    config: {
      settings?: unknown
      metadatas?: Record<string, unknown>
      layouts?: unknown
    }
  ) => Promise<unknown>
}

function cmService(strapi: Core.Strapi, nama: string): CmService {
  const plugin = strapi.plugin("content-manager") as
    | undefined
    | { service?: (name: string) => CmService }

  return plugin?.service?.(nama) ?? {}
}

/**
 * Ukuran default field di layout edit (meniru field-sizes Strapi).
 */
const FIELD_SIZE: Record<string, number> = {
  component: 12,
  dynamiczone: 12,
  json: 12,
  richtext: 12,
  blocks: 12,
  checkbox: 4,
  boolean: 4,
  date: 4,
  time: 4,
  biginteger: 4,
  decimal: 4,
  float: 4,
  integer: 4,
  number: 4,
  string: 6,
  text: 6,
  email: 6,
  enumeration: 6,
  media: 6,
  password: 6,
  datetime: 6,
  timestamp: 6,
  uid: 6,
}

const NON_SORTABLE = new Set([
  "component",
  "json",
  "media",
  "richtext",
  "dynamiczone",
  "blocks",
])
const NON_LISTABLE = new Set([
  "json",
  "password",
  "richtext",
  "dynamiczone",
  "blocks",
])

type Model = {
  uid?: string
  attributes?: Record<string, { type?: string }>
  config?: {
    metadatas?: Record<
      string,
      { edit?: Record<string, unknown>; list?: Record<string, unknown> }
    >
  }
}

/**
 * Bangun konfigurasi CM default utk sebuah komponen — setara dengan
 * `createDefaultConfiguration` Strapi (layout edit = urutan atribut schema,
 * label dari schema.config.metadatas).
 */
function komponenConfigDefault(model: Model): {
  settings: Record<string, unknown>
  metadatas: Record<string, unknown>
  layouts: { list: string[]; edit: { name: string; size: number }[][] }
} {
  const attrs = model.attributes ?? {}
  const nama = Object.keys(attrs)
  const mainField =
    nama.find((k) => attrs[k]?.type === "string" && k !== "id") ?? "id"
  const metadatas: Record<string, unknown> = {}
  for (const k of nama) {
    const meta = model.config?.metadatas?.[k] ?? {}
    const tipe = attrs[k]?.type ?? "string"
    metadatas[k] = {
      edit: {
        label: meta.edit?.label ?? k,
        description: meta.edit?.description ?? "",
        placeholder: meta.edit?.placeholder ?? "",
        visible: true,
        editable: true,
      },
      list: {
        label: meta.list?.label ?? k,
        searchable: !NON_SORTABLE.has(tipe),
        sortable: !NON_SORTABLE.has(tipe),
      },
    }
  }
  // layout list: maks 4 field listable pertama (urutan schema).
  const list = nama
    .filter((k) => !NON_LISTABLE.has(attrs[k]?.type ?? ""))
    .slice(0, 4)
  // layout edit: grup baris (maks 12 per baris), komponen/JSON/richtext = 1 baris penuh.
  const edit: { name: string; size: number }[][] = []
  for (const k of nama) {
    const size = FIELD_SIZE[attrs[k]?.type ?? "string"] ?? 12
    const baris = edit[edit.length - 1]
    const jml = (baris ?? []).reduce((s, i) => s + i.size, 0)
    if (size === 12 || !baris || jml + size > 12) edit.push([{ name: k, size }])
    else baris.push({ name: k, size })
  }

  return {
    settings: {
      bulkable: true,
      filterable: true,
      searchable: true,
      pageSize: 10,
      relationOpenMode: "modal",
      mainField,
      defaultSortBy: mainField,
      defaultSortOrder: "ASC",
    },
    metadatas,
    layouts: { list, edit },
  }
}

/**
 * Selaraskan konfigurasi Content Manager (urutan field, label, mainField,
 * kolom list) dengan schema.json — schema adalah sumber kebenaran.
 *
 * Strapi menyimpan layout edit di DB (`strapi_core_store_settings`) dan
 * `syncLayouts` mempertahankan urutan tersimpan. Agar urutan field di admin
 * SELALU mengikuti urutan deklarasi di schema.json (yang disusun sesuai
 * urutan render FE), konfigurasi yang tersimpan dihapus dulu, lalu
 * `syncConfigurations()` membangun ulang layout default dari schema.
 *
 * Aman untuk starter ini: label & mainField dikelola ulang dari schema oleh
 * `syncCmsFieldLabels` / `seedCmsMainField` setelahnya.
 */
export async function reconcileContentManagerLayouts({
  strapi,
}: {
  strapi: Core.Strapi
}) {
  try {
    // 1) Hapus konfigurasi tersimpan utk content type & komponen proyek
    //    agar berikutnya dibangun ulang dari urutan schema.
    const tabel = "strapi_core_store_settings"
    await strapi.db.connection.raw(
      `DELETE FROM ${tabel}
        WHERE key LIKE 'plugin_content_manager_configuration_content_types::api::%'
           OR key LIKE 'plugin_content_manager_configuration_components::annasr.%'`
    )

    // 2) Bangun ulang config CONTENT TYPE dari schema (layout default = urutan atribut).
    const conf = cmService(strapi, "content-types")
    if (typeof conf.syncConfigurations !== "function") {
      logger.warn(
        "[cms-config] service content-manager/content-types belum tersedia — urutan layout admin menyusul saat Content Manager dibuka."
      )

      return
    }

    await conf.syncConfigurations()

    // 3) Bangun ulang config KOMPONEN annasr.* (syncConfigurations tidak
    //    menjangkau komponen). Tanpa ini, field komponen di editor render
    //    kosong/disabled karena layout komponen tidak ada.
    const comp = cmService(strapi, "components")
    const komponen =
      (strapi.components as unknown as Record<string, Model>) ?? {}
    let dibangun = 0
    for (const [uid, model] of Object.entries(komponen)) {
      if (!uid.startsWith("annasr.")) continue
      if (typeof comp.updateConfiguration !== "function") break
      await comp.updateConfiguration(model, komponenConfigDefault(model))
      dibangun++
    }

    logger.info(
      `[cms-config] layout Content Manager diselaraskan dengan urutan schema (${dibangun} komponen)`
    )
  } catch (error) {
    logger.warn(`[cms-config] gagal menyelaraskan layout: ${String(error)}`)
  }
}

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
    const conf = cmService(strapi, "content-types")

    for (const [uid, fields] of Object.entries(MAIN_FIELD_PER_UID)) {
      const model = (strapi.contentTypes as unknown as Record<string, unknown>)[
        uid
      ]
      if (!model || typeof conf.findConfiguration !== "function") continue

      const current = await conf.findConfiguration(model)
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

      if (berubah && typeof conf.updateConfiguration === "function") {
        await conf.updateConfiguration(model, { ...current, metadatas })
      }
    }

    logger.info("[cms-config] mainField komponen diselaraskan")
  } catch (error) {
    logger.warn(`[cms-config] gagal menyelaraskan mainField: ${String(error)}`)
  }
}
