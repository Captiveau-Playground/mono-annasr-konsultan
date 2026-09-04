import { Compass, Flag } from "lucide-react"

import { Reveal } from "@/components/site/Reveal"

const KARTU_STATIS = [
  {
    ikon: Compass,
    judul: "Visi",
    teks: "Menjadi mitra konsultan teknik dan konstruksi yang terpercaya di Jawa Timur melalui kualitas pekerjaan dan integritas layanan.",
  },
  {
    ikon: Flag,
    judul: "Misi",
    teks: "Menghadirkan perencanaan yang akurat, pengawasan yang disiplin, serta pelaksanaan konstruksi yang tepat mutu, biaya, dan waktu.",
  },
]

export function VisiMisi({
  kartu = [],
}: {
  kartu?: { judul: string; teks: string }[]
}) {
  const daftar =
    kartu.length > 0
      ? kartu.map((k, i) => ({ ...k, ikon: [Compass, Flag][i % 2] ?? Compass }))
      : KARTU_STATIS

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Arahan Perusahaan
          </p>
          <h2 className="text-foreground mt-4 text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
            Visi & Misi
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {daftar.map((k, i) => {
            const Ikon = k.ikon

            return (
              <Reveal key={k.judul} delay={i * 0.08} className="h-full">
                <div className="group border-border bg-card hover:border-primary/25 h-full rounded-[20px] border p-8 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] lg:p-10">
                  <span className="bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-13 items-center justify-center rounded-2xl transition-colors duration-200">
                    <Ikon className="size-6" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-foreground mt-6 text-2xl font-bold">
                    {k.judul}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-base leading-8">
                    {k.teks}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
