import { Reveal } from "@/components/site/Reveal"
import { SectionHeading } from "@/components/site/SectionHeading"
import { prosesKerja } from "@/data/perusahaan"

export function ProsesSection({
  items,
}: {
  items?: { judul: string; teks: string }[]
}) {
  const daftar = items ?? prosesKerja

  return (
    <section className="bg-surface px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Proses Kerja"
          judul="Tujuh tahap kerja yang terukur"
          deskripsi="Alur kerja yang sama untuk setiap proyek, sehingga progres mudah dipantau dari awal hingga serah terima."
        />

        <ol className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {daftar.map((tahap, i) => (
            <Reveal key={tahap.judul} delay={i * 0.04} className="h-full">
              <li className="border-border bg-card flex h-full flex-col items-center rounded-2xl border p-4 text-center">
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-foreground mt-3 text-sm">{tahap.judul}</h3>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {tahap.teks}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
