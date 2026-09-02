export function PageHero({
  eyebrow,
  judul,
  teks,
}: {
  eyebrow: string
  judul: string
  teks: string
}) {
  return (
    <section className="cta-gradient relative overflow-hidden px-5 pt-36 pb-20 lg:px-8 lg:pt-44 lg:pb-28">
      <div className="blueprint-grid absolute inset-0 opacity-25" aria-hidden />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          {eyebrow}
        </p>
        <h1 className="text-primary-foreground mt-4 text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
          {judul}
        </h1>
        <p className="text-primary-foreground/80 mx-auto mt-5 max-w-2xl text-base leading-relaxed">
          {teks}
        </p>
      </div>
    </section>
  )
}
