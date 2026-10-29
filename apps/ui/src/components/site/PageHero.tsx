import Image from "next/image"

export function PageHero({
  eyebrow,
  judul,
  teks,
  latar,
}: {
  eyebrow: string
  judul: string
  teks: string
  /** Gambar latar dekoratif per halaman (mis. `/images/new/header/…`). */
  latar?: string
}) {
  return (
    <section className="cta-gradient relative -mt-16 overflow-hidden px-6 pt-44 pb-16 lg:px-8 lg:pt-48 lg:pb-20">
      {latar ? (
        <Image
          src={latar}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover"
        />
      ) : null}
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
