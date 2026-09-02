"use client"

import { useState } from "react"

import { Lencana } from "@/components/crm/CrmShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  daftarPic,
  jenisAktivitas,
  isoHariIni,
  tanggalID,
  type JenisAktivitas,
} from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"

export function TimelineAktivitas({
  leadId,
  clientId,
}: {
  leadId?: string
  clientId?: string
}) {
  const { activities, tambahActivity, ubahActivity } = useCrm()
  const [buka, setBuka] = useState(false)

  const daftar = activities
    .filter((a) => (leadId ? a.leadId === leadId : a.clientId === clientId))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))

  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-semibold">
          Timeline Aktivitas & Follow Up
        </h2>
        <Button size="sm" variant="outline" onClick={() => setBuka((v) => !v)}>
          {buka ? "Tutup" : "Tambah Aktivitas"}
        </Button>
      </div>

      {buka ? (
        <form
          className="border-border bg-surface mt-5 grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            tambahActivity({
              jenis: String(f.get("jenis")) as JenisAktivitas,
              tanggal: String(f.get("tanggal")),
              pic: String(f.get("pic")),
              status: String(f.get("status")) as
                | "Terjadwal"
                | "Selesai"
                | "Batal",
              catatan: String(f.get("catatan")),
              ...(leadId && { leadId }),
              ...(clientId && { clientId }),
            })
            setBuka(false)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="jenis">Jenis</Label>
            <select
              id="jenis"
              name="jenis"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              {jenisAktivitas.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={isoHariIni()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pic">PIC</Label>
            <select
              id="pic"
              name="pic"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              {daftarPic.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              <option>Terjadwal</option>
              <option>Selesai</option>
              <option>Batal</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea id="catatan" name="catatan" rows={2} />
          </div>
          <Button type="submit" size="sm" className="sm:col-span-2">
            Simpan Aktivitas
          </Button>
        </form>
      ) : null}

      <ol className="border-border mt-6 space-y-4 border-l pl-5">
        {daftar.map((a) => (
          <li key={a.id} className="relative">
            <span className="border-background bg-primary absolute top-1.5 -left-[27px] size-3 rounded-full border-2" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {a.jenis}
              </span>
              <Lencana status={a.status} />
              <span className="text-muted-foreground text-xs">
                {tanggalID(a.tanggal)} · {a.pic}
              </span>
            </div>
            <p className="text-foreground/80 mt-1 text-sm">{a.catatan}</p>
            {a.status === "Terjadwal" ? (
              <button
                type="button"
                onClick={() => ubahActivity(a.id, { status: "Selesai" })}
                className="text-primary mt-1 text-xs font-medium"
              >
                Tandai selesai
              </button>
            ) : null}
          </li>
        ))}
        {daftar.length === 0 ? (
          <li className="text-muted-foreground text-xs">
            Belum ada aktivitas tercatat.
          </li>
        ) : null}
      </ol>
    </div>
  )
}
