import { PetaMap } from "@/components/sections/PetaMap"
import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { kotaProyek } from "@/data/perusahaan"

export function PetaSection() {
  return (
    <SectionShell tone="terang" judul={"Jejak An Nasr di\nBerbagai Wilayah"}>
      <Reveal className="relative w-full">
        <PetaMap />
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
