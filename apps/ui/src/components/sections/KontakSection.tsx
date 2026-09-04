"use client"

import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { layanan, perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { simpanLeadPublik } from "@/lib/crm/crm-store"

type FormPesan = {
  nama: string
  hp: string
  email: string
  jenisLayanan: string
  pesan: string
}

export function KontakSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormPesan>({
    defaultValues: { jenisLayanan: layanan[0]?.nama ?? "Lainnya" },
  })

  const onSubmit = handleSubmit(async (data) => {
    const teks = `Halo ${perusahaan.nama}, saya ${data.nama}.%0A%0AJenis layanan: ${data.jenisLayanan}%0ANo. HP: ${data.hp}%0AEmail: ${data.email}%0A%0A${data.pesan}`
    window.open(`https://wa.me/${perusahaan.whatsapp}?text=${teks}`, "_blank")
    toast.success("Pesan Anda siap dikirim melalui WhatsApp.")
    simpanLeadPublik({
      nama: data.nama,
      perusahaan: "",
      email: data.email,
      whatsapp: data.hp,
      layanan: data.jenisLayanan,
      kebutuhan: data.pesan,
    })
    trackEvent(ANALYTICS_EVENTS.formSubmitted, {
      form: "kontak",
      layanan: data.jenisLayanan,
    })
    trackEvent(ANALYTICS_EVENTS.contactChannel, {
      channel: "whatsapp",
      location: "form_kontak",
    })
    reset()
  })

  return (
    <section className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal arah="left">
          <div className="border-border bg-card rounded-[2rem] border p-8 shadow-[var(--shadow-soft)] lg:p-10">
            <h2 className="text-foreground text-2xl">Kirim Pesan</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Isi formulir berikut, tim kami akan menghubungi Anda pada jam
              kerja.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  placeholder="Nama lengkap Anda"
                  {...register("nama", { required: "Nama wajib diisi" })}
                />
                {errors.nama ? (
                  <p className="text-destructive text-xs">
                    {errors.nama.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hp">Nomor HP</Label>
                  <Input
                    id="hp"
                    inputMode="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register("hp", { required: "Nomor HP wajib diisi" })}
                  />
                  {errors.hp ? (
                    <p className="text-destructive text-xs">
                      {errors.hp.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    {...register("email", { required: "Email wajib diisi" })}
                  />
                  {errors.email ? (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisLayanan">Jenis Layanan</Label>
                <select
                  id="jenisLayanan"
                  className="border-input text-foreground focus-visible:ring-ring h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                  {...register("jenisLayanan", { required: true })}
                >
                  {layanan.map((l) => (
                    <option key={l.slug} value={l.nama}>
                      {l.nama}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan</Label>
                <Textarea
                  id="pesan"
                  rows={5}
                  placeholder="Ceritakan kebutuhan proyek Anda"
                  {...register("pesan", { required: "Pesan wajib diisi" })}
                />
                {errors.pesan ? (
                  <p className="text-destructive text-xs">
                    {errors.pesan.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                size="pill"
                className="w-full"
                disabled={isSubmitting}
              >
                Kirim Pesan
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </Reveal>

        <Reveal arah="right" className="space-y-6">
          <div className="border-border bg-surface rounded-[2rem] border p-8 lg:p-10">
            <h2 className="text-foreground text-2xl">Informasi Kontak</h2>
            <ul className="mt-8 space-y-7">
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    Domisili Perusahaan
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                    {perusahaan.domisili}
                  </span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    Alamat Kantor
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                    {perusahaan.kantor}
                  </span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    Telepon
                  </span>
                  <a
                    href={`tel:${perusahaan.telepon}`}
                    onClick={() =>
                      trackEvent(ANALYTICS_EVENTS.contactChannel, {
                        channel: "phone",
                        location: "kontak_page",
                      })
                    }
                    className="text-muted-foreground hover:text-primary mt-1 block text-sm transition-colors"
                  >
                    {perusahaan.telepon}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Mail className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    Email
                  </span>
                  <a
                    href={`mailto:${perusahaan.email}`}
                    onClick={() =>
                      trackEvent(ANALYTICS_EVENTS.contactChannel, {
                        channel: "email",
                        location: "kontak_page",
                      })
                    }
                    className="text-muted-foreground hover:text-primary mt-1 block text-sm transition-colors"
                  >
                    {perusahaan.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <MessageCircle className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${perusahaan.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent(ANALYTICS_EVENTS.contactChannel, {
                        channel: "whatsapp",
                        location: "kontak_page",
                      })
                    }
                    className="text-muted-foreground hover:text-primary mt-1 block text-sm transition-colors"
                  >
                    +{perusahaan.whatsapp}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary/8 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Clock className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="text-foreground block text-sm font-semibold">
                    Jam Operasional
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm">
                    {perusahaan.jamOperasional}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="border-border overflow-hidden rounded-[2rem] border">
            <iframe
              title="Peta lokasi kantor CV. AN NASR KONSULTAN"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.3881674058966!2d112.24281717614731!3d-7.532573074348289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7815867acfbd3b%3A0x6538e8e0e6f9e8a7!2sCV.%20AN%20NASR%20KONSULTAN!5e0!3m2!1sen!2sid!4v1788529309004!5m2!1sen!2sid"
              allowFullScreen
              loading="lazy"
              className="h-72 w-full border-0"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
