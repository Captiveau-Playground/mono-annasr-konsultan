import { notFound } from "next/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

/**
 * Unknown paths under a locale land here. The An Nasr Blueprint owns the UI
 * now, so there is no Strapi page lookup — everything unknown is a 404
 * rendered by `[locale]/not-found.tsx`.
 */
export default function UnknownPath() {
  notFound()
}
