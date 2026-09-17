"use strict"

/**
 * Konversi 5 tipe daftar dari singleType → collectionType
 * (layanan, portfolio, klien, karir, artikel).
 *
 * Konsekuensi schema: kolom intro (hero_* / intro_*) dan atribut komponen
 * repeatable (`layanan`, `proyek`, `klien`, `posisi`, `artikel`) hilang saat
 * sync. Migration ini mengamankan data komponen lama ke tabel staging
 * `_mig_*` (jsonb) SEBELUM schema sync, lalu bootstrap
 * (`src/utils/lift-lists.ts`) membuat dokumen collection baru setelah sync.
 *
 * Sangat defensif — tujuannya TIDAK PERNAH menggagalkan boot:
 *  - setiap tabel dicek keberadaannya dulu,
 *  - kolom intro (mungkin sudah hilang) dicek via hasColumn,
 *  - bila join-table `*_cmps` sudah hilang (mis. sync pernah berjalan lebih
 *    dulu), fallback: salin seluruh baris tabel komponen (urut by id).
 *
 * Idempotent: hanya menyalin bila staging masih kosong.
 */

const TIPE = [
  {
    uid: "layanan",
    cmpsTable: "layanans_cmps",
    field: "layanan",
    mainTable: "layanans",
    componentTable: "components_annasr_layanan_items",
    nested: {
      alur: "components_annasr_alur_steps",
      persyaratan: "components_annasr_persyaratan_kartus",
      dokumenClient: "components_annasr_dokumen_clients",
    },
    introsKeys: ["layananIntroJudul", "layananIntroDeskripsi"],
    introsCols: ["intro_judul", "intro_deskripsi"],
    skipKomponen: [],
  },
  {
    uid: "portfolio",
    cmpsTable: "portfolios_cmps",
    field: "proyek",
    mainTable: "portfolios",
    componentTable: "components_annasr_proyeks",
    nested: {},
    introsKeys: ["portfolioHeroJudul", "portfolioHeroDeskripsi"],
    introsCols: ["hero_judul", "hero_deskripsi"],
    skipKomponen: [],
  },
  {
    uid: "klien",
    cmpsTable: "kliens_cmps",
    field: "klien",
    mainTable: "kliens",
    componentTable: "components_annasr_klien_items",
    nested: {},
    introsKeys: ["klienHeroJudul", "klienHeroDeskripsi"],
    introsCols: ["hero_judul", "hero_deskripsi"],
    skipKomponen: [],
  },
  {
    uid: "karir",
    cmpsTable: "karirs_cmps",
    field: "posisi",
    mainTable: "karirs",
    componentTable: "components_annasr_posisis",
    nested: {
      tanggungJawab: "components_annasr_baris_teks",
      kualifikasi: "components_annasr_baris_teks",
      manfaat: "components_annasr_baris_teks",
    },
    introsKeys: ["karirHeroJudul", "karirHeroDeskripsi"],
    introsCols: ["hero_judul", "hero_deskripsi"],
    skipKomponen: ["teks"],
  },
  {
    uid: "artikel",
    cmpsTable: "artikels_cmps",
    field: "artikel",
    mainTable: "artikels",
    componentTable: "components_annasr_artikel_items",
    nested: {},
    introsKeys: ["artikelHeroJudul", "artikelHeroDeskripsi"],
    introsCols: ["hero_judul", "hero_deskripsi"],
    skipKomponen: [],
  },
]

async function adaKolom(knex, tabel, kolom) {
  const rows = await knex.raw(
    "select column_name from information_schema.columns where table_name = ? and column_name = ?",
    [tabel, kolom]
  )

  return rows.rows.length > 0
}

/** Baca baris komponen (skalar) + komponen bertingkat bila ada. */
async function bacaKomponen(
  knex,
  tabel,
  id,
  nested,
  skipKolom = [],
  dalam = 0
) {
  if (dalam > 3 || !(await knex.schema.hasTable(tabel))) {
    return null
  }
  const kolom = (
    await knex.raw(
      "select column_name from information_schema.columns where table_name = ?",
      [tabel]
    )
  ).rows
    .map((r) => r.column_name)
    .filter((c) => c !== "id" && !skipKolom.includes(c))

  const baris = await knex(tabel).select(kolom).where({ id }).first()
  if (!baris) return null
  delete baris.created_at
  delete baris.updated_at

  // Komponen bertingkat (mis. alur/persyaratan/dokumenClient di layanan).
  if (Object.keys(nested).length > 0) {
    const cmpsTabel = `${tabel}_cmps`
    if (await knex.schema.hasTable(cmpsTabel)) {
      const taut = await knex(cmpsTabel)
        .select("cmp_id", "field", "order")
        .where({ entity_id: id })
        .orderBy("order", "asc")
      for (const t of taut) {
        const fieldKarakter = nested[t.field]
        if (!fieldKarakter) continue
        const anak = await bacaKomponen(
          knex,
          fieldKarakter,
          t.cmp_id,
          {},
          [],
          dalam + 1
        )
        if (!anak) continue
        const fieldRepeatable = t.field !== "dokumenClient"
        if (fieldRepeatable) {
          baris[t.field] = baris[t.field] ?? []
          baris[t.field].push(anak)
        } else {
          baris[t.field] = anak
        }
      }
    }
  }

  return baris
}

module.exports = {
  async up(knex) {
    for (const t of TIPE) {
      try {
        if (!(await knex.schema.hasTable(t.componentTable))) continue

        if (!(await knex.schema.hasTable(`_mig_${t.uid}`))) {
          await knex.schema.createTable(`_mig_${t.uid}`, (tb) => {
            tb.increments("id")
            tb.jsonb("data")
          })
        }
        const sudah = await knex(`_mig_${t.uid}`).count({ n: "*" }).first()
        if (Number(sudah.n) > 0) continue

        const simpulkan = async (data) => {
          if (data) await knex(`_mig_${t.uid}`).insert({ data })
        }

        if (await knex.schema.hasTable(t.cmpsTable)) {
          // Jalur normal: join-table masih ada → baca per entitas terbaru.
          const maxEntity = await knex(t.cmpsTable)
            .max({ m: "entity_id" })
            .first()
          const entityId = Number(maxEntity?.m)
          if (entityId) {
            const tautan = await knex(t.cmpsTable)
              .select("cmp_id", "field", "order")
              .where({ entity_id: entityId, field: t.field })
              .orderBy("order", "asc")
            for (const taut of tautan) {
              const komponen = await bacaKomponen(
                knex,
                t.componentTable,
                taut.cmp_id,
                t.nested,
                t.skipKomponen
              )
              await simpulkan(komponen)
            }

            const entityIdAman = entityId
            const intros = {}
            if (
              t.introsCols.length &&
              (await knex.schema.hasTable(t.mainTable))
            ) {
              for (const col of t.introsCols) {
                if (await adaKolom(knex, t.mainTable, col)) {
                  const baris = await knex(t.mainTable)
                    .select(col)
                    .where({ id: entityIdAman })
                    .first()
                  const nilai = baris?.[col]
                  if (nilai) intros[col] = nilai
                }
              }
              if (Object.keys(intros).length > 0) {
                if (!(await knex.schema.hasTable("_mig_intros"))) {
                  await knex.schema.createTable("_mig_intros", (tb) => {
                    tb.increments("id")
                    tb.jsonb("data")
                  })
                }
                const ada = await knex("_mig_intros").select("data").first()
                const data = {
                  ...ada?.data,
                  [t.uid]: {
                    [t.introsKeys[0]]: intros[t.introsCols[0]] ?? "",
                    [t.introsKeys[1]]: intros[t.introsCols[1]] ?? "",
                  },
                }
                if (ada) await knex("_mig_intros").update({ data })
                else await knex("_mig_intros").insert({ data })
              }
            }
          }
        } else {
          // Fallback: join-table sudah hilang (sync pernah berjalan lebih
          // dulu) → salin seluruh baris tabel komponen, urut by id.
          const baris = await knex(t.componentTable)
            .select("id")
            .orderBy("id", "asc")
          for (const b of baris) {
            const komponen = await bacaKomponen(
              knex,
              t.componentTable,
              b.id,
              t.nested,
              t.skipKomponen
            )
            await simpulkan(komponen)
          }
        }
      } catch (error) {
        console.warn(
          `[migrasi] staging ${t.uid} dilewati (best-effort):`,
          String(error)
        )
      }
    }
  },

  async down(knex) {
    for (const t of TIPE) {
      if (await knex.schema.hasTable(`_mig_${t.uid}`)) {
        await knex.schema.dropTable(`_mig_${t.uid}`)
      }
    }
    if (await knex.schema.hasTable("_mig_intros")) {
      await knex.schema.dropTable("_mig_intros")
    }
  },
}
