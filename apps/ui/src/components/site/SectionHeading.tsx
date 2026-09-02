import { Reveal } from "./Reveal"

export function SectionHeading({
  eyebrow,
  judul,
  deskripsi,
  align = "center",
  invert = false,
}: {
  eyebrow?: string
  judul: string
  deskripsi?: string
  align?: "center" | "left"
  invert?: boolean
}) {
  return (
    <Reveal
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow ? (
        <p
          className={`text-xs font-semibold tracking-[0.22em] uppercase ${
            invert ? "text-accent" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem] ${
          invert ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {judul}
      </h2>
      {deskripsi ? (
        <p
          className={`mt-4 text-base leading-relaxed ${
            invert ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {deskripsi}
        </p>
      ) : null}
    </Reveal>
  )
}
