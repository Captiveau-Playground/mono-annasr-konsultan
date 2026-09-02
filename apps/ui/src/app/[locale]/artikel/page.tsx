import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ArtikelList } from "@/components/artikel/ArtikelList"
import { PageHero } from "@/components/site/PageHero"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Artikel — CV. AN NASR KONSULTAN"
const deskripsi =
  "Artikel dan wawasan seputar perencanaan, pengawasan, perizinan PBG & SLF, serta pelaksanaan konstruksi dari CV. AN NASR KONSULTAN Jombang."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <PageHero
        eyebrow="Artikel"
        judul="Wawasan Teknik & Konstruksi"
        teks="Catatan praktis dari pengalaman kami menangani pekerjaan perencanaan, pengawasan, perizinan, dan konstruksi."
      />

      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <ArtikelList />
        </div>
      </section>
    </>
  )
}
