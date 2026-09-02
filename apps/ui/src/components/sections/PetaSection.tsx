import { PetaMap } from "@/components/sections/PetaMap"
import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { kotaProyek } from "@/data/perusahaan"
import type { BerandaKonten } from "@/lib/annasr/beranda"

export function PetaSection({ kota }: { kota?: BerandaKonten["kotaProyek"] }) {
  return (
    <SectionShell tone="terang" judul={"Jejak An Nasr di\nBerbagai Wilayah"}>
      <Reveal className="relative w-full">
        <PetaMap kota={kota ?? kotaProyek} />
      </Reveal>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {(kota ?? kotaProyek).map((k) => (
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
