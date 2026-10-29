"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"

import { Reveal } from "./Reveal"
import { Kontainer } from "./SectionShell"

export function CtaBanner({
  judul = "Konsultasikan Kebutuhan Proyek Anda Bersama Kami",
  deskripsi = "Sampaikan rencana pembangunan Anda, tim kami akan membantu menyusun solusi teknis yang tepat sasaran dan sesuai anggaran.",
  eyebrow = "Konsultasi Gratis",
  latar,
}: {
  judul?: string
  deskripsi?: string
  /** Label kecil di atas judul — dari CMS situs.ctaEyebrow. */
  eyebrow?: string
  /** Gambar latar dekoratif (ornamen batik) — dipakai di beranda. */
  latar?: string
}) {
  return (
    <section className="bg-secondary relative isolate overflow-hidden py-20 lg:py-24">
      {latar ? (
        <Image
          src={latar}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover"
        />
      ) : null}
      <Kontainer className="relative">
        <Reveal>
          <div className="marble-card border-primary/10 relative overflow-hidden rounded-2xl border px-8 py-14 shadow-[var(--shadow-lift)] lg:px-14 lg:py-16">
            <div className="bg-accent/20 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
            <div className="bg-primary/20 pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
                  {eyebrow}
                </p>
                <h2 className="text-foreground mt-4 max-w-2xl text-3xl leading-[1.12] sm:text-4xl lg:text-5xl">
                  {judul}
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-center">
                <Button
                  asChild
                  size="xl"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link
                    href="/kontak"
                    onClick={() =>
                      trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                        cta: "cta_banner",
                      })
                    }
                  >
                    Hubungi Kami
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Kontainer>
    </section>
  )
}
