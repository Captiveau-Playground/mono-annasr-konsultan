import { SectionShell } from "@/components/site/SectionShell"

/**
 * Section "Dipercaya oleh Berbagai Klien".
 *
 * Kondisional sesuai jumlah data (dari CMS beranda.klien):
 * - <= 12 item → marquee (looping infinit) satu baris nama klien
 * - > 12 item  → grid dinamis maksimal 3 baris (kolom mengikuti jumlah)
 */
function kolomGrid(jumlah: number): string {
  const cols = Math.min(6, Math.max(3, Math.ceil(jumlah / 3)))
  const kelas: Record<number, string> = {
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
  }

  return kelas[cols] ?? "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6"
}

const AMBANG_MARQUEE = 12

export function KlienSection({
  items = [],
}: {
  /** Nama klien dari CMS (beranda.klien). */
  items?: string[]
}) {
  const daftar = items.filter(Boolean)
  const banyak = daftar.length > AMBANG_MARQUEE

  return (
    <SectionShell tone="krem" judul={"Dipercaya oleh\nBerbagai Klien"}>
      {banyak ? (
        <div className={`grid gap-4 ${kolomGrid(daftar.length)}`}>
          {daftar.map((nama) => (
            <div
              key={nama}
              className="border-border bg-card flex h-full items-center justify-center rounded-xl border px-5 py-6 text-center shadow-[var(--shadow-soft)]"
            >
              <span className="text-foreground text-sm font-semibold tracking-wide">
                {nama}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="marquee-mask overflow-hidden" aria-hidden="true">
          <ul className="marquee-track flex w-max items-center gap-4">
            {/* Duplikasi 2x agar loop mulus (animasi geser -50%). */}
            {[daftar, daftar].flat().map((nama, i) => (
              <li
                key={`${nama}-${i}`}
                className="border-border bg-card flex min-h-12 w-44 shrink-0 items-center justify-center rounded-lg border px-4 text-center shadow-[var(--shadow-soft)]"
              >
                <span className="text-foreground text-xs font-semibold sm:text-sm">
                  {nama}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionShell>
  )
}
