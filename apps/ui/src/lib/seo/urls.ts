import { getEnvVar } from "@/lib/env-vars"

/**
 * Base URL publik tanpa trailing slash.
 * Fallback ke localhost saat dev & env belum diisi — mencegah runtime error
 * sebelum `APP_PUBLIC_URL` diset (di produksi wajib diisi).
 * Mengembalikan string kosong bila tidak tersedia (pemanggil harus guard).
 */
export function publicBaseUrl(): string {
  const dariEnv = getEnvVar("APP_PUBLIC_URL")?.replace(/\/$/, "")

  if (dariEnv) return dariEnv
  if (process.env.NODE_ENV === "development") return "http://localhost:3000"

  return ""
}
