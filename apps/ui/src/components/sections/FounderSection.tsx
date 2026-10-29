import { ArrowRight, Quote } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { Button } from "@/components/ui/button"
import { founder as founderStatis } from "@/data/perusahaan"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"

/**
 * Section founder — seluruh teks (nama, jabatan, paragraf, kutipan) dan foto
 * utama diambil dari CMS Beranda (`beranda.founder`), fallback ke data statis.
 * Foto pendukung tim (kantor & lapangan) sengaja tidak lagi ditampilkan di
 * beranda — permintaan klien: hanya satu foto founder.
 */
export function FounderSection({
  founder: founderData,
  judul = "Tumbuh dari Pengalaman,\nBerkarya dengan Integritas",
  eyebrow = "Tentang Kami",
  latar,
}: {
  founder?: BerandaKonten["founder"]
  /** Judul section — dari CMS situs.founderJudul. */
  judul?: string
  /** Label kecil di atas judul — dari CMS situs.founderEyebrow. */
  eyebrow?: string
  /** Gambar latar dekoratif (ornamen batik) — dipakai di beranda. */
  latar?: string
}) {
  const nama = founderData?.nama?.trim() || founderStatis.nama
  const jabatan = founderData?.jabatan?.trim() || founderStatis.jabatan
  const teks =
    founderData?.teks?.trim() ||
    "CV. An Nasr Konsultan hadir sebagai mitra independen yang melindungi kepentingan klien, memastikan proyek berjalan tepat waktu, tepat mutu, tepat biaya, serta memenuhi seluruh standar teknis dan perizinan yang berlaku."
  const kutipan =
    founderData?.kutipan?.trim() ||
    "Setiap pekerjaan harus dapat dipertanggungjawabkan secara teknis maupun moral."
  const foto = founderData?.foto?.trim() || "/images/annasr/founder.jpg"

  return (
    <SectionShell
      tone="krem"
      latar={latar}
      judul={judul}
      eyebrow={eyebrow}
      aksi={
        <Button asChild size="pill">
          <Link href="/tentang">
            Lihat Profil An Nasr
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <Reveal arah="left" className="h-full">
          <Image
            src={foto}
            alt={`${nama}, ${jabatan} CV. AN NASR KONSULTAN`}
            width={900}
            height={1100}
            className="h-full max-h-[560px] w-full rounded-xl object-cover lg:max-h-none"
          />
        </Reveal>

        <Reveal
          arah="right"
          delay={0.08}
          className="flex flex-col justify-center"
        >
          <h3 className="text-foreground text-xl font-semibold tracking-wide uppercase">
            {nama}
          </h3>
          <p className="text-accent mt-1 text-sm font-semibold">{jabatan}</p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed lg:text-base">
            {teks}
          </p>

          <figure className="border-border bg-primary/5 mt-6 rounded-xl border p-5">
            <Quote className="text-accent size-5" aria-hidden />
            <blockquote className="text-muted-foreground mt-2 text-sm leading-relaxed lg:text-base">
              &ldquo;{kutipan}&rdquo;
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </SectionShell>
  )
}
