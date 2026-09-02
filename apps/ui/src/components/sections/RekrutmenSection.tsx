import { ArrowRight, Briefcase } from "lucide-react"

import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/navigation"

export function RekrutmenSection() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <Reveal className="border-border bg-card mx-auto max-w-3xl rounded-[1.5rem] border p-8 text-center shadow-[var(--shadow-soft)]">
        <span className="bg-accent text-accent-foreground mx-auto flex size-11 items-center justify-center rounded-xl">
          <Briefcase className="size-5" strokeWidth={1.6} />
        </span>
        <h2 className="text-foreground mt-4 text-xl sm:text-2xl">
          Bergabung Bersama Tim Kami
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed">
          Kami membuka kesempatan bagi tenaga teknik, drafter, dan pengawas
          lapangan untuk berkembang bersama CV. AN NASR KONSULTAN.
        </p>
        <Button asChild size="pill" className="mt-6">
          <Link href="/karir">
            Recruitment
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </section>
  )
}
