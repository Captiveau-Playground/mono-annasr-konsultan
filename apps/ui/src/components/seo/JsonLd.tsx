/**
 * Merender satu atau lebih blok JSON-LD (schema.org) di dalam halaman.
 * Server Component murni — tanpa JS client.
 */
export function JsonLd({
  data,
}: {
  data: (Record<string, unknown> | null | undefined)[]
}) {
  const bersih = data.filter((d): d is Record<string, unknown> =>
    Boolean(d && typeof d === "object")
  )

  if (bersih.length === 0) return null

  return (
    <>
      {bersih.map((obj, i) => {
        const id =
          (obj["@id"] as string | undefined) ??
          (obj["@type"] as string | undefined) ??
          `ld-${i}`

        return (
          <script
            key={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        )
      })}
    </>
  )
}
