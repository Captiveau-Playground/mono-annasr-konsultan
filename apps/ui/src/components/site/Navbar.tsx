"use client"

import {
  Briefcase,
  Compass,
  FolderKanban,
  Handshake,
  Home,
  Menu,
  Newspaper,
  PanelsTopLeft,
  Phone,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { navigasi, perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

type ItemNav = {
  label: string
  href: string
}

const IKON_NAV: Record<string, LucideIcon> = {
  "/": Home,
  "/layanan": PanelsTopLeft,
  "/portfolio": FolderKanban,
  "/tentang": Users,
  "/rekanan": Handshake,
  "/artikel": Newspaper,
  "/karir": Briefcase,
  "/kontak": Phone,
}

export function Navbar({
  brandNama,
  navigasiCms,
  tagline,
  whatsapp,
}: {
  brandNama?: string
  /** Navigasi dari CMS (situs.navigasi) — dipakai desktop & mobile. */
  navigasiCms?: { label: string; href: string }[]
  tagline?: string
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
}) {
  /** Navigasi CMS utk seluruh menu; fallback data statis bila kosong. */
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  /**
   * Rute yang bagian atasnya ber-LATAR-TERANG → navbar wajib solid (tidak
   * transparan ber-teks-putih yang jadi tak terlihat). Termasuk beranda
   * (hero putih), detail artikel & layanan, tentang, dan area CRM.
   */
  const topTerang = (() => {
    const segmen = pathname.split("/").filter(Boolean)
    if (segmen[0] === "cs" || segmen[0] === "en") segmen.shift()

    return (
      segmen.length === 0 ||
      segmen[0] === "crm" ||
      segmen[0] === "tentang" ||
      (segmen[0] === "artikel" && segmen.length >= 2) ||
      (segmen[0] === "layanan" && segmen.length >= 2)
    )
  })()

  const terang = !topTerang && !scrolled && !open
  const teksNav = terang
    ? "text-primary-foreground/80 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-primary"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  const teksAktif = terang ? "text-accent" : "text-primary"

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || topTerang
          ? "border-border bg-background/85 border-b py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <Compass className="size-5" />
          </span>
          <span className="leading-tight">
            <span
              className={`block font-[family-name:var(--font-heading)] text-sm font-semibold ${
                terang ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {brandNama?.trim() || "CV. An Nasr Konsultan"}
            </span>
            <span
              className={`block text-[11px] tracking-wide ${
                terang ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {tagline ?? "Konsultan Teknik &amp; Konstruksi"}
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — dari CMS (situs.navigasi). */}
        <ul className="hidden items-center gap-0.5 lg:flex">
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
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  aktif(item.href) ? teksAktif : teksNav
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <Button asChild size="pill" variant={terang ? "hero" : "default"}>
            <a
              href={`https://wa.me/${nomorWa}`}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent(ANALYTICS_EVENTS.contactChannel, {
                  channel: "whatsapp",
                  location: "nav_cta",
                })
              }
            >
              Konsultasi Sekarang
            </a>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border lg:hidden ${
            terang
              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
              : "border-border bg-background text-foreground"
          }`}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div
          id="menu-mobile"
          className="border-border bg-background/95 border-t backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-5 py-4 lg:px-8">
            {daftar.map((item) => {
              const Ikon = IKON_NAV[item.href] ?? Home
              const isAktif = aktif(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isAktif
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-surface"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        isAktif
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface text-primary"
                      )}
                    >
                      <Ikon className="size-4" strokeWidth={1.8} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isAktif ? (
                      <span
                        className="bg-primary size-1.5 rounded-full"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mx-auto max-w-7xl px-5 pb-5 lg:px-8">
            <Button asChild className="w-full" size="pill">
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
