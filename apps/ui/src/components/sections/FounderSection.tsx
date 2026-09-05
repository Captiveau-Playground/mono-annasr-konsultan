import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { Button } from "@/components/ui/button"
import { founder } from "@/data/perusahaan"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"

export function FounderSection({
  founder: founderData,
}: {
  founder?: BerandaKonten["founder"]
}) {
  return (
    <SectionShell
      tone="krem"
      judul={"Tumbuh dari Pengalaman,\nBerkarya dengan Integritas"}
      aksi={
        <Button asChild size="pill">
          <Link href="/tentang">
            Lihat Profil An Nasr
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <Reveal arah="left" className="h-full">
          <Image
            src="/images/annasr/founder.jpg"
            alt={`${founder.nama}, ${founder.jabatan} CV. AN NASR KONSULTAN`}
            width={900}
            height={1100}
            className="h-full w-full rounded-xl object-cover"
          />
        </Reveal>

        <Reveal arah="right" delay={0.08} className="flex flex-col">
          <h3 className="text-foreground text-xl font-semibold tracking-wide uppercase">
            {founder.nama}
          </h3>
          <p className="text-accent mt-1 text-sm font-semibold">
            {founder.jabatan}
          </p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed lg:text-base">
            CV. An Nasr Konsultan hadir sebagai mitra independen yang melindungi
            kepentingan klien, memastikan proyek berjalan tepat waktu, tepat
            mutu, tepat biaya, serta memenuhi seluruh standar teknis dan
            perizinan yang berlaku.
          </p>

          <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
            <Image
              src="/images/annasr/tim-perusahaan.jpg"
              alt="Rapat koordinasi tim CV. AN NASR KONSULTAN di kantor"
              width={800}
              height={600}
              className="h-full max-h-56 w-full rounded-xl object-cover"
            />
            <Image
              src="/images/annasr/tim-engineer.jpg"
              alt="Tim teknik CV. AN NASR KONSULTAN di lokasi proyek"
              width={800}
              height={600}
              className="h-full max-h-56 w-full rounded-xl object-cover"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
