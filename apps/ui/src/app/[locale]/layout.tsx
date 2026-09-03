import "@/styles/globals.css"

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type React from "react"

import { Analytics } from "@/components/analytics/Analytics"
import { ClientProviders } from "@/components/providers/ClientProviders"
import { Footer } from "@/components/site/Footer"
import { Navbar } from "@/components/site/Navbar"
import { SmoothScroll } from "@/components/site/SmoothScroll"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { Toaster } from "@/components/ui/sonner"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { fontBody, fontHeading } from "@/lib/fonts"
import { isValidLocale, routing } from "@/lib/navigation"
import { publicBaseUrl } from "@/lib/seo/urls"
import { fetchFooter } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

export function generateStaticParams() {
  const locales = routing.locales.map((locale) => ({ locale }))

  return locales
}

/**
 * Judul tab & deskripsi SEO dari CMS (situs.brandNama / brandTagline),
 * fallback ke nilai statis bila Strapi kosong / gagal.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const kontenSitus = await fetchKontenSitus(locale)
  const brand = kontenSitus.situs.brandNama || "CV. AN NASR KONSULTAN"
  const tagline =
    kontenSitus.situs.brandTagline ||
    "Konsultan Teknik Sipil & Konstruksi Jombang"

  const baseUrl = publicBaseUrl()
  const deskripsi =
    "Jasa perencanaan, pengawasan, perizinan, dan konstruksi di Kabupaten Jombang, Jawa Timur."
  const ogImage = `${baseUrl.replace(/\/$/, "")}/images/annasr/hero-konstruksi.jpg`

  return {
    ...(baseUrl && { metadataBase: new URL(baseUrl) }),
    title: {
      default: `${brand} — ${tagline}`,
      template: "%s",
    },
    description: deskripsi,
    applicationName: brand,
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
    },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "id_ID",
      url: baseUrl,
      siteName: brand,
      title: `${brand} — ${tagline}`,
      description: deskripsi,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: brand,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand} — ${tagline}`,
      description: deskripsi,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
    },
  }
}

type ItemNavCms = { label: string; href: string }

/** Flat-kan navigasi utk footer: item tanpa anak + anak dari grup. */
function flattenNavigasi(nav: ItemNavCms[]): ItemNavCms[] {
  const hasil: ItemNavCms[] = []
  for (const item of nav) {
    if ("anak" in item && Array.isArray((item as { anak?: unknown }).anak)) {
      for (const a of (item as { anak: ItemNavCms[] }).anak) hasil.push(a)
    } else {
      hasil.push(item)
    }
  }

  return hasil
}

type LinkCms = {
  label?: string
  type?: string
  href?: string
  page?: null | { fullPath?: string }
}

/** Resolve href dari utilities.link (external vs relasi page). */
function resolveHrefCms(link?: LinkCms | null): string {
  if (!link) return "/"
  if (link.type === "page") return link.page?.fullPath ?? "/"

  return link.href ?? "/"
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }
  // Enable static rendering
  setRequestLocale(locale)

  const [kontenSitus, footerRaw] = await Promise.all([
    fetchKontenSitus(locale),
    fetchFooter(locale),
  ])

  const footerData = (
    footerRaw as {
      data?: {
        sections?: {
          title?: string
          links?: { label?: string; link?: LinkCms }[]
        }[]
        copyRight?: string
      }
    }
  )?.data
  const footerSections =
    (footerData?.sections ?? [])
      .filter((k) => typeof k.title === "string" && k.title.trim())
      .map((k) => ({
        title: k.title as string,
        links: (k.links ?? [])
          .map((l) => ({
            label: l.label ?? "",
            href: resolveHrefCms(l as LinkCms),
          }))
          .filter((l) => l.label),
      })) ?? []

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen antialiased",
          fontHeading.variable,
          fontBody.variable
        )}
        style={
          {
            "--font-heading":
              "var(--annasr-heading), 'Poppins', ui-sans-serif, system-ui, sans-serif",
            "--font-body":
              "var(--annasr-body), 'Inter', ui-sans-serif, system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        <Analytics />
        <NextIntlClientProvider locale={locale}>
          <ClientProviders>
            <SmoothScroll />
            <Navbar
              brandNama={kontenSitus.situs.brandNama}
              navigasiCms={kontenSitus.situs.navigasi}
              tagline={kontenSitus.situs.brandTagline}
              whatsapp={kontenSitus.kontak.whatsapp}
            />
            <main className="min-h-screen">{children}</main>
            <Footer
              brand={kontenSitus.situs.brandNama}
              navigasi={flattenNavigasi(kontenSitus.situs.navigasi)}
              layananCms={kontenSitus.layanan.map(
                (l: { nama: string; slug: string }) => ({
                  label: l.nama,
                  href: `/layanan/${l.slug}`,
                })
              )}
              sections={footerSections}
              copyRight={footerData?.copyRight}
              jam={kontenSitus.kontak.jamOperasional}
              kantor={kontenSitus.kontak.kantor}
              telepon={kontenSitus.kontak.telepon}
              email={kontenSitus.kontak.email}
              instagram={kontenSitus.kontak.instagram}
              whatsapp={kontenSitus.kontak.whatsapp}
            />
            <WhatsAppFloat />
            <Toaster position="top-center" />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
