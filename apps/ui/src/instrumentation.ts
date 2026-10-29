import { initializeTelemetry } from "@/lib/telemetry"

export async function register() {
  const runtime = process.env.NEXT_RUNTIME

  if (runtime === "nodejs" || runtime === "edge") {
    await initializeTelemetry(runtime)
  }
}
