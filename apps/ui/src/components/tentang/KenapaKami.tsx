import { Building2, Handshake, MapPin, ShieldCheck } from "lucide-react"

import { Reveal } from "@/components/site/Reveal"

const ALASAN = [
  {
    ikon: Building2,
    judul: "Perencanaan hingga Konstruksi",
    teks: "Empat lini layanan dalam satu koordinasi, dari desain sampai serah terima.",
  },
  {
    ikon: ShieldCheck,
    judul: "Tenaga Ahli Bersertifikat",
    teks: "Pekerjaan ditangani tenaga teknis dengan pengalaman struktur dan infrastruktur.",
  },
  {
    ikon: MapPin,
    judul: "Jangkauan Luas",
    teks: "Berbasis di Jombang, proyek kami tersebar di berbagai kota di Indonesia.",
  },
  {
    ikon: Handshake,
    judul: "Transparan & Tepat Waktu",
    teks: "Laporan berkala yang jelas, progres terdokumentasi, dan komitmen waktu.",
  },
]

export function KenapaKami() {
  return (
    <section className="bg-background py-[72px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Keunggulan
          </p>
          <h2 className="text-foreground mt-4 text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
            Mengapa Memilih An Nasr Konsultan
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ALASAN.map((item, i) => {
            const Ikon = item.ikon

            return (
              <Reveal key={item.judul} delay={i * 0.05} className="h-full">
                <div
                  className={[
                    "h-full rounded-[20px] p-7 transition-all duration-200 hover:-translate-y-1.5",
                    i % 2 === 1
                      ? "bg-primary text-primary-foreground hover:shadow-[0_24px_50px_rgba(26,35,82,0.35)]"
                      : "border-border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-12 items-center justify-center rounded-xl",
                      i % 2 === 1
                        ? "bg-primary-foreground/10 text-accent"
                        : "bg-primary/8 text-primary",
                    ].join(" ")}
                  >
                    <Ikon className="size-6" strokeWidth={1.6} />
                  </span>
                  <h3
                    className={[
                      "mt-5 text-lg leading-snug font-semibold",
                      i % 2 === 1
                        ? "text-primary-foreground"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {item.judul}
                  </h3>
                  <p
                    className={[
                      "mt-3 text-sm leading-7",
                      i % 2 === 1
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.teks}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
