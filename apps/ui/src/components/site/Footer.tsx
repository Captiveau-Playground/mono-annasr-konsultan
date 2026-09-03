import { Compass, Mail, MapPin, Phone } from "lucide-react"

import { layanan, navigasi, perusahaan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

import { SocialLinks } from "./SocialLinks"

export function Footer({
  brand,
  navigasi: navCms,
  layananCms,
  singkat,
  jam,
  kantor,
  telepon,
  email,
  instagram,
  whatsapp,
}: {
  /** Dari CMS (situs.brandNama). */
  brand?: string
  navigasi?: readonly { label: string; href: string }[]
  /** Dari CMS (layanan) — kolom Layanan footer. */
  layananCms?: readonly { label: string; href: string }[]
  singkat?: string
  /** Dari CMS (kontak.jamOperasional). */
  jam?: string
  /** Dari CMS (kontak.kantor). */
  kantor?: string
  /** Dari CMS (kontak.telepon). */
  telepon?: string
  /** Dari CMS (kontak.email). */
  email?: string
  /** Dari CMS (kontak.instagram). */
  instagram?: string
  /** Dari CMS (kontak.whatsapp). */
  whatsapp?: string
}) {
  const today = new Date()
  const tahun = today.getFullYear()

  const menu =
    navCms && navCms.length > 0
      ? navCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))
  const daftarLayanan =
    layananCms && layananCms.length > 0
      ? layananCms
      : layanan.map((l) => ({ label: l.nama, href: `/layanan/${l.slug}` }))
  const namaBrand = brand?.trim() || "CV. An Nasr Konsultan"

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
                {namaBrand}
              </span>
            </div>
            <p className="text-primary-foreground/65 mt-5 max-w-sm text-sm leading-relaxed">
              {singkat ?? perusahaan.singkat}
            </p>
            <p className="text-primary-foreground/45 mt-5 text-xs tracking-[0.18em] uppercase">
              {jam ?? perusahaan.jamOperasional}
            </p>
            <SocialLinks
              instagram={instagram}
              whatsapp={whatsapp ?? perusahaan.whatsapp}
            />
          </div>

          <div>
            <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              Menu
            </h3>
            <ul className="mt-5 space-y-3">
              {menu.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
              {daftarLayanan.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary-foreground/65 hover:text-accent text-sm transition-colors"
                  >
                    {l.label}
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
                <span>{kantor ?? perusahaan.kantor}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{telepon ?? perusahaan.telepon}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{email ?? perusahaan.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-primary-foreground/10 relative border-t">
        <div className="text-primary-foreground/50 mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>
            © {tahun} {namaBrand}. Seluruh hak cipta dilindungi.
          </span>
          <span>Jombang, Jawa Timur — Indonesia</span>
        </div>
      </div>
    </footer>
  )
}
