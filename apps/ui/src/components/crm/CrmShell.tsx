"use client"

import {
  Activity as ActivityIcon,
  BarChart3,
  Briefcase,
  Building2,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

const menu = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/crm/leads", label: "Leads", icon: Users, exact: false },
  { to: "/crm/clients", label: "Clients", icon: Building2, exact: false },
  { to: "/crm/projects", label: "Projects", icon: Briefcase, exact: false },
  {
    to: "/crm/activities",
    label: "Follow Up",
    icon: ActivityIcon,
    exact: false,
  },
  { to: "/crm/reports", label: "Reports", icon: BarChart3, exact: false },
] as const

export function CrmShell({
  judul,
  deskripsi,
  aksi,
  children,
}: {
  judul: string
  deskripsi?: string
  aksi?: ReactNode
  children: ReactNode
}) {
  const { user, siap, logout } = useCrm()
  const router = useRouter()
  const pathname = usePathname()
  const [buka, setBuka] = useState(false)

  useEffect(() => {
    if (siap && !user) router.replace("/crm/login")
  }, [siap, user, router])

  if (!siap || !user) {
    return (
      <div className="bg-surface text-muted-foreground flex min-h-screen items-center justify-center text-sm">
        Memuat area internal…
      </div>
    )
  }

  const aktif = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname.startsWith(to)

  return (
    <div className="bg-surface min-h-screen">
      <aside
        className={`border-border bg-secondary text-primary-foreground fixed inset-y-0 left-0 z-50 w-64 -translate-x-full border-r transition-transform lg:translate-x-0 ${
          buka ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="bg-primary-foreground/10 flex size-9 items-center justify-center rounded-xl">
            <Compass className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-sm font-semibold">
              CRM Internal
            </span>
            <span className="text-primary-foreground/60 block text-[11px]">
              CV. An Nasr Konsultan
            </span>
          </span>
        </div>

        <nav className="mt-2 space-y-1 px-3">
          {menu.map((m) => (
            <Link
              key={m.to}
              href={m.to}
              onClick={() => setBuka(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                aktif(m.to, m.exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10"
              }`}
            >
              <m.icon className="size-4" />
              {m.label}
            </Link>
          ))}
        </nav>

        <div className="border-primary-foreground/10 absolute inset-x-0 bottom-0 space-y-3 border-t p-4">
          <div className="text-primary-foreground/70 text-xs">
            <p className="text-primary-foreground font-semibold">{user.nama}</p>
            <p>{user.peran}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="border-primary-foreground/20 text-primary-foreground/80 rounded-lg border px-3 py-2 text-center text-xs"
            >
              Lihat Company Profile
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
                router.replace("/crm/login")
              }}
              className="bg-primary-foreground/10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
            >
              <LogOut className="size-3.5" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {buka ? (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setBuka(false)}
          className="bg-foreground/40 fixed inset-0 z-40 lg:hidden"
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="border-border bg-background/90 sticky top-0 z-30 border-b backdrop-blur">
          <div className="flex items-center gap-4 px-5 py-4 lg:px-8">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setBuka((v) => !v)}
              className="border-border flex size-9 items-center justify-center rounded-lg border lg:hidden"
            >
              {buka ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-foreground truncate font-[family-name:var(--font-heading)] text-lg font-semibold">
                {judul}
              </h1>
              {deskripsi ? (
                <p className="text-muted-foreground truncate text-xs">
                  {deskripsi}
                </p>
              ) : null}
            </div>
            {aksi}
          </div>
        </header>
        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}

export function KartuStat({
  label,
  nilai,
  keterangan,
  ikon: Ikon,
}: {
  label: string
  nilai: string | number
  keterangan?: string
  ikon?: typeof Users
}) {
  return (
    <div className="border-border bg-card rounded-2xl border p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
        {Ikon ? <Ikon className="text-primary size-4" /> : null}
      </div>
      <p className="text-foreground mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold">
        {nilai}
      </p>
      {keterangan ? (
        <p className="text-muted-foreground mt-1 text-xs">{keterangan}</p>
      ) : null}
    </div>
  )
}

const warnaStatus: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Contacted: "bg-sky-500/10 text-sky-700",
  Qualified: "bg-violet-500/10 text-violet-700",
  Proposal: "bg-amber-500/10 text-amber-700",
  Negotiation: "bg-orange-500/10 text-orange-700",
  Won: "bg-accent/20 text-accent-foreground",
  Lost: "bg-destructive/10 text-destructive",
  Planning: "bg-primary/10 text-primary",
  "On Going": "bg-amber-500/10 text-amber-700",
  Completed: "bg-accent/20 text-accent-foreground",
  Terjadwal: "bg-amber-500/10 text-amber-700",
  Selesai: "bg-accent/20 text-accent-foreground",
  Batal: "bg-destructive/10 text-destructive",
}

export function Lencana({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        warnaStatus[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  )
}

export function TombolKembali({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={to}>{label}</Link>
    </Button>
  )
}
