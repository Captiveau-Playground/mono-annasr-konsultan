"use client"

import {
  ArrowUpRight,
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
import { navigasi, perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

type ItemNav = {
  label: string
  href: string
  /** Submenu (dropdown) — diisi CMS bila item bergrup. */
  anak?: { label: string; href: string; deskripsi?: string }[]
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

type EntryMenu =
  | { type: "link"; item: ItemNav }
  | { type: "grup"; item: ItemNav }

export function Navbar({
  brandNama,
  navigasiCms,
  tagline,
  whatsapp,
}: {
  brandNama?: string
  /** Navigasi dari CMS — item dengan `anak` menjadi grup dropdown. */
  navigasiCms?: ItemNav[]
  tagline?: string
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
}) {
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp

  // Menu satu sumber: entri link vs grup (bila item punya anak).
  const menu: EntryMenu[] = daftar.map((item) =>
    item.anak && item.anak.length > 0
      ? { type: "grup", item }
      : { type: "link", item }
  )

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

  const kelasItem = (to: string) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
      terang
        ? "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
        : "text-muted-foreground hover:bg-surface hover:text-primary",
      aktif(to) && (terang ? "text-white" : "text-primary")
    )

  const kelasTrigger = (aktifGrup: boolean) =>
    cn(
      "h-9 gap-1 rounded-full px-3.5 text-sm font-medium transition-colors",
      terang
        ? "text-primary-foreground/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
        : "text-muted-foreground hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary",
      aktifGrup && (terang ? "text-white" : "text-primary")
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

        {/* Navigasi desktop — tree dari CMS (grup utk item ber-anak). */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const { item } = entry
                const gAktif =
                  (item.anak ?? []).some((a) => aktif(a.href)) ||
                  aktif(item.href)

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className={kelasTrigger(gAktif)}>
                      {item.label}
                      <ChevronDown className="size-3.5 opacity-60 transition-transform data-[state=open]:rotate-180" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="border-border bg-popover flex w-[21rem] flex-col gap-1 rounded-2xl border p-2 shadow-[var(--shadow-soft)]">
                        {(item.anak ?? []).map((sub) => {
                          const Ikon = IKON_NAV[sub.href] ?? Users
                          const gSub = aktif(sub.href)

                          return (
                            <li key={sub.href}>
                              <NavigationMenuLink
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                                  gSub ? "bg-primary/10" : "hover:bg-surface"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                                    gSub
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-surface text-primary"
                                  )}
                                >
                                  <Ikon className="size-4" strokeWidth={1.8} />
                                </span>
                                <span className="min-w-0">
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      gSub ? "text-primary" : "text-foreground"
                                    )}
                                  >
                                    {sub.label}
                                  </span>
                                  {sub.deskripsi ? (
                                    <span className="text-muted-foreground block truncate text-xs">
                                      {sub.deskripsi}
                                    </span>
                                  ) : null}
                                </span>
                                <ArrowUpRight
                                  className="text-muted-foreground/40 ml-auto size-3.5 shrink-0"
                                  aria-hidden="true"
                                />
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
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const IkonGrup = IKON_NAV[entry.item.href] ?? Users

                return (
                  <div key={entry.item.href} className="mb-3">
                    <p className="text-muted-foreground flex items-center gap-2 px-4 pb-1 text-[10px] font-semibold tracking-widest uppercase">
                      <IkonGrup className="size-3.5" />
                      {entry.item.label}
                    </p>
                    <ul className="space-y-0.5">
                      {(entry.item.anak ?? []).map((sub) => {
                        const Ikon = IKON_NAV[sub.href] ?? Users
                        const isAktif = aktif(sub.href)

                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
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
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-surface text-primary"
                                )}
                              >
                                <Ikon className="size-4" strokeWidth={1.8} />
                              </span>
                              <span className="min-w-0">
                                <span className="block">{sub.label}</span>
                                {sub.deskripsi ? (
                                  <span className="text-muted-foreground block truncate text-xs">
                                    {sub.deskripsi}
                                  </span>
                                ) : null}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              }

              const Ikon = IKON_NAV[entry.item.href] ?? Home
              const isAktif = aktif(entry.item.href)

              return (
                <Link
                  key={entry.item.href}
                  href={entry.item.href}
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
                  <span className="flex-1">{entry.item.label}</span>
                </Link>
              )
            })}

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
