import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

const UID_REKANAN = "api::rekanan.rekanan" as UID.ContentType

export type RekananItem = {
  nama: string
  instansi: string
  keterangan: string
  gambar?: string
  alt: string
}

type RawRekanan = {
  nama?: unknown
  instansi?: unknown
  keterangan?: unknown
  sertifikat?: { url?: unknown; alternativeText?: unknown }[]
}

function teks(v: unknown, fb: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fb
}

function resolv(mungkin: unknown): string | undefined {
  if (typeof mungkin !== "string" || !mungkin) return undefined
  if (mungkin.startsWith("http")) return mungkin
  if (!mungkin.startsWith("/uploads/")) return mungkin
  const base = process.env.STRAPI_URL?.replace(/\/$/, "")

  return base ? `${base}${mungkin}` : mungkin
}

/**
 * Ambil daftar rekanan published dari Strapi.
 * Tanpa data → array kosong (halaman sebaiknya notFound di caller).
 */
export async function fetchRekanan(_locale: Locale): Promise<RekananItem[]> {
  try {
    const result = (await PublicStrapiClient.fetchMany(
      UID_REKANAN,
      {
        sort: { createdAt: "asc" },
        pagination: { page: 1, pageSize: 100 },
        populate: { sertifikat: true },
      } as never,
      {
        next: {
          revalidate: 120,
          tags: [strapiCacheTag("api::rekanan.rekanan")],
        },
      } as never,
      { doNotAddLocaleQueryParams: true }
    )) as undefined | { data?: RawRekanan[] }

    return (result?.data ?? [])
      .map((r, i): RekananItem => {
        const nama = teks(r.nama, `Rekanan ${i + 1}`)

        return {
          nama,
          instansi: teks(r.instansi, ""),
          keterangan: teks(r.keterangan, ""),
          gambar: resolv(r.sertifikat?.[0]?.url),
          alt: teks(r.sertifikat?.[0]?.alternativeText, nama),
        }
      })
      .filter((item) => item.nama.length > 0)
  } catch (error) {
    logNonBlockingError({
      message: "Error fetching rekanan, returning empty list",
      error: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    return []
  }
}
