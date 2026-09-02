import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/navigation"

import { Reveal } from "./Reveal"
import { Kontainer } from "./SectionShell"

export function CtaBanner() {
  return (
    <section className="bg-secondary py-20 lg:py-24">
      <Kontainer>
        <Reveal>
          <div className="marble-card border-primary/10 relative overflow-hidden rounded-2xl border px-8 py-14 shadow-[var(--shadow-lift)] lg:px-14 lg:py-16">
            <div className="bg-accent/20 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
            <div className="bg-primary/20 pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
                  Konsultasi Gratis
                </p>
                <h2 className="text-foreground mt-4 max-w-2xl text-3xl leading-[1.12] sm:text-4xl lg:text-5xl">
                  Konsultasikan Kebutuhan Proyek Anda Bersama Kami
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                <Button
                  asChild
                  size="xl"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/kontak">
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
