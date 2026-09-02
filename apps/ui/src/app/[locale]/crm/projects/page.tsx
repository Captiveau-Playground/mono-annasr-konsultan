"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { CrmShell, Lencana } from "@/components/crm/CrmShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  daftarPic,
  rupiah,
  statusProyek,
  tanggalID,
  type StatusProyek,
} from "@/data/crm"
import { layanan } from "@/data/perusahaan"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function HalamanProjects() {
  const { projects, clients, tambahProject } = useCrm()
  const [buka, setBuka] = useState(false)
  const [filter, setFilter] = useState<"Semua" | StatusProyek>("Semua")

  const hasil = projects.filter(
    (p) => filter === "Semua" || p.status === filter
  )
  const namaClient = (id: string) =>
    clients.find((c) => c.id === id)?.perusahaan ?? "-"

  return (
    <CrmShell
      judul="Projects"
      deskripsi="Pekerjaan yang sedang direncanakan, berjalan, dan selesai"
      aksi={
        <Button size="sm" onClick={() => setBuka((v) => !v)}>
          <Plus className="size-4" /> Project Baru
        </Button>
      }
    >
      {buka ? (
        <form
          className="border-border bg-card mb-6 grid gap-4 rounded-2xl border p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            tambahProject({
              nama: String(f.get("nama")),
              clientId: String(f.get("clientId")),
              pic: String(f.get("pic")),
              layanan: String(f.get("layanan")),
              lokasi: String(f.get("lokasi")),
              nilai: Number(f.get("nilai") || 0),
              mulai: String(f.get("mulai")),
              target: String(f.get("target")),
              status: String(f.get("status")) as StatusProyek,
              progress: Number(f.get("progress") || 0),
              catatan: String(f.get("catatan")),
            })
            setBuka(false)
          }}
        >
          <h2 className="text-foreground text-sm font-semibold sm:col-span-2">
            Tambah Project
          </h2>
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Proyek</Label>
            <Input id="nama" name="nama" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <select
              id="clientId"
              name="clientId"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.perusahaan}
                </option>
              ))}
            </select>
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
            <Label htmlFor="layanan">Jenis Layanan</Label>
            <select
              id="layanan"
              name="layanan"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              {layanan.map((l) => (
                <option key={l.slug}>{l.nama}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lokasi">Lokasi</Label>
            <Input id="lokasi" name="lokasi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nilai">Nilai Proyek (Rp)</Label>
            <Input id="nilai" name="nilai" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mulai">Tanggal Mulai</Label>
            <Input id="mulai" name="mulai" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target Selesai</Label>
            <Input id="target" name="target" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              {statusProyek.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min={0}
              max={100}
            />
          </div>
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

      <div className="mb-5 flex flex-wrap gap-2">
        {(["Semua", ...statusProyek] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground border"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {hasil.map((p) => (
          <div
            key={p.id}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/crm/projects/${p.id}`}
                className="text-foreground hover:text-primary font-[family-name:var(--font-heading)] text-base font-semibold"
              >
                {p.nama}
              </Link>
              <Lencana status={p.status} />
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {namaClient(p.clientId)} · {p.lokasi}
            </p>
            <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
              <span>{rupiah(p.nilai)}</span>
              <span>Target {tanggalID(p.target)}</span>
            </div>
            <div className="bg-surface mt-3 h-2 rounded-full">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-1 text-right text-[11px]">
              {p.progress}%
            </p>
          </div>
        ))}
      </div>
    </CrmShell>
  )
}
