"use strict"

/**
 * Hapus content type yang TIDAK dipakai di frontend live (audit pemakaian):
 *  - API page          (page-builder dormant — FE pakai rute legacy)
 *  - API::hierarchy.hierarchy (bagian page-builder)
 *  - API::subscriber.subscriber (hanya form page-builder yang dormant)
 *
 * Tabel dihapus DEFENSIF (hanya bila ada). Keep: redirect (dipakai
 * middleware), users-permissions (Public role = sumber baca publik).
 */

const TABEL = [
  "pages",
  "pages_components",
  "hierarchies",
  "hierarchies_components",
  "subscribers",
  "subscribers_components",
]

module.exports = {
  async up(knex) {
    for (const tabel of TABEL) {
      if (await knex.schema.hasTable(tabel)) {
        // CASCADE: beberapa tabel dependen (join/FK) ikut dihapus.
        await knex.raw(`DROP TABLE IF EXISTS "${tabel}" CASCADE`)
      }
    }
  },

  async down(knex) {
    // Tidak ada rollback otomatis untuk hapus content type (data sudah
    // dihapus); butuh re-import baseline bila ingin dipulihkan.
  },
}
