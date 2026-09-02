"use client"

import { CalendarDays } from "lucide-react"
import Image from "next/image"

import type { Artikel } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

export function ArtikelCard({ item }: { item: Artikel }) {
  return (
    <article className="group border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-[var(--shadow-soft)]">
      <Link href={`/artikel/${item.slug}`} className="block overflow-hidden">
        <Image
          src={item.gambar}
          alt={item.judul}
          width={1200}
          height={800}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-accent text-xs font-semibold tracking-[0.18em] uppercase">
          {item.kategori}
        </span>
        <Link
          href={`/artikel/${item.slug}`}
          className="hover:text-primary text-foreground mt-3 text-lg leading-snug transition-colors"
        >
          {item.judul}
        </Link>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {item.ringkas}
        </p>
        <p className="text-muted-foreground mt-auto flex items-center gap-2 pt-6 text-xs">
          <CalendarDays className="text-primary size-3.5" />
          {item.tanggal}
        </p>
      </div>
    </article>
  )
}
