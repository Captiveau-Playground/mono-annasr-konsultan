import { describe, expect, it } from "vitest"

import {
  buildGtmNoScriptUrl,
  buildGtmSnippet,
  DEFAULT_GTM_ID,
  isValidGtmId,
} from "./gtm"

describe("isValidGtmId", () => {
  it("menerima format container GTM", () => {
    expect(isValidGtmId("GTM-TJPCCLSL")).toBe(true)
    expect(isValidGtmId("GTM-ABC123")).toBe(true)
  })

  it("menolak ID kosong, salah prefix, atau berisi markup", () => {
    expect(isValidGtmId("")).toBe(false)
    expect(isValidGtmId("G-ABC123")).toBe(false)
    expect(isValidGtmId("<script>alert(1)</script>")).toBe(false)
    expect(isValidGtmId("GTM-ABC');alert(1);//")).toBe(false)
  })
})

describe("buildGtmSnippet", () => {
  it("memuat container ID dan URL gtm.js", () => {
    const snippet = buildGtmSnippet("GTM-TJPCCLSL")

    expect(snippet).toContain("GTM-TJPCCLSL")
    expect(snippet).toContain("https://www.googletagmanager.com/gtm.js?id=")
    expect(snippet).toContain("'gtm.start'")
  })

  it("tidak mendefinisikan shim gtag() (itu milik gtag.js, bukan GTM)", () => {
    expect(buildGtmSnippet("GTM-TJPCCLSL")).not.toContain("function gtag()")
  })
})

describe("buildGtmNoScriptUrl", () => {
  it("menghasilkan URL iframe noscript", () => {
    expect(buildGtmNoScriptUrl("GTM-TJPCCLSL")).toBe(
      "https://www.googletagmanager.com/ns.html?id=GTM-TJPCCLSL"
    )
  })
})

describe("DEFAULT_GTM_ID", () => {
  it("valid, jadi tag tetap terpasang tanpa env", () => {
    expect(isValidGtmId(DEFAULT_GTM_ID)).toBe(true)
  })
})
