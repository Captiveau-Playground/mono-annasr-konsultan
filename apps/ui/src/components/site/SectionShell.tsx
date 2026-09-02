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
    <div className={`mx-auto w-full max-w-6xl px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

export function SectionShell({
  id,
  judul,
  aksi,
  children,
  tone = "terang",
  className = "",
}: {
  id?: string
  judul: string
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
      className={`flex min-h-screen scroll-mt-20 flex-col justify-center overflow-hidden py-20 lg:py-24 ${bg} ${className}`}
    >
      <Kontainer>
        <Reveal className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <h2
            className={`max-w-2xl text-3xl leading-[1.12] text-balance whitespace-pre-line sm:text-4xl lg:text-5xl ${
              tone === "gelap" ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {judul}
          </h2>
          {aksi ? <div className="shrink-0">{aksi}</div> : null}
        </Reveal>

        <div className="mt-12">{children}</div>
      </Kontainer>
    </section>
  )
}
