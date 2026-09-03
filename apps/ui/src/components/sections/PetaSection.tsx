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
    </SectionShell>
  )
}
