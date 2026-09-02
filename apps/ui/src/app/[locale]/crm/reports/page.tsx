"use client"

import { CrmShell } from "@/components/crm/CrmShell"
import { rupiah, statusLead, statusProyek, sumberLead } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"

function Bar({
  label,
  nilai,
  maks,
  teks,
}: {
  label: string
  nilai: number
  maks: number
  teks: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{teks}</span>
      </div>
      <div className="bg-surface mt-1.5 h-2 rounded-full">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${maks > 0 ? (nilai / maks) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}

export default function HalamanReports() {
  const { leads, clients, projects, activities } = useCrm()

  const perStatus = statusLead.map((s) => ({
    s,
    n: leads.filter((l) => l.status === s).length,
  }))
  const perSumber = sumberLead.map((s) => ({
    s,
    n: leads.filter((l) => l.sumber === s).length,
  }))
  const perProyek = statusProyek.map((s) => ({
    s,
    n: projects.filter((p) => p.status === s).length,
    v: projects.filter((p) => p.status === s).reduce((a, p) => a + p.nilai, 0),
  }))

  const won = leads.filter((l) => l.status === "Won").length
  const konversi = leads.length ? Math.round((won / leads.length) * 100) : 0
  const nilaiProyek = projects.reduce((a, p) => a + p.nilai, 0)

  const ringkas = [
    { label: "Total Lead", nilai: String(leads.length) },
    { label: "Rasio Konversi", nilai: `${konversi}%` },
    { label: "Client Aktif", nilai: String(clients.length) },
    { label: "Total Nilai Proyek", nilai: rupiah(nilaiProyek) },
    { label: "Aktivitas Tercatat", nilai: String(activities.length) },
    {
      label: "Follow-up Terjadwal",
      nilai: String(activities.filter((a) => a.status === "Terjadwal").length),
    },
  ]

  const maksStatus = Math.max(1, ...perStatus.map((x) => x.n))
  const maksSumber = Math.max(1, ...perSumber.map((x) => x.n))
  const maksProyek = Math.max(1, ...perProyek.map((x) => x.n))

  return (
    <CrmShell
      judul="Reports"
      deskripsi="Ringkasan performa pipeline dan proyek"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ringkas.map((r) => (
          <div
            key={r.label}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              {r.label}
            </p>
            <p className="text-foreground mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold">
              {r.nilai}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <h2 className="text-foreground text-sm font-semibold">
            Lead per Tahap Pipeline
          </h2>
          {perStatus.map((x) => (
            <Bar
              key={x.s}
              label={x.s}
              nilai={x.n}
              maks={maksStatus}
              teks={`${x.n} lead`}
            />
          ))}
        </div>
        <div className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <h2 className="text-foreground text-sm font-semibold">
            Lead per Sumber
          </h2>
          {perSumber.map((x) => (
            <Bar
              key={x.s}
              label={x.s}
              nilai={x.n}
              maks={maksSumber}
              teks={`${x.n} lead`}
            />
          ))}
        </div>
        <div className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <h2 className="text-foreground text-sm font-semibold">
            Proyek per Status
          </h2>
          {perProyek.map((x) => (
            <Bar
              key={x.s}
              label={x.s}
              nilai={x.n}
              maks={maksProyek}
              teks={rupiah(x.v)}
            />
          ))}
        </div>
      </div>
    </CrmShell>
  )
}
