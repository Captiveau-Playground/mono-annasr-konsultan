import type { ReactNode } from "react"

import { Reveal } from "./Reveal"

export function Kontainer({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

export function SectionShell({
  id,
  judul,
  eyebrow,
  aksi,
  children,
  tone = "terang",
  className = "",
}: {
  id?: string
  /** Judul section — kosongkan untuk menyembunyikan header (mis. halaman Proyek). */
  judul?: string
  /** Label kecil di atas judul — dari CMS. */
  eyebrow?: string
  aksi?: ReactNode
  children: ReactNode
  tone?: "terang" | "krem" | "gelap"
  className?: string
}) {
  const bg =
    tone === "gelap"
      ? "bg-secondary text-primary-foreground"
      : tone === "krem"
        ? "bg-surface text-foreground"
        : "bg-background text-foreground"

  return (
    <section
      id={id}
      className={`flex scroll-mt-20 flex-col justify-center overflow-hidden py-20 lg:py-24 ${bg} ${className}`}
    >
      <Kontainer>
        {judul ? (
          <Reveal className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              {eyebrow ? (
                <p
                  className={`text-xs font-semibold tracking-[0.22em] uppercase ${
                    tone === "gelap" ? "text-accent" : "text-primary"
                  }`}
                >
                  {eyebrow}
                </p>
              ) : null}
              <h2
                className={`max-w-2xl text-3xl leading-[1.12] text-balance whitespace-pre-line sm:text-4xl lg:text-5xl ${
                  tone === "gelap"
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {judul}
              </h2>
            </div>
            {aksi ? <div className="shrink-0">{aksi}</div> : null}
          </Reveal>
        ) : null}

        <div className={judul ? "mt-12" : ""}>{children}</div>
      </Kontainer>
    </section>
  )
}
