"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
}: {
  brandNama?: string
  /** Navigasi level atas dari CMS — item dengan `anak` jadi dropdown. */
  navigasiCms?: ItemNav[]
  /** Tagline dari CMS (situs.brandTagline) — di bawah nama brand. */
  tagline?: string
  /** Nomor WhatsApp dari CMS (kontak.whatsapp). */
  whatsapp?: string
}) {
  const daftar: ItemNav[] =
    navigasiCms && navigasiCms.length > 0
      ? navigasiCms
      : navigasi.map((n) => ({ label: n.label, href: n.to }))

  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp
  const [open, setOpen] = useState(false)
  const [bukaMobile, setBukaMobile] = useState<string | null>(null)
  const pathname = usePathname()

  const aktif = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  const menu: EntryMenu[] = daftar.map((item) =>
    item.anak && item.anak.length > 0
      ? { type: "grup", item }
      : { type: "link", item }
  )

  const kelasLink = (href: string) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors",
      aktif(href)
        ? "text-primary"
        : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
    )

  const kelasTrigger = (aktifGrup: boolean) =>
    cn(
      "h-10 gap-1 px-3 text-sm font-medium rounded-full",
      // Override hover/state bawaan shadcn (hover:bg-accent oranye) -> invert
      // biru; pakai important agar menang atas utility bawaan trigger.
      "hover:bg-primary! hover:text-primary-foreground! data-[state=open]:bg-primary! data-[state=open]:text-primary-foreground! hover:[&_svg]:text-primary-foreground! data-[state=open]:[&_svg]:text-primary-foreground!",
      aktifGrup ? "text-primary" : "text-muted-foreground"
    )

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto grid h-16 max-w-[80rem] grid-cols-[auto_1fr_auto] items-center gap-0 px-4 sm:px-6 lg:px-8">
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
            className="size-10 shrink-0 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-sm font-semibold">
              {brandNama?.trim() || "CV. An Nasr Konsultan"}
            </span>
            <span className="text-muted-foreground hidden text-[11px] tracking-wide sm:block">
              {tagline ?? "Konsultan Teknik &amp; Konstruksi"}
            </span>
          </span>
        </Link>

        {/* Navigasi desktop — item flat + grup yang bisa di-expand. */}
        <NavigationMenu className="hidden justify-self-center lg:flex">
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
                      <ul className="border-border bg-popover flex w-60 flex-col gap-0.5 border p-1.5 shadow-[var(--shadow-soft)]">
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

      {/* Mobile — grup bisa di-expand, tanpa animasi. */}
      {open ? (
        <div
          id="menu-mobile"
          className="border-border bg-background absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t shadow-[var(--shadow-lift)] lg:hidden"
        >
          <div className="mx-auto max-w-[80rem] px-4 py-4">
            {menu.map((entry) => {
              if (entry.type === "grup") {
                const item = entry.item
                const terbuka = bukaMobile === item.href

                return (
                  <div key={item.href} className="border-b last:border-0">
                    <button
                      type="button"
                      onClick={() => setBukaMobile(terbuka ? null : item.href)}
                      className="text-foreground flex w-full items-center justify-between px-3 py-3 text-sm font-medium"
                      aria-expanded={terbuka}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "text-muted-foreground size-4 transition-transform",
                          terbuka && "rotate-180"
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
                              className="text-muted-foreground hover:text-primary block rounded-lg px-3 py-2.5 text-sm"
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
                  className={cn(
                    "block border-b px-3 py-3 text-sm font-medium last:border-0",
                    aktif(item.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="pt-4">
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
