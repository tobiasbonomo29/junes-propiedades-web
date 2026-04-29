import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGallery } from "@/components/property-gallery"
import type { Property } from "@/lib/types"
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Car,
  Droplets,
  Trees,
  Shield,
  ArrowLeft,
  Phone,
  Mail,
  Star,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

function formatPrice(price: number, currency: string, operation: string) {
  const formatted = new Intl.NumberFormat("es-AR").format(price)
  return `${currency} ${formatted}${operation === "Alquiler" ? "/mes" : ""}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data } = await supabase
    .from("properties")
    .select("title, description, images")
    .eq("id", id)
    .single()

  if (!data) return { title: "Propiedad | Junes Propiedades" }

  return {
    title: `${data.title} | Junes Propiedades`,
    description: data.description ?? undefined,
    openGraph: {
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "Activa")
    .single()

  if (!property) notFound()

  const p = property as Property
  const price = formatPrice(p.price, p.currency, p.operation)
  const location = [p.neighborhood, p.city].filter(Boolean).join(", ")
  const waMessage = encodeURIComponent(
    `Hola! Me interesa la propiedad: ${p.title}. ¿Podría darme más información?`
  )

  const amenities = [
    { key: "garage", label: "Cochera", icon: Car, active: p.garage },
    { key: "pool", label: "Pileta", icon: Droplets, active: p.pool },
    { key: "garden", label: "Jardín", icon: Trees, active: p.garden },
    { key: "security", label: "Seguridad", icon: Shield, active: p.security },
  ]
  const activeAmenities = amenities.filter((a) => a.active)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumb + back */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/#propiedades" className="hover:text-primary transition-colors">
              Propiedades
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{p.title}</span>
          </div>
          <Link
            href="/#propiedades"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver a propiedades
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-24">
          {/* Property header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${
                    p.operation === "Venta"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground border border-primary"
                  }`}
                >
                  {p.operation}
                </span>
                <span className="px-3 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                  {p.type}
                </span>
                {p.featured && (
                  <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary" />
                    Destacada
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                {p.title}
              </h1>
              {location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{location}</span>
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-serif text-3xl md:text-4xl font-bold text-primary">{price}</p>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Gallery + Details */}
            <div className="lg:col-span-2 space-y-6">
              <PropertyGallery images={p.images} title={p.title} />

              {/* Key features */}
              {(p.bedrooms || p.bathrooms || p.total_area || p.covered_area) && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Características
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {p.bedrooms && (
                      <div className="text-center p-4 bg-muted rounded-xl">
                        <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{p.bedrooms}</p>
                        <p className="text-xs text-muted-foreground mt-1">Dormitorios</p>
                      </div>
                    )}
                    {p.bathrooms && (
                      <div className="text-center p-4 bg-muted rounded-xl">
                        <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{p.bathrooms}</p>
                        <p className="text-xs text-muted-foreground mt-1">Baños</p>
                      </div>
                    )}
                    {p.total_area && (
                      <div className="text-center p-4 bg-muted rounded-xl">
                        <Square className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{p.total_area}</p>
                        <p className="text-xs text-muted-foreground mt-1">m² Totales</p>
                      </div>
                    )}
                    {p.covered_area && (
                      <div className="text-center p-4 bg-muted rounded-xl">
                        <Square className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{p.covered_area}</p>
                        <p className="text-xs text-muted-foreground mt-1">m² Cubiertos</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {p.description && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {p.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {activeAmenities.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Comodidades
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeAmenities.map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Contact card */}
                <div className="bg-card rounded-xl border border-primary/30 p-6 shadow-[0_0_40px_rgba(0,194,122,0.08)]">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    ¿Te interesa esta propiedad?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Contactanos y te asesoramos sin compromiso.
                  </p>

                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/5491141593878?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,194,122,0.4)] transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                      Consultar por WhatsApp
                    </a>
                    <a
                      href={`mailto:silvanajunes@gmail.com?subject=${encodeURIComponent(`Consulta sobre: ${p.title}`)}`}
                      className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-transparent border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
                    >
                      <Mail className="w-5 h-5" />
                      Enviar Email
                    </a>
                  </div>
                </div>

                {/* Details summary */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                    Detalles
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-border pb-3">
                      <dt className="text-muted-foreground">Operación</dt>
                      <dd className="font-medium text-foreground">{p.operation}</dd>
                    </div>
                    <div className="flex justify-between text-sm border-b border-border pb-3">
                      <dt className="text-muted-foreground">Tipo</dt>
                      <dd className="font-medium text-foreground">{p.type}</dd>
                    </div>
                    {p.city && (
                      <div className="flex justify-between text-sm border-b border-border pb-3">
                        <dt className="text-muted-foreground">Ciudad</dt>
                        <dd className="font-medium text-foreground">{p.city}</dd>
                      </div>
                    )}
                    {p.neighborhood && (
                      <div className="flex justify-between text-sm border-b border-border pb-3">
                        <dt className="text-muted-foreground">Barrio</dt>
                        <dd className="font-medium text-foreground">{p.neighborhood}</dd>
                      </div>
                    )}
                    {p.total_area && (
                      <div className="flex justify-between text-sm border-b border-border pb-3">
                        <dt className="text-muted-foreground">Sup. Total</dt>
                        <dd className="font-medium text-foreground">{p.total_area} m²</dd>
                      </div>
                    )}
                    {p.covered_area && (
                      <div className="flex justify-between text-sm border-b border-border pb-3">
                        <dt className="text-muted-foreground">Sup. Cubierta</dt>
                        <dd className="font-medium text-foreground">{p.covered_area} m²</dd>
                      </div>
                    )}
                    {p.bedrooms && (
                      <div className="flex justify-between text-sm border-b border-border pb-3">
                        <dt className="text-muted-foreground">Dormitorios</dt>
                        <dd className="font-medium text-foreground">{p.bedrooms}</dd>
                      </div>
                    )}
                    {p.bathrooms && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Baños</dt>
                        <dd className="font-medium text-foreground">{p.bathrooms}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
