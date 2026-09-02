"use client"

import { Compass, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCrm } from "@/lib/crm/crm-store"
import { Link } from "@/lib/navigation"

export default function LoginCrm() {
  const { login, user, siap } = useCrm()
  const router = useRouter()
  const [email, setEmail] = useState("admin@annasrkonsultan.id")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (siap && user) router.replace("/crm")
  }, [siap, user, router])

  return (
    <div className="bg-surface flex min-h-screen items-center justify-center px-5 py-16">
      <div className="border-border bg-card w-full max-w-md rounded-[2rem] border p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <Compass className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-foreground font-[family-name:var(--font-heading)] text-sm font-semibold">
              CRM Internal
            </p>
            <p className="text-muted-foreground text-xs">
              CV. An Nasr Konsultan
            </p>
          </div>
        </div>

        <h1 className="text-foreground mt-8 text-2xl">Masuk Area Internal</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Halaman ini hanya untuk tim internal perusahaan.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            const hasil = login(email, password)
            if (!hasil.ok) {
              setError(hasil.pesan ?? "Gagal masuk.")

              return
            }
            setError(null)
            router.replace("/crm")
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error ? <p className="text-destructive text-xs">{error}</p> : null}
          <Button type="submit" size="pill" className="w-full">
            <Lock className="size-4" /> Masuk
          </Button>
        </form>

        <div className="bg-surface text-muted-foreground mt-6 rounded-2xl p-4 text-xs">
          <p className="text-foreground font-semibold">Akun demo</p>
          <p className="mt-1">admin@annasrkonsultan.id / annasr123</p>
          <p>marketing@annasrkonsultan.id / annasr123</p>
        </div>

        <Link
          href="/"
          className="text-muted-foreground mt-6 block text-center text-xs underline"
        >
          Kembali ke Company Profile
        </Link>
      </div>
    </div>
  )
}
