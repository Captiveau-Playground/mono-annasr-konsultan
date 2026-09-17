import { PetaMap } from "@/components/sections/PetaMap"
import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { kotaProyek } from "@/data/perusahaan"

type KotaProyek = { nama: string; lat: number; lng: number }

export function PetaSection({
  kota,
  judul,
  brand = "",
}: {
  kota?: KotaProyek[]
  /** Judul section — dari CMS tentang.jangkauanJudul. Fallback bila kosong. */
  judul?: string
  /** Brand untuk label peta — dari CMS situs.brandNama. */
  brand?: string
}) {
  return (
    <SectionShell
      tone="terang"
      judul={judul ?? "Jejak An Nasr di\nBerbagai Wilayah"}
    >
      <Reveal className="relative w-full">
        <PetaMap kota={kota ?? kotaProyek} brand={brand} />
      </Reveal>
    </SectionShell>
  )
}
