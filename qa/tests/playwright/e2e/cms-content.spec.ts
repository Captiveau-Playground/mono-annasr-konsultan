import { expect, test } from "@playwright/test"

/**
 * E2E: buktikan halaman UI mengonsumsi data dari CMS (bukan fallback statis)
 * DAN perubahan CMS tampil realtime (lewat auto-revalidate, bukan nunggu TTL).
 *
 * Cara kerja:
 *   1. Baca brandTagline situs saat ini dari Strapi (GET /API/situs).
 *   2. Tulis nilai unik QA-<timestamp> ke situs.brandTagline lalu PUBLISH (PUT).
 *      Nilai unik ini TIDAK ADA di fallback statis, jadi kalau halaman bisa
 *      menampilkannya → pasti bersumber dari CMS.
 *   3. Buka "/" dan harapkan marker muncul dalam waktu singkat (realtime).
 *   4. Kembalikan nilai asli (cleanup) di akhir.
 *
 * Persyaratan env (di qa/tests/playwright/.env):
 *   BASE_URL            — URL UI yang ditest (dipakai config playwright)
 *   E2E_STRAPI_URL      — URL Strapi, mis. https://cms-annasr.captiveau.id
 *   E2E_STRAPI_TOKEN    — API token Strapi yang boleh update+publish situs
 *                         (buat di admin → Settings → API Tokens, beri
 *                         permission update & publish pada content-type "Situs").
 *
 * Tanpa env tersebut test di-skip otomatis.
 */

const strapiUrl = process.env.E2E_STRAPI_URL
const token = process.env.E2E_STRAPI_TOKEN

const marker = `QA-CMS-${Date.now()}`

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${strapiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(
      `Strapi ${init?.method ?? "GET"} ${path} → ${res.status} ${res.statusText}`
    )
  }

  return (await res.json()) as T
}

function isApiError(body: unknown): body is { error: { status: number } } {
  return typeof body === "object" && body != null && "error" in body
}

/** Update single-type "Situs" — coba bentuk v5 (dengan documentId), fallback ke v4-style. */
async function updateSitus(
  documentId: string | undefined,
  data: Record<string, unknown>
) {
  const body = JSON.stringify({ data })
  const suffixes = documentId
    ? [`/api/situs/${documentId}?status=published&locale=en`]
    : []
  suffixes.push("/api/situs?status=published&locale=en")
  for (const suffix of suffixes) {
    const res = await fetch(`${strapiUrl}${suffix}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    })
    if (res.ok) return (await res.json()) as { data?: unknown }
    let err: unknown = {}
    try {
      err = await res.json()
    } catch {
      // body bukan JSON — lanjut coba bentuk endpoint lain
    }
    if (isApiError(err)) continue
    throw new Error(`PUT ${suffix} → ${res.status}`)
  }

  throw new Error(
    "Gagal update situs via REST (cek permission token / bentuk endpoint)"
  )
}

test.describe("Content dari CMS vs fallback", () => {
  test.skip(
    !strapiUrl || !token,
    "Set E2E_STRAPI_URL dan E2E_STRAPI_TOKEN untuk menjalankan tes ini"
  )

  test("nilai unik dari CMS tampil & realtime setelah publish", async ({
    page,
  }) => {
    // 1. Ambil dokumen Situs saat ini
    const current = await api<{
      data?: { documentId?: string; brandTagline?: string | null }
    }>("/api/situs?status=published&locale=en&populate=navigasi")
    const documentId = current.data?.documentId
    const original = current.data?.brandTagline ?? ""

    let restoreError: unknown
    try {
      // 2. Tulis marker unik + publish (memicu auto-revalidate ke UI)
      await updateSitus(documentId, { brandTagline: marker })

      // 3. Halaman harus menampilkan marker — tidak mungkin dari fallback statis.
      //    Timeout pendek membuktikan perubahan dari CMS realtime (bukan 120s TTL).
      await page.goto("/", { waitUntil: "domcontentloaded" })
      await expect(page.getByText(marker, { exact: false })).toBeVisible({
        timeout: 20_000,
      })
    } finally {
      // 4. Kembalikan nilai asli + publish supaya tidak mengotori CMS
      try {
        await updateSitus(documentId, { brandTagline: original })
      } catch (error) {
        restoreError = error
      }
    }

    if (restoreError) {
      throw new Error("Gagal mengembalikan brandTagline ke nilai aslinya", {
        cause: restoreError,
      })
    }
  })
})
