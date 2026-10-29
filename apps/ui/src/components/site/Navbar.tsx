"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
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

/**
 * Rute yang section pertamanya berlatar gelap (hero navy). Di rute ini navbar
 * boleh transparan total saat di puncak halaman — menyatu dengan hero.
 * Rute lain memakai latar solid supaya teks putih tetap terbaca di atas
 * halaman terang (mis. /tentang, /layanan/[slug]).
 */
const RUTE_HERO_GELAP = [
  /^\/$/,
  /^\/layanan$/,
  /^\/portfolio$/,
  /^\/klien$/,
  /^\/karir(\/.*)?$/,
  /^\/kontak$/,
  /^\/artikel$/,
  /^\/rekanan$/,
]

const tanpaLocale = (pathname: string) =>
  pathname.replace(/^\/(cs|en)(?=\/|$)/, "") || "/"

/** Dropdown desktop — state dikontrol sendiri (hover-intent + klik + keyboard).
 *  Sengaja tidak memakai Radix NavigationMenu: animasi slide horizontalnya
 *  membuat panel "melompat", dan celah 6px antara trigger & panel memutus hover. */
function GrupNav({
  item,
  aktifGrup,
  subAktif,
}: {
  item: ItemNav
  aktifGrup: boolean
  subAktif: (href: string) => boolean
}) {
  const id = useId()
  const [buka, setBuka] = useState(false)
  const tombol = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)

  // Satu mode saja: KLIK untuk buka/tutup (tanpa hover-open), supaya tidak
  // ada dua trigger yang saling bertabrakan (hover buka → klik malah menutup).
  // Tutup saat Escape / klik di luar / halaman di-scroll.
  useEffect(() => {
    if (!buka) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setBuka(false)
      tombol.current?.focus()
    }

    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return
      if (panel.current?.contains(target) || tombol.current?.contains(target)) {
        return
      }
      setBuka(false)
    }

    const onScroll = () => setBuka(false)

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [buka])

  const tutup = () => setBuka(false)

  return (
    <div className="relative">
      <button
        ref={tombol}
        type="button"
        aria-haspopup="true"
        aria-expanded={buka}
        aria-controls={id}
        aria-current={aktifGrup ? "true" : undefined}
        onClick={() => setBuka((v) => !v)}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown") {
            return
          }

          e.preventDefault()
          setBuka(true)
          requestAnimationFrame(() =>
            panel.current?.querySelector<HTMLAnchorElement>(":scope a")?.focus()
          )
        }}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors outline-none",
          "text-white/70 hover:bg-white/10 hover:text-white",
          "focus-visible:ring-accent/70 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          (buka || aktifGrup) && "bg-white/10 text-white"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            buka && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {/* pt-2 = jembatan hover: tanpa celah antara trigger dan panel. */}
      <div
        id={id}
        ref={panel}
        className={cn(
          "absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2",
          !buka && "hidden"
        )}
      >
        <div className="border-border/70 bg-popover animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 w-64 rounded-xl border p-2 shadow-[var(--shadow-lift)] duration-150">
          <ul className="flex flex-col gap-0.5">
            {(item.anak ?? []).map((sub) => (
              <li key={sub.href}>
                <Link
                  href={sub.href}
                  onClick={tutup}
                  aria-current={subAktif(sub.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                    subAktif(sub.href)
                      ? "bg-primary/8 text-primary font-medium"
                      : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-border/60 mt-1 border-t pt-1">
            <Link
              href={item.href}
              onClick={tutup}
              className="text-primary hover:bg-primary/5 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Lihat semua {item.label.toLowerCase()}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Navbar({
  brandNama,
  navigasiCms,
  tagline,
  whatsapp,
  layananNav,
  logoImage,
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
  /** Logo dari CMS (navbar.logoImage) — fallback logo statis FE. */
  logoImage?: string
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

  const path = tanpaLocale(pathname)
  const heroGelap = RUTE_HERO_GELAP.some((re) => re.test(path))
  /** Di puncak halaman + hero gelap: navbar menyatu (transparan) dengan hero. */
  const menyatu = !scrolled && heroGelap

  const kelasLink = (href: string) =>
    cn(
      "relative rounded-full px-3 py-2 text-sm font-medium transition-colors",
      "text-white/70 hover:bg-white/10 hover:text-white",
      "outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      aktif(href) && "bg-white/10 text-white hover:bg-white/10 hover:text-white"
    )

  return (
    <header
      className={cn(
        // Latar TIDAK di header langsung: dua lapisan opaque di bawah ini yang
        // saling cross-fade. Sebelumnya header sempat transparan + backdrop-blur
        // saat transisi sehingga konten di belakangnya menembus (terlihat
        // seperti "navbar kedua") — terutama di halaman berlatar putih.
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-[0_10px_30px_-15px_rgba(4,10,22,0.6)]" : ""
      )}
    >
      {/* Lapisan 1 (bawah): navy solid. Selalu opaque saat bukan mode
          "menyatu", supaya saat lapisan gradient memudar tidak ada frame
          tembus pandang (penyebab tampilan seperti navbar ganda). */}
      <div
        aria-hidden
        className={cn(
          "bg-secondary pointer-events-none absolute inset-0 border-b border-white/5 transition-opacity duration-300",
          scrolled || !menyatu ? "opacity-100" : "opacity-0"
        )}
      />
      {/* Lapisan 2 (atas): gradient navy — memudar saat scroll. */}
      <div
        aria-hidden
        className={cn(
          "cta-gradient pointer-events-none absolute inset-0 transition-opacity duration-300",
          !scrolled && !menyatu ? "opacity-100" : "opacity-0"
        )}
      />

      <a
        href="#konten"
        className="focus:text-primary sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Lewati ke konten
      </a>

      {/* Tinggi konstan h-16 — tidak menyusut saat scroll supaya tidak ada
          lompatan layout pada konten di bawahnya. */}
      <nav
        aria-label="Navigasi utama"
        className="relative mx-auto grid h-16 max-w-[80rem] grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-10 shrink-0 items-center justify-center">
            <Image
              src={logoImage?.trim() || "/images/logo/logo-white.png"}
              alt={brandNama?.trim() || "CV. An Nasr Konsultan"}
              width={40}
              height={40}
              priority
              className={cn(
                "size-10 object-contain transition-transform duration-300",
                // Kontraksi halus saat di puncak halaman — tanpa mengubah
                // lebar kolom logo (mencegah menu ikut bergeser saat scroll).
                !scrolled && "scale-90"
              )}
            />
          </span>
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-sm font-semibold text-white">
              {brandNama?.trim() || "CV. An Nasr Konsultan"}
            </span>
            <span className="hidden text-[11px] tracking-wide text-white/60 sm:block">
              {tagline ?? "Konsultan Teknik & Konstruksi"}
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — item flat + grup dengan dropdown sendiri. */}
        <ul className="hidden items-center justify-center gap-1 justify-self-center lg:flex">
          {menu.map((entry) => {
            if (entry.type === "grup") {
              const item = entry.item
              const gAktif =
                aktif(item.href) || (item.anak ?? []).some((a) => aktif(a.href))

              return (
                <li key={item.href}>
                  <GrupNav item={item} aktifGrup={gAktif} subAktif={aktif} />
                </li>
              )
            }

            const item = entry.item

            return (
              <li key={item.href}>
                <Link
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
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <Button
            asChild
            size="pill"
            className="bg-accent text-accent-foreground hover:bg-accent/90 hidden rounded-full px-6 font-semibold shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03] lg:inline-flex"
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
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="focus-visible:ring-accent/70 flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Backdrop gelap — klik di luar panel untuk menutup (mobile). */}
      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="animate-in fade-in bg-secondary/50 fixed inset-0 top-16 z-40 backdrop-blur-[2px] duration-200 lg:hidden"
        />
      ) : null}

      {/* Mobile — panel navy gelap menyatu dengan identitas brand; halaman
          dikunci (overflow hidden) dan bisa ditutup dengan Escape. */}
      {open ? (
        <div
          id="menu-mobile"
          className="bg-secondary animate-in fade-in slide-in-from-top-2 absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 shadow-[var(--shadow-lift)] duration-200 lg:hidden"
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
                      className="focus-visible:ring-accent/70 flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-white transition-colors outline-none hover:bg-white/5 focus-visible:ring-2"
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
                              aria-current={
                                aktif(sub.href) ? "page" : undefined
                              }
                              className={cn(
                                "relative block rounded-lg px-3 py-2.5 text-sm transition-colors",
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
                    "focus-visible:ring-accent/70 relative block border-b border-white/10 px-3 py-3 text-sm font-medium transition-colors outline-none last:border-0 focus-visible:ring-2",
                    aktif(item.href)
                      ? "bg-white/10 text-white"
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
                size="pill"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full rounded-full font-semibold"
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
