"use client"

import { useParams } from "next/navigation"

import { CrmShell, Lencana } from "@/components/crm/CrmShell"
import { Button } from "@/components/ui/button"
import { rupiah, statusProyek, tanggalID, type StatusProyek } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function DetailProject() {
  const { id } = useParams<{ id: string }>()
  const { projects, clients, ubahProject } = useCrm()
  const proyek = projects.find((p) => p.id === id)

  if (!proyek) {
    return (
      <CrmShell judul="Project tidak ditemukan">
        <Button asChild size="sm">
          <Link href="/crm/projects">Kembali ke Projects</Link>
        </Button>
      </CrmShell>
    )
  }

  const client = clients.find((c) => c.id === proyek.clientId)
  const baris = [
    ["Client", client?.perusahaan ?? "-"],
    ["PIC", proyek.pic],
    ["Jenis Layanan", proyek.layanan],
    ["Lokasi", proyek.lokasi],
    ["Nilai Proyek", rupiah(proyek.nilai)],
    ["Tanggal Mulai", tanggalID(proyek.mulai)],
    ["Target Selesai", tanggalID(proyek.target)],
  ]

  return (
    <CrmShell
      judul={proyek.nama}
      deskripsi={`Project ${proyek.id}`}
      aksi={
        <Button asChild variant="outline" size="sm">
          <Link href="/crm/projects">Kembali</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border bg-card rounded-2xl border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-foreground text-sm font-semibold">
                Informasi Proyek
              </h2>
              <Lencana status={proyek.status} />
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {baris.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    {k}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Catatan
              </p>
              <p className="text-foreground/85 mt-1 text-sm">
                {proyek.catatan}
              </p>
            </div>
          </div>

          {client ? (
            <div className="border-border bg-card rounded-2xl border p-6">
              <h2 className="text-foreground text-sm font-semibold">
                Client Terkait
              </h2>
              <Link
                href={`/crm/clients/${client.id}`}
                className="text-primary mt-3 block text-sm font-medium"
              >
                {client.perusahaan}
              </Link>
              <p className="text-muted-foreground text-xs">
                {client.pic} · {client.whatsapp}
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-foreground text-sm font-semibold">Progress</h2>
            <div className="bg-surface mt-4 h-2.5 rounded-full">
              <div
                className="bg-accent h-2.5 rounded-full"
                style={{ width: `${proyek.progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={proyek.progress}
              onChange={(e) =>
                ubahProject(proyek.id, { progress: Number(e.target.value) })
              }
              className="mt-4 w-full"
            />
            <p className="text-foreground text-center text-sm font-semibold">
              {proyek.progress}%
            </p>
          </div>

          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-foreground text-sm font-semibold">
              Status Proyek
            </h2>
            <div className="mt-4 grid gap-2">
              {statusProyek.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    ubahProject(proyek.id, { status: s as StatusProyek })
                  }
                  className={`rounded-xl px-3 py-2 text-left text-sm ${
                    proyek.status === s
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-surface border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CrmShell>
  )
}
