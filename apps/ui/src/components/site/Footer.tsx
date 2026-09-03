import { Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

import { InstagramIcon } from "@/components/ui/icons"
import { layanan, navigasi, perusahaan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

import { SocialLinks } from "./SocialLinks"

export function Footer({
  brand,
  navigasi: navCms,
  layananCms,
  sections,
  copyRight,
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
  /** Kolom footer dari CT Footer (elements.footer-item). */
  sections?: readonly {
    title: string
    links: readonly { label: string; href: string }[]
  }[]
  /** Teks copyright dari CMS (footer.copyRight). */
  copyRight?: string
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

  const kolomFallback: {
    title: string
    links: { label: string; href: string }[]
  }[] = [
    {
      title: "Menu",
      links: menu.map((m) => ({ label: m.label, href: m.href })),
    },
    {
      title: "Layanan",
      links: [...daftarLayanan],
    },
    {
      title: "Kontak",
      links: [
        { label: kantor ?? perusahaan.kantor, href: "/kontak" },
        { label: telepon ?? perusahaan.telepon, href: "/kontak" },
        { label: email ?? perusahaan.email, href: "/kontak" },
      ],
    },
  ]

  const kolom = sections && sections.length > 0 ? sections : kolomFallback

  return (
    <footer className="bg-secondary text-primary-foreground relative overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-10"
        aria-hidden
      />
      <div className="bg-accent/10 pointer-events-none absolute -top-32 -right-32 size-96 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo-white.png"
                alt={namaBrand}
                width={40}
                height={40}
                className="size-10 shrink-0 object-contain"
              />
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

            {/* Kontak singkat: hp, email, alamat, instagram — satu grup ber-ikon. */}
            <ul className="text-primary-foreground/75 mt-6 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="text-accent size-4 shrink-0" />
                <a
                  href={`tel:${(telepon ?? perusahaan.telepon).replaceAll(/\s/g, "")}`}
                  className="hover:text-accent transition-colors"
                >
                  {telepon ?? perusahaan.telepon}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="text-accent size-4 shrink-0" />
                <a
                  href={`mailto:${email ?? perusahaan.email}`}
                  className="hover:text-accent transition-colors"
                >
                  {email ?? perusahaan.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="text-accent size-4 shrink-0" />
                <span>{kantor ?? perusahaan.kantor}</span>
              </li>
              {(instagram ?? "").trim() ? (
                <li className="flex items-center gap-2.5">
                  <InstagramIcon className="size-4 shrink-0" />
                  <a
                    href={`https://instagram.com/${instagram
                      ?.replace(/^@/, "")
                      .trim()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {instagram?.replace(/^@/, "").trim()}
                  </a>
                </li>
              ) : null}
            </ul>
            <SocialLinks
              instagram={instagram}
              whatsapp={whatsapp ?? perusahaan.whatsapp}
            />
          </div>

          {kolom.map((k) => (
            <div key={k.title}>
              <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
                {k.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {k.links.map((l) => (
                  <li key={l.label}>
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
          ))}
        </div>
      </div>

      <div className="border-primary-foreground/10 relative border-t">
        <div className="text-primary-foreground/50 mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>
            {copyRight?.trim() ||
              `© ${tahun} ${namaBrand}. Seluruh hak cipta dilindungi.`}
          </span>
          <span>Jombang, Jawa Timur — Indonesia</span>
        </div>
      </div>
    </footer>
  )
}
