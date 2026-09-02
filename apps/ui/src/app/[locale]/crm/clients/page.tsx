"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { CrmShell } from "@/components/crm/CrmShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { rupiah, tanggalID } from "@/data/crm"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function HalamanClients() {
  const { clients, projects, tambahClient } = useCrm()
  const [buka, setBuka] = useState(false)

  return (
    <CrmShell
      judul="Clients"
      deskripsi="Daftar pelanggan aktif hasil konversi lead"
      aksi={
        <Button size="sm" onClick={() => setBuka((v) => !v)}>
          <Plus className="size-4" /> Client Baru
        </Button>
      }
    >
      {buka ? (
        <form
          className="border-border bg-card mb-6 grid gap-4 rounded-2xl border p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            tambahClient({
              perusahaan: String(f.get("perusahaan")),
              pic: String(f.get("pic")),
              jabatan: String(f.get("jabatan")),
              email: String(f.get("email")),
              whatsapp: String(f.get("whatsapp")),
              alamat: String(f.get("alamat")),
              industri: String(f.get("industri")),
              catatan: String(f.get("catatan")),
            })
            setBuka(false)
          }}
        >
          <h2 className="text-foreground text-sm font-semibold sm:col-span-2">
            Tambah Client
          </h2>
          {[
            { name: "perusahaan", label: "Nama Perusahaan" },
            { name: "pic", label: "Nama PIC" },
            { name: "jabatan", label: "Jabatan" },
            { name: "email", label: "Email", type: "email" },
            { name: "whatsapp", label: "WhatsApp" },
            { name: "industri", label: "Industri" },
            { name: "alamat", label: "Alamat" },
          ].map((f) => (
            <div key={f.name} className="space-y-2">
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input id={f.name} name={f.name} type={f.type ?? "text"} />
            </div>
          ))}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea id="catatan" name="catatan" rows={2} />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" size="sm">
              Simpan
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBuka(false)}
            >
              Batal
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.map((c) => {
          const proyek = projects.filter((p) => p.clientId === c.id)

          return (
            <div
              key={c.id}
              className="border-border bg-card rounded-2xl border p-5"
            >
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                {c.industri}
              </p>
              <Link
                href={`/crm/clients/${c.id}`}
                className="text-foreground hover:text-primary mt-1 block font-[family-name:var(--font-heading)] text-base font-semibold"
              >
                {c.perusahaan}
              </Link>
              <p className="text-muted-foreground mt-1 text-sm">
                {c.pic} · {c.jabatan}
              </p>
              <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                <span>{proyek.length} proyek</span>
                <span>{rupiah(proyek.reduce((a, p) => a + p.nilai, 0))}</span>
              </div>
              <p className="text-muted-foreground mt-2 text-[11px]">
                Klien sejak {tanggalID(c.tanggalGabung)}
              </p>
            </div>
          )
        })}
      </div>
    </CrmShell>
  )
}
