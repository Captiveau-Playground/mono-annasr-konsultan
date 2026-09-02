import { Inter, Poppins, Roboto } from "next/font/google"

/**
 * Kept for legacy screens that still import it — not applied in the layout.
 */
export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-roboto",
})

/**
 * An Nasr Blueprint fonts: Poppins for headings, Inter for body text.
 * The variables feed the blueprint tokens (--font-heading / --font-body)
 * defined in annasr-blueprint.css, so every page inherits the right face.
 */
export const fontHeading = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--annasr-heading",
  display: "swap",
})

export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--annasr-body",
  display: "swap",
})
