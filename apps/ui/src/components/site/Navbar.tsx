"use client"

import {
  Briefcase,
  ChevronDown,
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

/** Halaman yang dikelompokkan dalam dropdown "Profil". */
const HALAMAN_PROFIL: Set<string> = new Set([
  "/tentang",
  "/rekanan",
  "/artikel",
  "/karir",
])

type EntryMenu =
  | { type: "link"; item: ItemNav }
  | { type: "layanan" }
  | { type: "profil" }

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

  const lini =
    layananCms && layananCms.length > 0
      ? layananCms
      : layanan.map((l) => ({ nama: l.nama, slug: l.slug }))
  const profil = daftar.filter((i) => HALAMAN_PROFIL.has(i.href))
  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp

  // Menu desktop satu sumber: tiap entri muncul sekali (grup dijadikan satu).
  const menu: EntryMenu[] = []
  {
    let profilDipakai = false
    for (const item of daftar) {
      if (item.href === "/layanan") {
        menu.push({ type: "layanan" })
      } else if (HALAMAN_PROFIL.has(item.href)) {
        if (!profilDipakai) {
          menu.push({ type: "profil" })
          profilDipakai = true
        }
      } else {
        menu.push({ type: "link", item })
      }
    }
  }

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  /**
   * Gaya item pill konsisten — hover diberi latar (bukan sekadar warna),
   * aktif ditandai teks + titik kecil aksen.
   */
  const kelasItem = (to: string) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
      terang
        ? "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
        : "text-muted-foreground hover:bg-surface hover:text-primary",
      aktif(to) && (terang ? "text-white" : "text-primary")
    )

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

        {/* Navigasi desktop — tanpa duplikasi, grup hanya sekali. */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1.5">
            {menu.map((entry) => {
              if (entry.type === "layanan") {
                const gAktif = aktif("/layanan")

                return (
                  <NavigationMenuItem key="menu-layanan">
                    <NavigationMenuTrigger
                      className={cn(
                        "h-9 gap-1 rounded-full px-3.5 text-sm font-medium transition-colors",
                        terang
                          ? "text-primary-foreground/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
                          : "text-muted-foreground hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary",
                        gAktif && (terang ? "text-white" : "text-primary")
                      )}
                    >
                      Layanan
                      <ChevronDown className="size-3.5 opacity-60 transition-transform data-[state=open]:rotate-180" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="border-border bg-popover grid w-[20rem] gap-1 rounded-2xl border p-2 shadow-[var(--shadow-soft)]">
                        {lini.map((l) => {
                          const aktifL = aktif(`/layanan/${l.slug}`)

                          return (
                            <li key={l.slug}>
                              <NavigationMenuLink
                                href={`/layanan/${l.slug}`}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                                  aktifL
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-surface"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                                    aktifL
                                      ? "bg-accent text-accent-foreground"
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
                                    Detail layanan &amp; persyaratan
                                  </span>
                                </span>
                              </NavigationMenuLink>
                            </li>
                          )
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              if (entry.type === "profil") {
                const gAktif = profil.some((p) => aktif(p.href))

                return (
                  <NavigationMenuItem key="menu-profil">
                    <NavigationMenuTrigger
                      className={cn(
                        "h-9 gap-1 rounded-full px-3.5 text-sm font-medium transition-colors",
                        terang
                          ? "text-primary-foreground/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
                          : "text-muted-foreground hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary",
                        gAktif && (terang ? "text-white" : "text-primary")
                      )}
                    >
                      Profil
                      <ChevronDown className="size-3.5 opacity-60 transition-transform data-[state=open]:rotate-180" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="border-border bg-popover flex w-56 flex-col rounded-2xl border p-2 shadow-[var(--shadow-soft)]">
                        {profil.map((p) => {
                          const Ikon = IKON_NAV[p.href] ?? Users

                          return (
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
                                <span
                                  className={cn(
                                    "flex size-7 shrink-0 items-center justify-center rounded-lg",
                                    aktif(p.href)
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-surface text-primary"
                                  )}
                                >
                                  <Ikon className="size-4" strokeWidth={1.8} />
                                </span>
                                {p.label}
                              </NavigationMenuLink>
                            </li>
                          )
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              const item = entry.item

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
                    className={kelasItem(item.href)}
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

            <ul className="space-y-0.5">
              {daftar
                .filter(
                  (i) => i.href !== "/layanan" && !HALAMAN_PROFIL.has(i.href)
                )
                .map((item) => {
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
