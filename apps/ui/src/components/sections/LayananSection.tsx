import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { Button } from "@/components/ui/button"
import { layanan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

export function LayananSection({ lengkap = false }: { lengkap?: boolean }) {
  if (lengkap) {
    return (
      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="space-y-20">
            {layanan.map((item, i) => {
              const Ikon = item.ikon

              return (
                <Reveal key={item.slug} delay={0.05}>
                  <article
                    id={item.slug}
                    className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-12"
                  >
                    <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                      <div className="border-border overflow-hidden rounded-xl border shadow-[var(--shadow-lift)]">
                        <Image
                          src={item.gambar}
                          alt={item.alt}
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 50vw, 100vw"
                          className="aspect-[3/2] w-full object-cover"
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {item.galeri.map((g) => (
                          <Image
                            key={g.alt}
                            src={g.src}
                            alt={g.alt}
                            width={400}
                            height={300}
                            sizes="(min-width:1024px) 16vw, (min-width:640px) 25vw, 50vw"
                            className="border-border aspect-[4/3] w-full rounded-lg border object-cover"
                          />
                        ))}
                      </div>
                    </div>

                    <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                        <Ikon className="size-6" strokeWidth={1.6} />
                      </span>
                      <h3 className="text-foreground mt-5 text-2xl lg:text-3xl">
                        {item.nama}
                      </h3>
                      <p className="text-muted-foreground mt-3 leading-relaxed">
                        {item.ringkas}
                      </p>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {item.detail.map((d) => (
                          <li
                            key={d}
                            className="text-foreground/85 flex items-start gap-2 text-sm"
                          >
                            <Check className="text-accent mt-0.5 size-4 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Button asChild size="pill">
                          <Link href={`/layanan/${item.slug}`}>
                            Lihat Detail {item.nama}
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <SectionShell
      id="layanan"
      tone="terang"
      judul={"Layanan An Nasr dalam\nMendukung Proyek Anda"}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {layanan.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.07} className="h-full">
            <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-[var(--shadow-soft)]">
              <Image
                src={item.gambar}
                alt={item.alt}
                width={1200}
                height={800}
                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-foreground text-xl leading-snug">
                  {item.nama}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {item.ringkas}
                </p>
                <div className="mt-auto pt-6">
                  <Button
                    asChild
                    size="pill"
                    className="bg-accent text-accent-foreground hover:bg-accent w-full transition-none"
                  >
                    <Link href={`/layanan/${item.slug}`}>
                      Lihat Detail
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
