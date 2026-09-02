import { Compass, Mail, MapPin, Phone } from "lucide-react"

import { layanan, navigasi, perusahaan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

export function Footer() {
  const today = new Date()
  const tahun = today.getFullYear()

  return (
    <footer className="bg-secondary text-primary-foreground relative overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-10"
        aria-hidden
      />
      <div className="bg-accent/10 pointer-events-none absolute -top-32 -right-32 size-96 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-xl">
                <Compass className="size-5" />
              </span>
              <span className="font-[family-name:var(--font-heading)] text-sm font-semibold">
                CV. An Nasr Konsultan
              </span>
            </div>
            <p className="text-primary-foreground/65 mt-5 max-w-sm text-sm leading-relaxed">
              {perusahaan.singkat}
            </p>
            <p className="text-primary-foreground/45 mt-5 text-xs tracking-[0.18em] uppercase">
              {perusahaan.jamOperasional}
            </p>
          </div>

          <div>
            <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              Menu
            </h3>
            <ul className="mt-5 space-y-3">
              {navigasi.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="text-primary-foreground/65 hover:text-accent text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              Layanan
            </h3>
            <ul className="mt-5 space-y-3">
              {layanan.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/layanan/${l.slug}`}
                    className="text-primary-foreground/65 hover:text-accent text-sm transition-colors"
                  >
                    {l.nama}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              Kontak
            </h3>
            <ul className="text-primary-foreground/65 mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{perusahaan.kantor}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{perusahaan.telepon}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{perusahaan.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-primary-foreground/10 relative border-t">
        <div className="text-primary-foreground/50 mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>
            © {tahun} {perusahaan.nama}. Seluruh hak cipta dilindungi.
          </span>
          <span>Jombang, Jawa Timur — Indonesia</span>
        </div>
      </div>
    </footer>
  )
}
