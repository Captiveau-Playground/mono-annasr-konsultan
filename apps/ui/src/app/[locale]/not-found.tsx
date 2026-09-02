import { Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/navigation"

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
          <Compass className="size-7" strokeWidth={1.6} />
        </span>
        <h1 className="text-foreground mt-8 text-7xl font-bold tracking-tight">
          404
        </h1>
        <h2 className="text-foreground mt-4 text-xl font-semibold">
          Halaman tidak ditemukan
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Button asChild size="pill" className="mt-8">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  )
}
