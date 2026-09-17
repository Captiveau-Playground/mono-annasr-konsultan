"use strict"

/**
 * Issue audit: CMS single-source cleanup für Beranda.
 *
 * Field duplikat dihapus dari single type Beranda karena FE kini membaca
 * satu sumber per section:
 *  - layanan      -> single type Layanan
 *  - portfolio    -> single type Portfolio
 *  - klien        -> single type Klien
 *  - artikel      -> single type Artikel
 *  - statistik    -> single type Tentang
 *  - kotaProyek   -> single type Tentang
 *  - jangkauan*   -> single type Tentang
 *
 * DEFENSIF: migration berjalan di boot SEBELUM schema sync, jadi pada
 * database baru tabel/kolom yang dihapus mungkin belum pernah dibuat.
 * Semua operasi dijaga dengan cek keberadaan (hasTable / hasColumn).
 */

const FIELD_KOMPONEN = [
  "statistik",
  "layanan",
  "portfolio",
  "klien",
  "kotaProyek",
  "artikel",
]

module.exports = {
  async up(knex) {
    // 1) Entri komponen repeatable milik Beranda (join table) — hanya ada
    //    bila data lama pernah tersimpan; DB baru tidak punya tabel ini.
    if (await knex.schema.hasTable("berandas_cmps")) {
      await knex("berandas_cmps").whereIn("field", FIELD_KOMPONEN).del()
    }

    // 2) Kolom string polos yang sudah tidak dipakai.
    if (await knex.schema.hasTable("berandas")) {
      const jangkauanJudul = await knex.schema.hasColumn(
        "berandas",
        "jangkauan_judul"
      )
      const jangkauanDeskripsi = await knex.schema.hasColumn(
        "berandas",
        "jangkauan_deskripsi"
      )

      if (jangkauanJudul || jangkauanDeskripsi) {
        await knex.schema.alterTable("berandas", (t) => {
          if (jangkauanJudul) t.dropColumn("jangkauan_judul")
          if (jangkauanDeskripsi) t.dropColumn("jangkauan_deskripsi")
        })
      }
    }
  },

  async down(knex) {
    if (await knex.schema.hasTable("berandas")) {
      await knex.schema.alterTable("berandas", (t) => {
        t.text("jangkauan_judul")
        t.text("jangkauan_deskripsi")
      })
    }
  },
}
