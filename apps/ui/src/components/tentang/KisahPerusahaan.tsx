import { Reveal } from "@/components/site/Reveal"

const PERJALANAN_STATIS = [
  {
    tahun: "2014",
    judul: "Berdiri di Jombang",
    teks: "CV. AN NASR KONSULTAN didirikan dengan fokus pada jasa perencanaan dan pengawasan bangunan.",
  },
  {
    tahun: "2016",
    judul: "Ekspansi Layanan",
    teks: "Lini perizinan PBG & SLF dan pelaksanaan konstruksi mulai melengkapi layanan utama.",
  },
  {
    tahun: "2018",
    judul: "Proyek Pemerintah Daerah",
    teks: "Dipercaya instansi dan desa untuk pekerjaan jalan, jembatan, dan irigasi berskala daerah.",
  },
  {
    tahun: "2021",
    judul: "Jangkauan Luar Jawa",
    teks: "Cakupan proyek meluas ke kota-kota di luar Jawa Timur hingga wilayah Indonesia Timur.",
  },
  {
    tahun: "Hari Ini",
    judul: "Mitra Pembangunan yang Terpercaya",
    teks: "Melayani instansi, lembaga, dan mitra usaha dengan satu standar mutu di setiap proyek.",
  },
]

export function KisahPerusahaan({
  perjalanan = [],
}: {
  perjalanan?: { tahun: string; judul: string; teks: string }[]
}) {
  const PERJALANAN = perjalanan.length > 0 ? perjalanan : PERJALANAN_STATIS

  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 5/12 — cerita */}
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-24">
              <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                Perjalanan Kami
              </p>
              <h2 className="text-foreground mt-4 max-w-md text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
                Dari kantor kecil di Jombang, menuju pembangunan di banyak kota
              </h2>
              <p className="text-muted-foreground mt-6 max-w-[42rem] text-lg leading-8">
                Lebih dari satu dekade kami menumbuhkan kredibilitas lewat
                pekerjaan yang dapat dipertanggungjawabkan secara teknis dan
                moral — bukan sekadar jumlah proyek.
              </p>
            </Reveal>
          </div>

          {/* 7/12 — timeline */}
          <div className="lg:col-span-7">
            <ol className="border-border relative flex flex-col gap-10 border-l-2 pl-8">
              {PERJALANAN.map((tahap, i) => (
                <Reveal key={tahap.tahun} arah="right" delay={i * 0.05}>
                  <li className="relative">
                    <span className="bg-accent ring-surface absolute top-1.5 -left-[38px] size-3.5 rounded-full ring-4" />
                    <p className="text-accent text-sm font-bold">
                      {tahap.tahun}
                    </p>
                    <h3 className="text-foreground mt-1.5 text-xl font-semibold">
                      {tahap.judul}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-xl text-base leading-7">
                      {tahap.teks}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
