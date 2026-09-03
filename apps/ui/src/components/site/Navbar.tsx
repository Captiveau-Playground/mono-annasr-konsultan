"use client"

import {
  Briefcase,
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
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { layanan, navigasi, perusahaan } from "@/data/perusahaan"
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

/** Halaman "Profil" yang dikelompokkan di dropdown. */
const HALAMAN_PROFIL: Set<string> = new Set([
  "/tentang",
  "/rekanan",
  "/artikel",
  "/karir",
])

export function Navbar({
  brandNama,
  navigasiCms,
  tagline,
  whatsapp,
  layananCms,
}: {
  brandNama?: string
  /** Navigasi dari CMS (situs.navigasi / CT navbar). */
  navigasiCms?: { label: string; href: string }[]
  tagline?: string
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
  /** Layanan dari CMS — anak dropdown "Layanan". */
  layananCms?: { nama: string; slug: string }[]
}) {
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  /** Flat (tanpa grup): semua item minus /layanan & halaman Profil. */
  const flat = daftar.filter(
    (i) => i.href !== "/layanan" && !HALAMAN_PROFIL.has(i.href)
  )
  /** Anak grup Profil, urutan tetap. */
  const profil = daftar.filter((i) => HALAMAN_PROFIL.has(i.href))
  const lini =
    layananCms && layananCms.length > 0
      ? layananCms
      : layanan.map((l) => ({ nama: l.nama, slug: l.slug }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  /** Rute ber-latar terang → navbar solid (teks gelap). */
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
          <Image
            src={
              terang
                ? "/images/logo/logo-white.png"
                : "/images/logo/logo-blue.png"
            }
            alt={brandNama?.trim() || "CV. An Nasr Konsultan"}
            width={40}
            height={40}
            priority
            className="size-10 shrink-0 rounded-xl object-contain"
          />
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

        {/* Navigasi desktop — grup Layanan & Profil + item flat (urutan CMS). */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {daftar.map((item) => {
              if (item.href === "/layanan") {
                return (
                  <NavigationMenuItem key="grup-layanan">
                    <NavigationMenuTrigger
                      className={cn(
                        "h-9 gap-1 rounded-full px-3 py-2 text-sm font-medium",
                        aktif("/layanan") ? teksAktif : teksNav
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[19rem] grid-cols-1 gap-1 p-2">
                        {lini.map((l) => (
                          <li key={l.slug}>
                            <NavigationMenuLink
                              href={`/layanan/${l.slug}`}
                              className={cn(
                                "flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                                aktif(`/layanan/${l.slug}`)
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-surface"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                                  aktif(`/layanan/${l.slug}`)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-surface text-primary"
                                )}
                              >
                                <PanelsTopLeft
                                  className="size-4"
                                  strokeWidth={1.8}
                                />
                              </span>
                              <span>
                                <span className="text-foreground block text-sm font-medium">
                                  {l.nama}
                                </span>
                                <span className="text-muted-foreground block text-xs">
                                  Lihat detail &amp; persyaratan
                                </span>
                              </span>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              if (HALAMAN_PROFIL.has(item.href)) {
                return (
                  <NavigationMenuItem key="grup-profil">
                    <NavigationMenuTrigger
                      className={cn(
                        "h-9 gap-1 rounded-full px-3 py-2 text-sm font-medium",
                        profil.some((p) => aktif(p.href)) ? teksAktif : teksNav
                      )}
                    >
                      Profil
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex w-56 flex-col p-2">
                        {profil.map((p) => (
                          <li key={p.href}>
                            <NavigationMenuLink
                              href={p.href}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl p-2.5 text-sm font-medium transition-colors",
                                aktif(p.href)
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground hover:bg-surface"
                              )}
                            >
                              {p.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    onClick={() => {
                      if (item.href === "/kontak") {
                        trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                          cta: "nav_kontak",
                        })
                      }
                    }}
                    className={cn(
                      "h-9 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      aktif(item.href) ? teksAktif : teksNav
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

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
          className="border-border bg-background/95 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t shadow-[var(--shadow-lift)] backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
            {/* Grup Layanan */}
            {lini.length > 0 ? (
              <div className="mb-4">
                <p className="text-muted-foreground px-4 pb-1 text-[10px] font-semibold tracking-widest uppercase">
                  Layanan
                </p>
                <ul className="space-y-0.5">
                  {lini.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/layanan/${l.slug}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                          aktif(`/layanan/${l.slug}`)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-surface"
                        )}
                      >
                        <span className="bg-surface text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                          <PanelsTopLeft className="size-4" strokeWidth={1.8} />
                        </span>
                        {l.nama}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Grup Profil */}
            {profil.length > 0 ? (
              <div className="mb-4">
                <p className="text-muted-foreground px-4 pb-1 text-[10px] font-semibold tracking-widest uppercase">
                  Profil
                </p>
                <ul className="space-y-0.5">
                  {profil.map((p) => {
                    const Ikon = IKON_NAV[p.href] ?? Users

                    return (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                            aktif(p.href)
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-surface"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg",
                              aktif(p.href)
                                ? "bg-primary text-primary-foreground"
                                : "bg-surface text-primary"
                            )}
                          >
                            <Ikon className="size-4" strokeWidth={1.8} />
                          </span>
                          {p.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}

            {/* Item flat (Beranda, Proyek, Kontak) */}
            <ul className="space-y-0.5">
              {flat.map((item) => {
                const Ikon = IKON_NAV[item.href] ?? Home
                const isAktif = aktif(item.href)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
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
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4">
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
        </div>
      ) : null}
    </header>
  )
}
