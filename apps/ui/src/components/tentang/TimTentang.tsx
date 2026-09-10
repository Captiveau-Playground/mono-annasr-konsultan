import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"

function inisial(nama: string) {
  return nama
    .replace(/^(H\.\s+|Dr\.\s+|Ir\.\s+)/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0] ?? "")
    .join("")
    .toUpperCase()
}

function IkonLinkedin() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  )
}

const TIM_STATIS = [
  {
    nama: "H. Ahmad Nasrullah, S.T.",
    jabatan: "Founder & Direktur",
    inisial: "AN",
  },
  {
    nama: "Rizky Pratama, S.T.",
    jabatan: "Project Manager",
    inisial: "RP",
  },
  {
    nama: "Siti Maulida, S.T., M.T.",
    jabatan: "Structural Engineer",
    inisial: "SM",
  },
  {
    nama: "Bagus Setiawan",
    jabatan: "Site Inspector & Pengawas",
    inisial: "BS",
  },
]

type AnggotaTim = {
  nama: string
  jabatan: string
  foto?: string
  linkedin?: string
}

export function TimTentang({ tim = [] }: { tim?: AnggotaTim[] }) {
  const TIM: (AnggotaTim & { inisial: string })[] =
    tim.length > 0
      ? tim.map((t) => ({ ...t, inisial: inisial(t.nama) }))
      : TIM_STATIS

  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Tim Kami
          </p>
          <h2 className="text-foreground mt-4 text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
            Tenaga ahli yang bekerja di balik setiap proyek
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-8">
            Dari struktur, jalan, jembatan, hingga sumber daya air — setiap
            penugasan dipegang oleh profesional yang berpengalaman di lapangan.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIM.map((anggota, i) => (
            <Reveal key={anggota.nama} delay={i * 0.06} className="h-full">
              <div className="group border-border bg-card h-full rounded-[20px] border p-7 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                <div className="mx-auto size-20">
                  {anggota.foto?.trim() ? (
                    <Image
                      src={anggota.foto}
                      alt={anggota.nama}
                      width={160}
                      height={160}
                      sizes="80px"
                      className="bg-primary/8 size-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="bg-primary/8 text-primary group-hover:bg-primary/10 flex size-20 items-center justify-center rounded-full font-[family-name:var(--font-heading)] text-2xl font-bold">
                      {anggota.inisial}
                    </span>
                  )}
                </div>
                <h3 className="text-foreground mt-5 text-lg leading-snug font-semibold">
                  {anggota.nama}
                </h3>
                <p className="text-accent mt-1.5 text-sm font-medium">
                  {anggota.jabatan}
                </p>
                {anggota.linkedin?.trim() ? (
                  <a
                    href={anggota.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`LinkedIn ${anggota.nama}`}
                    className="text-muted-foreground hover:text-primary border-border mt-5 inline-flex size-9 items-center justify-center rounded-full border transition-colors"
                  >
                    <IkonLinkedin />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
