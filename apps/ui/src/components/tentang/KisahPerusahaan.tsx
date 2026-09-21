import { Reveal } from "@/components/site/Reveal"

export function KisahPerusahaan({
  perjalanan = [],
  judul = "Dari kantor kecil di Jombang, menuju pembangunan di banyak kota",
  deskripsi = "Lebih dari satu dekade kami menumbuhkan kredibilitas lewat pekerjaan yang dapat dipertanggungjawabkan secara teknis dan moral.",
}: {
  perjalanan?: { tahun: string; judul: string; teks: string }[]
  /** Judul & paragraf pengantar section — dari CMS. */
  judul?: string
  deskripsi?: string
}) {
  // Semua milestone dihapus di CMS → section tidak dirender (bukan fallback
  // ke data statis), sehingga section bisa "dihapus" lewat CMS.
  if (perjalanan.length === 0) return null

  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 5/12 — cerita */}
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-24">
              <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                Perjalanan Kami
              </p>
              <h2 className="text-foreground mt-4 max-w-md text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
                {judul}
              </h2>
              <p className="text-muted-foreground mt-6 max-w-[42rem] text-lg leading-8">
                {deskripsi}
              </p>
            </Reveal>
          </div>

          {/* 7/12 — timeline */}
          <div className="lg:col-span-7">
            <ol className="border-border relative flex flex-col gap-10 border-l-2 pl-8">
              {perjalanan.map((tahap, i) => (
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
