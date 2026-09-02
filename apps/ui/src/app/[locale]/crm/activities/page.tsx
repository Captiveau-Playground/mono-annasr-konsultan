"use client"

import { CrmShell, Lencana } from "@/components/crm/CrmShell"
import { tanggalID } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function HalamanActivities() {
  const { activities, leads, clients, ubahActivity } = useCrm()
  const urut = [...activities].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  )

  const terkait = (leadId?: string, clientId?: string) => {
    if (leadId) {
      const l = leads.find((x) => x.id === leadId)

      return l
        ? { label: `${l.nama} · ${l.perusahaan}`, to: `/crm/leads/${l.id}` }
        : null
    }
    if (clientId) {
      const c = clients.find((x) => x.id === clientId)

      return c ? { label: c.perusahaan, to: `/crm/clients/${c.id}` } : null
    }

    return null
  }

  return (
    <CrmShell
      judul="Activities"
      deskripsi="Seluruh catatan follow-up tim internal"
    >
      <div className="border-border bg-card overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-surface text-muted-foreground text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Terkait</th>
              <th className="px-4 py-3">Catatan</th>
              <th className="px-4 py-3">PIC</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {urut.map((a) => {
              const rel = terkait(a.leadId, a.clientId)

              return (
                <tr key={a.id} className="border-border border-t align-top">
                  <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                    {tanggalID(a.tanggal)}
                  </td>
                  <td className="text-foreground px-4 py-3 font-medium">
                    {a.jenis}
                  </td>
                  <td className="px-4 py-3">
                    {rel ? (
                      <Link
                        href={rel.to}
                        className="text-primary hover:underline"
                      >
                        {rel.label}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {a.catatan}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">{a.pic}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => ubahActivity(a.id, { status: "Selesai" })}
                    >
                      <Lencana status={a.status} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </CrmShell>
  )
}
