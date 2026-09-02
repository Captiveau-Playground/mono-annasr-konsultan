import "@/styles/globals.css"

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type React from "react"

import { ClientProviders } from "@/components/providers/ClientProviders"
import { Footer } from "@/components/site/Footer"
import { Navbar } from "@/components/site/Navbar"
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { Toaster } from "@/components/ui/sonner"
import { fontBody, fontHeading } from "@/lib/fonts"
import { isValidLocale, routing } from "@/lib/navigation"
import { cn } from "@/lib/styles"

export function generateStaticParams() {
  const locales = routing.locales.map((locale) => ({ locale }))

  return locales
}

export const metadata: Metadata = {
  title: {
    default: "CV. AN NASR KONSULTAN — Konsultan Teknik Sipil Jombang",
    template: "%s",
  },
  description:
    "Jasa perencanaan, pengawasan, perizinan, dan konstruksi di Kabupaten Jombang, Jawa Timur.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
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
        <NextIntlClientProvider locale={locale}>
          <ClientProviders>
            <ScrollToTop />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <Toaster position="top-center" />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
