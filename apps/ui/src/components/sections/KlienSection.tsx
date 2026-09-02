import { SectionShell } from "@/components/site/SectionShell"

const baris = [10, 10, 10]

function Frame() {
  return (
    <li
      aria-hidden
      className="border-border bg-card aspect-[3/2] w-40 shrink-0 rounded-lg border shadow-[var(--shadow-soft)] sm:w-48"
    />
  )
}

export function KlienSection() {
  return (
    <SectionShell tone="krem" judul={"Dipercaya oleh\nBerbagai Klien"}>
      <div className="marquee-mask space-y-5 overflow-hidden">
        {baris.map((jumlah, i) => (
          <ul
            key={i}
            className={`flex w-max items-center gap-5 ${
              i === 1
                ? "marquee-track-rev"
                : i === 2
                  ? "marquee-track-slow"
                  : "marquee-track"
            }`}
          >
            {Array.from({ length: jumlah * 2 }, (_, j) => (
              <Frame key={j} />
            ))}
          </ul>
        ))}
      </div>
    </SectionShell>
  )
}
