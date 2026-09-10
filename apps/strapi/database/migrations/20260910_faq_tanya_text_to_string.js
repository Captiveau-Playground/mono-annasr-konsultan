"use strict"

/**
 * Issue 11: `annasr.faq-item.tanya` berubah `text` -> `string`.
 *
 * Strapi memakai atribut `string` pertama sebagai judul accordion pada
 * repeatable component (mainField). Tanpa ini semua item FAQ tampil sebagai
 * "FAQ (Item) 1/2/3". Cast ini aman: postgres `text` -> `varchar(255)`.
 *
 * Scope: components_annasr_faq_items.tanya
 */

const TABLE = "components_annasr_faq_items"
const COLUMN = "tanya"

module.exports = {
  async up(knex) {
    const ada = await knex.schema.hasColumn(TABLE, COLUMN)
    if (!ada) return

    await knex.raw(
      `ALTER TABLE ${TABLE} ALTER COLUMN ${COLUMN} TYPE varchar(255) USING ${COLUMN}::varchar(255)`
    )
  },
  async down(knex) {
    const ada = await knex.schema.hasColumn(TABLE, COLUMN)
    if (!ada) return

    await knex.raw(
      `ALTER TABLE ${TABLE} ALTER COLUMN ${COLUMN} TYPE text USING ${COLUMN}::text`
    )
  },
}
