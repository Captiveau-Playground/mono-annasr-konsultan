"use client"

import { useParams } from "next/navigation"

import { CrmShell, Lencana } from "@/components/crm/CrmShell"
import { TimelineAktivitas } from "@/components/crm/TimelineAktivitas"
import { Button } from "@/components/ui/button"
import { rupiah, tanggalID } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function DetailClient() {
  const { id } = useParams<{ id: string }>()
  const { clients, projects } = useCrm()
  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <CrmShell judul="Client tidak ditemukan">
        <Button asChild size="sm">
          <Link href="/crm/clients">Kembali ke Clients</Link>
        </Button>
      </CrmShell>
    )
  }

  const riwayat = projects.filter((p) => p.clientId === client.id)
  const baris = [
    ["Nama PIC", client.pic],
    ["Jabatan", client.jabatan],
    ["Email", client.email],
    ["WhatsApp", client.whatsapp],
    ["Industri", client.industri],
    ["Klien Sejak", tanggalID(client.tanggalGabung)],
    ["Alamat", client.alamat],
  ]

  return (
    <CrmShell
      judul={client.perusahaan}
      deskripsi={`Client ${client.id}`}
      aksi={
        <Button asChild variant="outline" size="sm">
          <Link href="/crm/clients">Kembali</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-foreground text-sm font-semibold">
              Informasi Client
            </h2>
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
                {client.catatan}
              </p>
            </div>
          </div>

          <TimelineAktivitas clientId={client.id} />
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-sm font-semibold">
              Riwayat Proyek
            </h2>
            <Link
              href="/crm/projects"
              className="text-primary text-xs font-medium"
            >
              Kelola
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {riwayat.map((p) => (
              <Link
                key={p.id}
                href={`/crm/projects/${p.id}`}
                className="border-border hover:bg-surface block rounded-xl border p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {p.nama}
                  </span>
                  <Lencana status={p.status} />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {p.layanan} · {rupiah(p.nilai)}
                </p>
              </Link>
            ))}
            {riwayat.length === 0 ? (
              <p className="text-muted-foreground text-xs">Belum ada proyek.</p>
            ) : null}
          </div>
        </div>
      </div>
    </CrmShell>
  )
}
