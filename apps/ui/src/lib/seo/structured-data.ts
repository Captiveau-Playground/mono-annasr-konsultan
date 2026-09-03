type LdObject = Record<string, unknown>

/** Konversi "Senin – Sabtu, 08.00 – 17.00 WIB" → days/opens/closes untuk schema.org. */
function parseJamOperasional(
  raw?: string
): Record<string, string>[] | undefined {
  if (!raw) return undefined

  const m = raw.match(
    /\b([A-Za-z]+)\s*[-–—]\s*([A-Za-z]+),\s*(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})\b/
  )
  if (!m) return undefined

  const namaHari: Record<string, string> = {
    Senin: "Mo",
    Selasa: "Tu",
    Rabu: "We",
    Kamis: "Th",
    Jumat: "Fr",
    Sabtu: "Sa",
    Minggu: "Su",
  }
  const dari = namaHari[m[1] ?? ""]
  const sampai = namaHari[m[2] ?? ""]
  if (!dari || !sampai) return undefined

  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [dari, sampai].join(","),
      opens: `${(m[3] ?? "0").padStart(2, "0")}:${m[4] ?? "00"}:00`,
      closes: `${(m[5] ?? "0").padStart(2, "0")}:${m[6] ?? "00"}:00`,
    },
  ]
}

export type SitusInfo = {
  brandNama?: string
  brandTagline?: string
}
export type KontakInfo = {
  domisili?: string
  kantor?: string
  telepon?: string
  email?: string
  jamOperasional?: string
}

/**
 * Profil usaha lokal — tipe `ProfessionalService` (subtipe LocalBusiness).
 * Ini kunci SEO lokal "konsultan teknik/konstruksi di Jombang/Indonesia".
 */
export function localBusinessLd({
  url,
  situs,
  kontak,
  image,
}: {
  url: string
  situs: SitusInfo
  kontak: KontakInfo
  image?: string
}): LdObject {
  const nama = situs.brandNama || "CV. An Nasr Konsultan"
  const tagline = situs.brandTagline || "Konsultan Teknik & Konstruksi"
  const alamat =
    kontak.domisili?.trim() ||
    kontak.kantor?.trim() ||
    "Kabupaten Jombang, Jawa Timur"

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url.replace(/\/$/, "")}/#organization`,
    name: nama,
    alternateName: tagline,
    url,
    logo: image ? { "@type": "ImageObject", url: image } : undefined,
    image: image ? { "@type": "ImageObject", url: image } : undefined,
    ...(kontak.telepon && { telephone: kontak.telepon }),
    ...(kontak.email && { email: kontak.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: alamat,
      addressLocality: "Jombang",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.5454,
      longitude: 112.2424,
    },
    ...(parseJamOperasional(kontak.jamOperasional) && {
      openingHoursSpecification: parseJamOperasional(kontak.jamOperasional),
    }),
    areaServed: { "@type": "Country", name: "Indonesia" },
    priceRange: "Rp",
  }
}

export function websiteLd(url: string): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url.replace(/\/$/, "")}/#website`,
    url,
    name: "CV. An Nasr Konsultan",
    inLanguage: ["id-ID"],
  }
}

export function breadcrumbLd({
  url,
  items,
}: {
  url: string
  items: { name: string; path: string }[]
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const itemUrlObj = new URL(item.path, url)
      const itemUrl = itemUrlObj.href

      return {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: itemUrl,
      }
    }),
  }
}

/** Daftar layanan (untuk halaman /layanan). */
export function serviceListLd({
  url,
  layanan,
}: {
  url: string
  layanan: { nama: string; ringkas: string; slug: string }[]
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: layanan.map((l, i) => {
      const layananUrlObj = new URL(`/layanan/${l.slug}`, url)
      const layananUrl = layananUrlObj.href

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: l.nama,
          description: l.ringkas,
          serviceType: l.nama,
          provider: { "@id": `${url.replace(/\/$/, "")}/#organization` },
          url: layananUrl,
        },
      }
    }),
  }
}

export function faqLd(
  faqs: { tanya: string; jawab: string }[]
): LdObject | null {
  if (faqs.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.tanya,
      acceptedAnswer: { "@type": "Answer", text: f.jawab },
    })),
  }
}

export function articleLd({
  url,
  judul,
  ringkas,
  tanggal,
  kategori,
}: {
  url: string
  judul: string
  ringkas: string
  tanggal?: string
  kategori?: string
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: judul,
    description: ringkas,
    ...(kategori && { articleSection: kategori }),
    ...(tanggal && { datePublished: tanggal }),
    author: {
      "@type": "Organization",
      name: "CV. AN NASR KONSULTAN",
    },
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "CV. An Nasr Konsultan",
      url,
    },
  }
}

export function contactPageLd({
  url,
  situs,
  kontak,
}: {
  url: string
  situs: SitusInfo
  kontak: KontakInfo
}): LdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontak — CV. An Nasr Konsultan",
    url,
    about: localBusinessLd({
      url,
      situs,
      kontak,
    }),
  }
}
