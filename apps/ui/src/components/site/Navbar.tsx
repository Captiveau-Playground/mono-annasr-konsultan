"use client"

import {
  Briefcase,
  ChevronDown,
  Compass,
  FolderKanban,
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
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { layanan, navigasi, perusahaan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

type ItemNav = {
  label: string
  href: string
}

/** Link flat utama di desktop — layanan & profil dibuat grup agar muat tanpa numpuk. */
const FLAT_DESKTOP: ItemNav[] = [
  { label: "Beranda", href: "/" },
  { label: "Proyek", href: "/portfolio" },
  { label: "Hubungi Kami", href: "/kontak" },
]

const GRUP_DESKTOP: { label: string; href: string; anak: ItemNav[] }[] = [
  {
    label: "Layanan",
    href: "/layanan",
    anak: layanan.map((l) => ({ label: l.nama, href: `/layanan/${l.slug}` })),
  },
  {
    label: "Profil",
    href: "/tentang",
    anak: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Artikel", href: "/artikel" },
      { label: "Karir", href: "/karir" },
    ],
  },
]

const IKON_NAV: Record<string, LucideIcon> = {
  "/": Home,
  "/layanan": PanelsTopLeft,
  "/portfolio": FolderKanban,
  "/tentang": Users,
  "/artikel": Newspaper,
  "/karir": Briefcase,
  "/kontak": Phone,
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [grupBuka, setGrupBuka] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const terang = !scrolled && !open
  const teksNav = terang
    ? "text-primary-foreground/80 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-primary"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (navRef.current && !navRef.current.contains(target)) {
        setGrupBuka(null)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)

    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  // Jeda kecil sebelum menutup group saat mouse keluar — memberi waktu untuk
  // "intip" ke panel (jarak mt-2 antara trigger dan menu tidak mematikan hover).
  const timerTutup = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerTutup.current) clearTimeout(timerTutup.current)
    },
    []
  )

  const bukaGrup = (href: string) => {
    if (timerTutup.current) clearTimeout(timerTutup.current)
    setGrupBuka(href)
  }

  const tutupGrupNanti = () => {
    if (timerTutup.current) clearTimeout(timerTutup.current)
    timerTutup.current = setTimeout(() => setGrupBuka(null), 250)
  }

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  const teksAktif = terang ? "text-accent" : "text-primary"

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/85 border-b py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent py-4"
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 lg:px-8"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => {
            setOpen(false)
            setGrupBuka(null)
          }}
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
              CV. An Nasr Konsultan
            </span>
            <span
              className={`block text-[11px] tracking-wide ${
                terang ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              Konsultan Teknik &amp; Konstruksi
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — item flat + grup dropdown */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {FLAT_DESKTOP.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setGrupBuka(null)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  aktif(item.href) ? teksAktif : teksNav
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {GRUP_DESKTOP.map((grup) => {
            const terbuka = grupBuka === grup.href

            return (
              <li
                key={grup.href}
                className="relative flex items-center"
                onMouseEnter={() => bukaGrup(grup.href)}
                onMouseLeave={tutupGrupNanti}
              >
                <Link
                  href={grup.href}
                  onClick={() => setGrupBuka(null)}
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    aktif(grup.href) ? teksAktif : teksNav
                  )}
                >
                  {grup.label}
                </Link>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={terbuka}
                  aria-label={`Submenu ${grup.label}`}
                  onClick={() => setGrupBuka(terbuka ? null : grup.href)}
                  className={cn(
                    "-ml-1.5 flex size-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    aktif(grup.href) ? teksAktif : teksNav
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      terbuka && "rotate-180"
                    )}
                  />
                </button>

                {terbuka ? (
                  <div
                    role="menu"
                    onMouseEnter={() => bukaGrup(grup.href)}
                    className="border-border bg-background absolute top-full left-0 z-20 mt-2 w-64 rounded-2xl border p-2 shadow-[var(--shadow-soft)]"
                  >
                    {grup.anak.map((anak) => (
                      <Link
                        key={anak.href}
                        role="menuitem"
                        href={anak.href}
                        onClick={() => setGrupBuka(null)}
                        className={cn(
                          "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          aktif(anak.href)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-surface hover:text-primary"
                        )}
                      >
                        {anak.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <Button asChild size="pill" variant={terang ? "hero" : "default"}>
            <a
              href={`https://wa.me/${perusahaan.whatsapp}`}
              target="_blank"
              rel="noreferrer"
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
            {navigasi.map((item) => {
              const Ikon = IKON_NAV[item.to] ?? Home
              const isAktif = aktif(item.to)

              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
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
                href={`https://wa.me/${perusahaan.whatsapp}`}
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
