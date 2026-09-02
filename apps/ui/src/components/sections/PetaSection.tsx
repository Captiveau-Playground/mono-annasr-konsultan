import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { kotaProyek } from "@/data/perusahaan"

export function PetaSection() {
  return (
    <SectionShell tone="terang" judul={"Jejak An Nasr di\nBerbagai Wilayah"}>
      <Reveal className="relative w-full">
        <div className="border-border bg-surface relative overflow-hidden rounded-xl border">
          <Image
            src="/images/annasr/peta-indonesia.jpg"
            alt="Peta Indonesia dengan sebaran lokasi proyek CV. AN NASR KONSULTAN"
            width={1920}
            height={848}
            className="w-full object-cover"
          />
          {kotaProyek.map((k) => (
            <span
              key={k.nama}
              title={k.nama}
              style={{ top: k.atas, left: k.kiri }}
              className="bg-accent ring-accent/25 absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 sm:size-3"
            />
          ))}
        </div>
      </Reveal>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {kotaProyek.map((k) => (
          <li
            key={k.nama}
            className="text-muted-foreground flex items-center gap-1.5 text-[11px]"
          >
            <span className="bg-accent size-1.5 rounded-full" />
            {k.nama}
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
