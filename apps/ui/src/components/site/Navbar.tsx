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
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  /** Poin aktif kecil di bawah item aktif. */
  const indikatorAktif = (aktifYa: boolean) =>
    aktifYa ? (
      <span
        className="bg-accent absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full"
        aria-hidden="true"
      />
    ) : null

  /** Gaya pill item & trigger — seragam, hover ber-latar, tinggi sama. */
  const kelasPill = (aktifYa: boolean) =>
    cn(
      "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors",
      terang
        ? "text-primary-foreground/90 hover:bg-white/10 hover:text-white"
        : "text-muted-foreground hover:bg-surface hover:text-primary",
      aktifYa && (terang ? "text-white" : "text-primary")
    )

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300",
        scrolled || topTerang
          ? "border-border bg-background/90 border-b shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="flex h-full max-w-[80rem] items-center justify-between gap-6 px-4 sm:px-5 lg:px-8">
        {/* Branding */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
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
            className="size-9 shrink-0 rounded-lg object-contain sm:size-10"
          />
          <span className="leading-tight">
            <span
              className={cn(
                "block font-[family-name:var(--font-heading)] text-sm font-semibold",
                terang ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {brandNama?.trim() || "CV. An Nasr Konsultan"}
            </span>
            <span
              className={cn(
                "hidden text-[11px] tracking-wide sm:block",
                terang ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {tagline ?? "Konsultan Teknik &amp; Konstruksi"}
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — tree dari CMS, tanpa duplikasi. */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-0.5">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const { item } = entry
                const gAktif =
                  aktif(item.href) ||
                  (item.anak ?? []).some((a) => aktif(a.href))

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger
                      className={cn(kelasPill(gAktif), "gap-1.5")}
                    >
                      {item.label}
                      {indikatorAktif(gAktif)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="border-border bg-popover w-80 rounded-2xl border p-2 shadow-[var(--shadow-soft)]">
                        {(item.anak ?? []).map((sub) => {
                          const Ikon = IKON_NAV[sub.href] ?? Users
                          const gSub = aktif(sub.href)

                          return (
                            <li key={sub.href}>
                              <NavigationMenuLink
                                href={sub.href}
                                className={cn(
                                  "group/item flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors",
                                  gSub ? "bg-primary/10" : "hover:bg-muted/70"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                                    gSub
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-surface text-primary"
                                  )}
                                >
                                  <Ikon
                                    className="size-[18px]"
                                    strokeWidth={1.8}
                                  />
                                </span>
                                <span className="min-w-0">
                                  <span
                                    className={cn(
                                      "block text-sm font-semibold",
                                      gSub ? "text-primary" : "text-foreground"
                                    )}
                                  >
                                    {sub.label}
                                  </span>
                                  {sub.deskripsi ? (
                                    <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                                      {sub.deskripsi}
                                    </span>
                                  ) : null}
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
                    className={kelasPill(aktif(item.href))}
                  >
                    {item.label}
                    {indikatorAktif(aktif(item.href))}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA + toggle mobile */}
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
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors lg:hidden",
              terang
                ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                : "border-border bg-background text-foreground"
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Panel mobile — hasilkan dari tree yang sama. */}
      {open ? (
        <div
          id="menu-mobile"
          className="border-border bg-background/95 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t shadow-[var(--shadow-lift)] backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-[80rem] px-4 py-4 sm:px-5">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                return (
                  <div key={entry.item.href} className="mb-2">
                    <p className="text-muted-foreground px-3 pb-1.5 text-[10px] font-semibold tracking-widest uppercase">
                      {entry.item.label}
                    </p>
                    <ul className="space-y-1">
                      {(entry.item.anak ?? []).map((sub) => {
                        const Ikon = IKON_NAV[sub.href] ?? Users
                        const isAktif = aktif(sub.href)

                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
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
                              {sub.label}
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
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
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
        </div>
      ) : null}
    </header>
  )
}
