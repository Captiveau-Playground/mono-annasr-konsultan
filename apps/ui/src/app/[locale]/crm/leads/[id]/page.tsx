"use client"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { CrmShell, Lencana } from "@/components/crm/CrmShell"
import { TimelineAktivitas } from "@/components/crm/TimelineAktivitas"
import { Button } from "@/components/ui/button"
import { rupiah, statusLead, tanggalID, type StatusLead } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function DetailLead() {
  const { id } = useParams<{ id: string }>()
  const { leads, ubahLead, konversiLead } = useCrm()
  const router = useRouter()
  const lead = leads.find((l) => l.id === id)

  if (!lead) {
    return (
      <CrmShell judul="Lead tidak ditemukan">
        <Button asChild size="sm">
          <Link href="/crm/leads">Kembali ke Leads</Link>
        </Button>
      </CrmShell>
    )
  }

  const baris = [
    ["Perusahaan", lead.perusahaan],
    ["Jabatan", lead.jabatan],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp],
    ["Layanan Diminati", lead.layanan],
    ["Sumber Lead", lead.sumber],
    ["PIC", lead.pic],
    ["Potensi Nilai", rupiah(lead.potensiNilai)],
    ["Tanggal Masuk", tanggalID(lead.tanggalMasuk)],
  ]

  return (
    <CrmShell
      judul={lead.nama}
      deskripsi={`Lead ${lead.id} · ${lead.perusahaan}`}
      aksi={
        <Button asChild variant="outline" size="sm">
          <Link href="/crm/leads">Kembali</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border bg-card rounded-2xl border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-foreground text-sm font-semibold">
                Informasi Lead
              </h2>
              <Lencana status={lead.status} />
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
                Deskripsi Kebutuhan
              </p>
              <p className="text-foreground/85 mt-1 text-sm leading-relaxed">
                {lead.kebutuhan}
              </p>
            </div>
          </div>

          <TimelineAktivitas leadId={lead.id} />
        </div>

        <div className="space-y-4">
          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-foreground text-sm font-semibold">
              Ubah Status Pipeline
            </h2>
            <div className="mt-4 grid gap-2">
              {statusLead.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ubahLead(lead.id, { status: s as StatusLead })}
                  className={`rounded-xl px-3 py-2 text-left text-sm ${
                    lead.status === s
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-surface border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-foreground text-sm font-semibold">
              Konversi Menjadi Client
            </h2>
            <p className="text-muted-foreground mt-2 text-xs">
              Lead yang berhasil dapat dikonversi menjadi client dan dilanjutkan
              ke project.
            </p>
            {lead.clientId ? (
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href={`/crm/clients/${lead.clientId}`}>Lihat Client</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="mt-4 w-full"
                onClick={() => {
                  const client = konversiLead(lead.id)
                  if (client) {
                    toast.success("Lead dikonversi menjadi client.")
                    router.push(`/crm/clients/${client.id}`)
                  }
                }}
              >
                Konversi ke Client
              </Button>
            )}
          </div>

          <div className="border-border bg-card text-muted-foreground rounded-2xl border p-6 text-xs">
            <a
              href={`https://wa.me/${lead.whatsapp.replace(/^0/, "62")}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-medium"
            >
              Hubungi via WhatsApp
            </a>
            <br />
            <a
              href={`mailto:${lead.email}`}
              className="text-primary font-medium"
            >
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </CrmShell>
  )
}
