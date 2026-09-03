import { SectionShell } from "@/components/site/SectionShell"

type ItemKlien = { nama: string; logo?: string }

const ITEM_PER_BARIS = 8
const MAKS_BARIS = 4

/**
 * Section "Dipercaya oleh Berbagai Klien".
 *
 * - Logo client (dari CMS beranda.klien.logo), fallback teks nama bila belum
 *   diisi.
 * - Tinggi DINAMIS: jumlah baris marquee mengikuti banyaknya data
 *   (rows = ceil(n / 8), maks 4) — tidak ada tinggi fix.
 */
function potongBaris(daftar: ItemKlien[], baris: number): ItemKlien[][] {
  if (baris <= 1) return [daftar]

  const hasil: ItemKlien[][] = []
  const perBaris = Math.ceil(daftar.length / baris)

  for (let i = 0; i < baris; i += 1) {
    hasil.push(daftar.slice(i * perBaris, (i + 1) * perBaris))
  }

  return hasil.filter((b) => b.length > 0)
}

function BarisMarquee({
  items,
  indeks,
}: {
  items: ItemKlien[]
  indeks: number
}) {
  const kelas = ["marquee-track", "marquee-track-rev", "marquee-track-slow"][
    indeks % 3
  ]

  return (
    <ul className={`${kelas} flex w-max items-center gap-4`}>
      {/* Duplikasi 2x agar loop mulus (animasi geser -50%). */}
      {[items, items].flat().map((item, i) => (
        <li
          key={`${item.nama}-${i}`}
          aria-hidden={i >= items.length}
          className="border-border bg-card flex min-h-14 shrink-0 items-center justify-center rounded-xl border px-6 shadow-[var(--shadow-soft)]"
        >
          {item.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logo}
              alt={`${item.nama} — logo`}
              loading="lazy"
              className="max-h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-foreground text-sm font-semibold">
              {item.nama}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export function KlienSection({ items = [] }: { items?: ItemKlien[] }) {
  const daftar = items.filter((k) => k.nama)
  const baris = Math.min(
    MAKS_BARIS,
    Math.max(1, Math.ceil(daftar.length / ITEM_PER_BARIS))
  )
  const barisPotong = potongBaris(daftar, baris)

  return (
    <SectionShell tone="krem" judul={"Dipercaya oleh\nBerbagai Klien"}>
      <div className="marquee-mask space-y-5">
        {barisPotong.map((b, i) => (
          <BarisMarquee key={i} items={b} indeks={i} />
        ))}
      </div>
    </SectionShell>
  )
}
