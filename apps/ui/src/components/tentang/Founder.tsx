import { Quote } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { founder } from "@/data/perusahaan"

export function Founder({
  data,
}: {
  data?: { nama?: string; jabatan?: string; teks?: string; kutipan?: string }
}) {
  return (
    <section className="bg-secondary text-primary-foreground relative overflow-hidden py-20 lg:py-24">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.08]"
        aria-hidden
      />
      <div className="bg-accent/10 pointer-events-none absolute -top-24 right-0 size-96 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* 5/12 — foto founder */}
          <div className="lg:col-span-5">
            <Reveal arah="left">
              <div className="relative mx-auto max-w-md">
                <div className="from-accent/30 to-primary/20 absolute -inset-3 rounded-[24px] bg-gradient-to-br blur-sm" />
                <div className="relative overflow-hidden rounded-[20px] shadow-[0_28px_64px_-26px_rgba(0,0,0,0.5)]">
                  <Image
                    src="/images/annasr/founder.jpg"
                    alt={`${data?.nama ?? founder.nama}, ${data?.jabatan ?? founder.jabatan} CV. AN NASR KONSULTAN`}
                    width={820}
                    height={1000}
                    sizes="(min-width:1024px) 42vw, 100vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* 7/12 — biografi */}
          <div className="lg:col-span-7">
            <Reveal arah="right">
              <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase">
                Founder
              </p>
              <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl">
                {founder.nama}
              </h2>
              <p className="text-accent mt-3 text-lg font-semibold">
                {data?.jabatan ?? founder.jabatan}
              </p>
              <div className="text-primary-foreground/80 mt-7 max-w-[42rem] space-y-4 text-lg leading-8">
                <p>{founder.teks}</p>
              </div>

              <figure className="border-primary-foreground/15 bg-primary-foreground/5 mt-9 rounded-[20px] border p-7">
                <Quote className="text-accent size-8" aria-hidden />
                <blockquote className="text-primary-foreground/90 mt-3 text-lg leading-8">
                  &ldquo;Setiap pekerjaan harus dapat dipertanggungjawabkan
                  secara teknis maupun moral.&rdquo;
                </blockquote>
                <figcaption className="text-primary-foreground/60 mt-3 text-sm">
                  — {founder.nama}, {data?.jabatan ?? founder.jabatan}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
