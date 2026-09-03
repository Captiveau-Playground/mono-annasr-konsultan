"use client"

import { Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { navigasi, perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

type ItemNav = {
  label: string
  href: string
  anak?: unknown[]
}

export function Navbar({
  brandNama,
  navigasiCms,
  whatsapp,
}: {
  brandNama?: string
  /** Navigasi level atas dari CMS (grup diwakili item induknya saja). */
  navigasiCms?: ItemNav[]
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
}) {
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  const kelasLink = (href: string) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors",
      aktif(href) ? "text-primary" : "text-muted-foreground hover:text-primary"
    )

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo/logo-blue.png"
            alt={brandNama?.trim() || "CV. An Nasr Konsultan"}
            width={40}
            height={40}
            priority
            className="size-10 shrink-0 rounded-lg object-contain"
          />
          <span className="font-[family-name:var(--font-heading)] text-sm font-semibold">
            {brandNama?.trim() || "CV. An Nasr Konsultan"}
          </span>
        </Link>

        {/* Item sederhana — teks polos, tanpa dropdown. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {daftar.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  if (item.href === "/kontak") {
                    trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                      cta: "nav_kontak",
                    })
                  }
                }}
                className={kelasLink(item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden rounded-full px-5 lg:inline-flex"
          >
            <a
              href={`https://wa.me/${nomorWa}`}
              target="_blank"
              rel="noreferrer"
            >
              Konsultasi
            </a>
          </Button>

          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="border-border bg-background text-foreground flex size-10 items-center justify-center rounded-full border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="menu-mobile"
          className="border-border bg-background border-t lg:hidden"
        >
          <ul className="mx-auto max-w-[80rem] space-y-1 px-4 py-4">
            {daftar.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium",
                    aktif(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-[80rem] px-4 pb-5">
            <Button asChild className="w-full rounded-full" size="sm">
              <a
                href={`https://wa.me/${nomorWa}`}
                target="_blank"
                rel="noreferrer"
              >
                Konsultasi Sekarang
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
