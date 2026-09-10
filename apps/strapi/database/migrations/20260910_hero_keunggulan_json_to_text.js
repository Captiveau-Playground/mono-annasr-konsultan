"use strict"

/**
 * Issue 2: `annasr.hero.keunggulan` berubah `json` -> `text`.
 *
 * Sebelumnya `keunggulan` bertipe JSON sehingga admin Strapi merender code
 * editor. Diubah ke `text` (textarea) — satu baris = satu poin.
 *
 * Migrasi:
 * 1. Cast kolom `json` -> `text` (legal di postgres, tanpa mengubah isi).
 * 2. Data lama (string JSON array, mis. `["Berdiri sejak 2014", ...]`)
 *    diubah menjadi teks berbaris (satu elemen per baris) agar langsung
 *    rapi di textarea admin & frontend.
 *
 * Scope: components_annasr_heroes.keunggulan
 */

const TABLE = "components_annasr_heroes"
const COLUMN = "keunggulan"

module.exports = {
  async up(knex) {
    const ada = await knex.schema.hasColumn(TABLE, COLUMN)
    if (!ada) return

    await knex.raw(
      `ALTER TABLE ${TABLE} ALTER COLUMN ${COLUMN} TYPE text USING ${COLUMN}::text`
    )

    // JSON array lama -> satu baris per elemen (strip tanda kutip).
    await knex.raw(
      String.raw`UPDATE ${TABLE}
       SET ${COLUMN} = COALESCE((
         SELECT string_agg(elem #>> '{}', E'\n')
         FROM json_array_elements(${COLUMN}::json) AS elem
       ), ${COLUMN})
       WHERE ${COLUMN} IS NOT NULL AND ${COLUMN}::text LIKE '[%'`
    )
  },
  async down(knex) {
    const ada = await knex.schema.hasColumn(TABLE, COLUMN)
    if (!ada) return

    await knex.raw(
      `ALTER TABLE ${TABLE} ALTER COLUMN ${COLUMN} TYPE json USING ${COLUMN}::json`
    )
  },
}
