import type { Core } from "@strapi/strapi"

/**
 * Melengkapi konversi single → collection untuk 5 tipe daftar
 * (lihat `database/migrations/20260917_convert_lists_to_collections.js`).
 *
 * Migration menyalin data komponen lama ke tabel staging `_mig_*` (jsonb)
 * SEBELUM schema sync menghapus atribut lama. Bootstrap ini berjalan
 * SETELAH sync dan membuat dokumen collection dari staging lewat
 * `strapi.documents`, plus memindahkan intro halaman (hero/*) ke situs.
 *
 * Idempotent & aman:
 *  - Bila collection sudah punya dokumen → staging dibuang tanpa ditulis ulang.
 *  - Intro hanya diisi bila situs masih kosong untuk field tsb.
 */

type ItemData = Record<string, unknown>

const KONFIG: { uid: string; mig: string }[] = [
  { uid: "api::layanan.layanan", mig: "_mig_layanan" },
  { uid: "api::portfolio.portfolio", mig: "_mig_portfolio" },
  { uid: "api::klien.klien", mig: "_mig_klien" },
  { uid: "api::karir.karir", mig: "_mig_karir" },
  { uid: "api::artikel.artikel", mig: "_mig_artikel" },
]

export async function liftCollections({ strapi }: { strapi: Core.Strapi }) {
  const db = strapi.db.connection

  // 1) Intro halaman (dulu di single type masing-masing) → situs.
  if (await db.schema.hasTable("_mig_intros")) {
    try {
      const row = (await db("_mig_intros").select("data").first()) as
        | undefined
        | { data: Record<string, Record<string, string>> }

      if (row?.data) {
        const situs = strapi.documents("api::situs.situs" as never) as any
        const ada = await situs.findFirst({})

        if (ada) {
          const update: Record<string, string> = {}
          for (const entri of Object.values(row.data)) {
            for (const [field, value] of Object.entries(entri)) {
              const nilaiAda = ada[field] as string | undefined
              if (value && !nilaiAda) {
                update[field] = value
              }
            }
          }

          if (Object.keys(update).length > 0) {
            await situs.update({
              documentId: ada.documentId,
              data: update,
              status: "published",
            })
          }
        }
      }
    } catch (error) {
      console.warn("[lift] intro halaman gagal dipindah:", String(error))
    } finally {
      await db.schema.dropTable("_mig_intros")
    }
  }

  // 2) Dokumen collection dari staging.
  for (const { uid, mig } of KONFIG) {
    if (!(await db.schema.hasTable(mig))) continue

    try {
      const rows = (await db(mig).select("data").orderBy("id", "asc")) as {
        data: ItemData
      }[]
      if (rows.length === 0) continue

      const docs = strapi.documents(uid as never) as any
      const ada = await docs.findMany({
        pagination: { page: 1, pageSize: 1 },
        status: "published",
      })
      const sudahTerisi = Number(ada?.meta?.pagination?.total ?? 0) > 0

      if (!sudahTerisi) {
        let sukses = 0
        for (const { data } of rows) {
          try {
            await docs.create({ data, status: "published" })
            sukses += 1
          } catch (error) {
            console.warn(`[lift] create ${uid} gagal:`, String(error))
          }
        }
        console.log(`[lift] ${uid}: ${sukses}/${rows.length} dokumen dibuat.`)
      }
    } catch (error) {
      console.warn(`[lift] staging ${mig} gagal diproses:`, String(error))
    } finally {
      try {
        await db.schema.dropTable(mig)
      } catch {
        // staging sudah hilang / hal lain — tidak fatal.
      }
    }
  }
}
