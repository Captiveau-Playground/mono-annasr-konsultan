import type { Core } from "@strapi/strapi"

const UID = "api::layanan.layanan"
const MAX_GALERI = 8

/**
 * Batasi jumlah file di field `galeri` pada collection Layanan.
 * UI hanya menampilkan maksimal 8 gambar (1 utama + 7 thumbnail genap),
 * sehingga dipaksa konsisten di CMS.
 * Gagal dengan pesan jelas bila melebihi batas.
 */
export const registerLayananGaleriGuard = ({
  strapi,
}: {
  strapi: Core.Strapi
}) => {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== UID) return next()

    if (context.action === "create" || context.action === "update") {
      const data = (context.params as { data?: unknown })?.data
      const galeri = (data as undefined | { galeri?: unknown })?.galeri
      if (Array.isArray(galeri) && galeri.length > MAX_GALERI) {
        throw new Error(
          `Galeri layanan maksimal ${MAX_GALERI} file. Kurangi jumlah file di galeri.`
        )
      }
    }

    return next()
  })
}
