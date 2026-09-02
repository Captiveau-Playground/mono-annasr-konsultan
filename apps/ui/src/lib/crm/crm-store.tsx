"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  akunInternal,
  isoHariIni,
  seedActivities,
  seedClients,
  seedLeads,
  seedProjects,
  type Activity,
  type Client,
  type CrmUser,
  type Lead,
  type Project,
} from "@/data/crm"

type Data = {
  leads: Lead[]
  clients: Client[]
  projects: Project[]
  activities: Activity[]
}

const KUNCI_DATA = "annasr-crm-data"
const KUNCI_USER = "annasr-crm-user"

const dataAwal: Data = {
  leads: seedLeads,
  clients: seedClients,
  projects: seedProjects,
  activities: seedActivities,
}

function baca<T>(kunci: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(kunci)

    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function idBaru(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

type Ctx = Data & {
  user: CrmUser | null
  siap: boolean
  login: (email: string, password: string) => { ok: boolean; pesan?: string }
  logout: () => void
  tambahLead: (
    lead: Omit<Lead, "id" | "tanggalMasuk" | "status"> & Partial<Lead>
  ) => Lead
  ubahLead: (id: string, patch: Partial<Lead>) => void
  hapusLead: (id: string) => void
  konversiLead: (id: string) => Client | null
  tambahClient: (
    client: Omit<Client, "id" | "tanggalGabung"> & Partial<Client>
  ) => Client
  ubahClient: (id: string, patch: Partial<Client>) => void
  tambahProject: (project: Omit<Project, "id"> & Partial<Project>) => Project
  ubahProject: (id: string, patch: Partial<Project>) => void
  tambahActivity: (
    activity: Omit<Activity, "id"> & Partial<Activity>
  ) => Activity
  ubahActivity: (id: string, patch: Partial<Activity>) => void
}

const CrmContext = createContext<Ctx | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  // Hydrate from localStorage once on the client; the server render uses the
  // seed so both sides stay in sync over the first paint.
  const [data, setData] = useState<Data>(() => baca(KUNCI_DATA, dataAwal))
  const [user, setUser] = useState<CrmUser | null>(() => baca(KUNCI_USER, null))
  // True only after hydration — mirrors TanStack's `ssr: false` for /crm.
  const siap = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (!siap) return
    window.localStorage.setItem(KUNCI_DATA, JSON.stringify(data))
  }, [data, siap])

  const login = useCallback((email: string, password: string) => {
    const akun = akunInternal.find(
      (a) =>
        a.email.toLowerCase() === email.trim().toLowerCase() &&
        a.password === password
    )
    if (!akun)
      return { ok: false, pesan: "Email atau kata sandi tidak sesuai." }
    setUser(akun.user)
    window.localStorage.setItem(KUNCI_USER, JSON.stringify(akun.user))

    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem(KUNCI_USER)
  }, [])

  const nilai = useMemo<Ctx>(() => {
    const tambahLead: Ctx["tambahLead"] = (lead) => {
      const baru: Lead = {
        id: idBaru("L"),
        status: "New",
        tanggalMasuk: isoHariIni(),
        ...lead,
      } as Lead
      setData((d) => ({ ...d, leads: [baru, ...d.leads] }))

      return baru
    }

    const tambahActivity: Ctx["tambahActivity"] = (activity) => {
      const baru = { id: idBaru("A"), ...activity } as Activity
      setData((d) => ({ ...d, activities: [baru, ...d.activities] }))

      return baru
    }

    const tambahClient: Ctx["tambahClient"] = (client) => {
      const baru: Client = {
        id: idBaru("C"),
        tanggalGabung: isoHariIni(),
        ...client,
      } as Client
      setData((d) => ({ ...d, clients: [baru, ...d.clients] }))

      return baru
    }

    return {
      ...data,
      user,
      siap,
      login,
      logout,
      tambahLead,
      ubahLead: (id, patch) =>
        setData((d) => ({
          ...d,
          leads: d.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      hapusLead: (id) =>
        setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) })),
      konversiLead: (id) => {
        const lead = data.leads.find((l) => l.id === id)
        if (!lead) return null
        const client: Client = {
          id: idBaru("C"),
          perusahaan: lead.perusahaan,
          pic: lead.nama,
          jabatan: lead.jabatan,
          email: lead.email,
          whatsapp: lead.whatsapp,
          alamat: "-",
          industri: "-",
          catatan: `Dikonversi dari lead ${lead.id}. Kebutuhan awal: ${lead.kebutuhan}`,
          tanggalGabung: isoHariIni(),
        }
        setData((d) => ({
          ...d,
          clients: [client, ...d.clients],
          leads: d.leads.map((l) =>
            l.id === id ? { ...l, status: "Won", clientId: client.id } : l
          ),
        }))

        return client
      },
      tambahClient,
      ubahClient: (id, patch) =>
        setData((d) => ({
          ...d,
          clients: d.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      tambahProject: (project) => {
        const baru = { id: idBaru("P"), ...project } as Project
        setData((d) => ({ ...d, projects: [baru, ...d.projects] }))

        return baru
      },
      ubahProject: (id, patch) =>
        setData((d) => ({
          ...d,
          projects: d.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),
      tambahActivity,
      ubahActivity: (id, patch) =>
        setData((d) => ({
          ...d,
          activities: d.activities.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        })),
    }
  }, [data, user, siap, login, logout])

  return <CrmContext.Provider value={nilai}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error("useCrm harus dipakai di dalam CrmProvider")

  return ctx
}

/** Dipakai form publik di Company Profile agar lead langsung masuk ke CRM. */
export function simpanLeadPublik(lead: {
  nama: string
  perusahaan: string
  jabatan?: string
  email: string
  whatsapp: string
  layanan: string
  kebutuhan: string
  potensiNilai?: number
}) {
  if (typeof window === "undefined") return
  const data = baca<Data>(KUNCI_DATA, dataAwal)
  const baru: Lead = {
    id: idBaru("L"),
    nama: lead.nama,
    perusahaan: lead.perusahaan || "-",
    jabatan: lead.jabatan || "-",
    email: lead.email,
    whatsapp: lead.whatsapp,
    layanan: lead.layanan,
    sumber: "Form Website",
    kebutuhan: lead.kebutuhan,
    pic: "Belum ditugaskan",
    potensiNilai: lead.potensiNilai ?? 0,
    status: "New",
    tanggalMasuk: isoHariIni(),
  }
  window.localStorage.setItem(
    KUNCI_DATA,
    JSON.stringify({ ...data, leads: [baru, ...data.leads] })
  )
}
