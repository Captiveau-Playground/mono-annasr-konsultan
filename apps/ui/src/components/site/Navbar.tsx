"use client"

import { ChevronDown, Menu, X } from "lucide-react"
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
  /** Submenu — item ber-anak menjadi dropdown (dari CMS). */
  anak?: { label: string; href: string }[]
}

type EntryMenu =
  | { type: "link"; item: ItemNav }
  | { type: "grup"; item: ItemNav }

export function Navbar({
  brandNama,
  navigasiCms,
  tagline,
  whatsapp,
  layananNav,
}: {
  brandNama?: string
  /** Navigasi level atas dari CMS — item dengan `anak` jadi dropdown. */
  navigasiCms?: ItemNav[]
  /** Tagline dari CMS (situs.brandTagline) — di bawah nama brand. */
  tagline?: string
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
  /** Daftar layanan (dari CMS Layanan) — menggantikan submenu item "Layanan". */
  layananNav?: readonly { label: string; href: string }[]
}) {
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp
  const [open, setOpen] = useState(false)
  const [bukaMobile, setBukaMobile] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)

      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Kunci scroll halaman saat menu mobile terbuka + tutup dengan tombol Escape.
  useEffect(() => {
    if (!open) return

    const sebelumnya = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)

    return () => {
      document.documentElement.style.overflow = sebelumnya
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  /** Item "Layanan" memakai daftar layanan live dari CMS (bukan submenu manual). */
  const menu: EntryMenu[] = daftar.map((item) => {
    const isLayanan =
      /^layanan$/i.test(item.label.trim()) || item.href === "/layanan"
    const anak =
      isLayanan && layananNav && layananNav.length > 0
        ? layananNav.map((l) => ({ label: l.label, href: l.href }))
        : (item.anak ?? [])
    const itemFinal = { ...item, anak }

    return anak.length > 0
      ? { type: "grup", item: itemFinal }
      : { type: "link", item: itemFinal }
  })

  /** Mode "di atas halaman" (belum scroll): navy pekat menyatu dengan hero. */
  const atas = !scrolled

  const kelasLink = (href: string) =>
    cn(
      "rounded-full px-3 py-2 text-sm font-medium transition-colors",
      "text-white/70 hover:bg-white/10 hover:text-white",
      aktif(href) && "bg-white/10 text-white hover:bg-white/10 hover:text-white"
    )

  const kelasTrigger = (aktifGrup: boolean) =>
    cn(
      "h-10 gap-1 rounded-full px-3 text-sm font-medium",
      // Override bg-background & hover/accent bawaan shadcn dengan glassy putih.
      "bg-transparent! text-white/70 hover:bg-white/10! hover:text-white! data-[state=open]:bg-white/10! data-[state=open]:text-white! hover:[&_svg]:text-white! data-[state=open]:[&_svg]:text-white!",
      aktifGrup &&
        "bg-white/10! text-white! hover:bg-white/10! hover:text-white! data-[state=open]:bg-white/10! data-[state=open]:text-white!"
    )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 transition-all duration-300",
        atas
          ? "cta-gradient"
          : "bg-secondary/85 shadow-[0_10px_30px_-15px_rgba(4,10,22,0.6)] backdrop-blur-xl"
      )}
    >
      {/* Tinggi konstan h-16 — tidak menyusut saat scroll supaya tidak ada
          lompatan layout pada konten di bawahnya. */}
      <nav className="mx-auto grid h-16 max-w-[80rem] grid-cols-[auto_1fr_auto] items-center px-4 transition-none sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo/logo-white.png"
            alt={brandNama?.trim() || "CV. An Nasr Konsultan"}
            width={40}
            height={40}
            priority
            className="size-10 shrink-0 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-sm font-semibold text-white">
              {brandNama?.trim() || "CV. An Nasr Konsultan"}
            </span>
            <span className="hidden text-[11px] tracking-wide text-white/60 sm:block">
              {tagline ?? "Konsultan Teknik &amp; Konstruksi"}
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — item flat + grup yang bisa di-expand.
            viewport={false}: tiap dropdown dirender inline di dalam item-nya
            sehingga mengikuti posisi trigger (Profil/Layanan), bukan viewport
            bersama yang posisinya tetap di kiri menu. */}
        <NavigationMenu
          viewport={false}
          className="hidden justify-self-center lg:flex"
        >
          <NavigationMenuList className="gap-1">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const item = entry.item
                const gAktif =
                  aktif(item.href) ||
                  (item.anak ?? []).some((a) => aktif(a.href))

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className={kelasTrigger(gAktif)}>
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="border-border bg-popover flex w-60 flex-col gap-0.5 p-1.5 shadow-[var(--shadow-soft)]">
                        {(item.anak ?? []).map((sub) => (
                          <li key={sub.href}>
                            <NavigationMenuLink
                              href={sub.href}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                aktif(sub.href)
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground hover:bg-muted"
                              )}
                            >
                              {sub.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
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
                    aria-current={aktif(item.href) ? "page" : undefined}
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
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <Button
            asChild
            variant="heroGhost"
            size="pill"
            className="hidden rounded-full px-6 font-semibold transition-transform hover:scale-[1.03] lg:inline-flex"
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
            className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile — panel navy gelap menyatu dengan identitas brand; halaman
          dikunci (overflow hidden) dan bisa ditutup dengan Escape. */}
      {open ? (
        <div
          id="menu-mobile"
          className="bg-secondary absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 shadow-[var(--shadow-lift)] lg:hidden"
        >
          <div className="mx-auto max-w-[80rem] px-4 py-4">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const item = entry.item
                const terbuka = bukaMobile === item.href

                return (
                  <div
                    key={item.href}
                    className="border-b border-white/10 last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => setBukaMobile(terbuka ? null : item.href)}
                      className="flex w-full items-center justify-between px-3 py-3 text-sm font-medium text-white"
                      aria-expanded={terbuka}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-4 text-white/50 transition-transform",
                          terbuka && "rotate-180 text-white"
                        )}
                      />
                    </button>
                    {terbuka ? (
                      <ul className="pb-2">
                        {(item.anak ?? []).map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm",
                                aktif(sub.href)
                                  ? "bg-white/10 text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              }

              const item = entry.item

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  className={cn(
                    "block border-b border-white/10 px-3 py-3 text-sm font-medium last:border-0",
                    aktif(item.href)
                      ? "text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="pt-4">
              <Button
                asChild
                variant="heroGhost"
                size="pill"
                className="w-full rounded-full"
              >
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
