import type { LucideIcon } from "lucide-react"

import { Reveal } from "@/components/site/Reveal"

/**
 * State kosong konsisten untuk halaman tipis konten CMS (rekanan, karir…):
 * dipakai ketika CMS sudah online tetapi belum ada data published.
 */
export function EmptyState({
  ikon: Ikon,
  judul,
  deskripsi,
  aksi,
}: {
  ikon: LucideIcon
  judul: string
  deskripsi: string
  aksi?: React.ReactNode
}) {
  return (
    <Reveal>
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border px-6 py-16 text-center shadow-[var(--shadow-soft)]">
        <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
          <Ikon className="size-7" strokeWidth={1.5} />
        </span>
        <h2 className="text-foreground mt-5 text-xl">{judul}</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
          {deskripsi}
        </p>
        {aksi ? <div className="mt-6">{aksi}</div> : null}
      </div>
    </Reveal>
  )
}
