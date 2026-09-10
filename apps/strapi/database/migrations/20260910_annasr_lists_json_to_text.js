"use strict"

/**
 * Issue batch 2: field daftar JSON -> text (textarea) agar admin Strapi tidak
 * lagi merender code editor. Data lama (string JSON array) diubah jadi satu
 * baris per elemen. Cast `json -> text` legal di postgres.
 *
 * Kolom & tabel yang diubah:
 *  - components_annasr_layanan_items:      detail, manfaat
 *  - components_annasr_persyaratan_kartus: daftar
 *  - components_annasr_dokumen_clients:    daftar
 *  - components_annasr_artikel_items:      isi
 */

const TARGETS = [
  { table: "components_annasr_layanan_items", column: "detail" },
  { table: "components_annasr_layanan_items", column: "manfaat" },
  { table: "components_annasr_persyaratan_kartus", column: "daftar" },
  { table: "components_annasr_dokumen_clients", column: "daftar" },
  { table: "components_annasr_artikel_items", column: "isi" },
]

async function ubahKeTeks(knex, table, column) {
  await knex.raw(
    `ALTER TABLE ${table} ALTER COLUMN ${column} TYPE text USING ${column}::text`
  )

  // JSON array lama (["a","b"]) -> satu baris per elemen.
  await knex.raw(
    String.raw`UPDATE ${table}
     SET ${column} = COALESCE((
       SELECT string_agg(elem #>> '{}', E'\n')
       FROM json_array_elements(${column}::json) AS elem
     ), ${column})
     WHERE ${column} IS NOT NULL AND ${column}::text LIKE '[%'`
  )
}

module.exports = {
  async up(knex) {
    for (const { table, column } of TARGETS) {
      const ada = await knex.schema.hasColumn(table, column)
      if (!ada) continue
      await ubahKeTeks(knex, table, column)
    }
  },
  async down(knex) {
    for (const { table, column } of TARGETS) {
      const ada = await knex.schema.hasColumn(table, column)
      if (!ada) continue
      await knex.raw(
        `ALTER TABLE ${table} ALTER COLUMN ${column} TYPE json USING ${column}::json`
      )
    }
  },
}
