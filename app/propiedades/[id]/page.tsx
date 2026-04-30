import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Car,
  Check,
  Droplets,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Square,
  Star,
  Trees,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"

function formatPrice(price: number, currency: string, operation: string) {
  const formatted = new Intl.NumberFormat("es-AR").format(price)
  return `${currency} ${formatted}${operation === "Alquiler" ? "/mes" : ""}`
}

function formatMeasure(value: number | null, suffix = "m²") {
  if (!value) return null
  return `${new Intl.NumberFormat("es-AR").format(value)} ${suffix}`
}

function propertyLocation(property: Pick<Property, "neighborhood" | "city">) {
  return [property.neighborhood, property.city].filter(Boolean).join(", ")
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value === null || value === undefined || value === "") return null

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border/70 py-3 text-sm last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[180px] text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string | number | null
}) {
  if (value === null || value === undefined || value === "") return null

  return (
    <div className="flex min-h-24 items-center gap-4 rounded-lg border border-border bg-muted/35 p-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border pt-7">
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      )}
      <h2 className="font-serif text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
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
    .select("title, description, images, city, neighborhood, operation, type, price, currency")
    .eq("id", id)
    .single()

  if (!data) return { title: "Propiedad | Junes Propiedades" }

  const title = `${data.title} | ${SITE_NAME}`
  const description =
    data.description ||
    `${data.type} en ${data.operation.toLowerCase()} en ${[data.neighborhood, data.city]
      .filter(Boolean)
      .join(", ")}. Consultá con ${SITE_NAME}.`
  const image = data.images?.[0] ?? "/junes-logo.png"

  return {
    title,
    description,
    alternates: {
      canonical: `/propiedades/${id}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/propiedades/${id}`,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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

  const { data: relatedProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "Activa")
    .neq("id", id)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3)

  const p = property as Property
  const price = formatPrice(p.price, p.currency, p.operation)
  const location = propertyLocation(p)
  const mapAddress = p.exact_address || location || p.city || p.title
  const mapQuery = encodeURIComponent(mapAddress)
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

  const featureSummary = [
    p.bedrooms ? `${p.bedrooms} dormitorio${p.bedrooms === 1 ? "" : "s"}` : null,
    p.bathrooms ? `${p.bathrooms} baño${p.bathrooms === 1 ? "" : "s"}` : null,
    formatMeasure(p.total_area),
  ].filter(Boolean)
  const propertyUrl = `${SITE_URL}/propiedades/${p.id}`
  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    url: propertyUrl,
    image: p.images?.length ? p.images : [`${SITE_URL}/junes-logo.png`],
    description: p.description,
    datePosted: p.created_at,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability: "https://schema.org/InStock",
      url: propertyUrl,
      businessFunction:
        p.operation === "Venta"
          ? "https://schema.org/Sell"
          : "https://schema.org/LeaseOut",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: p.city,
      streetAddress: p.exact_address || undefined,
      addressRegion: p.neighborhood || undefined,
      addressCountry: "AR",
    },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Propiedades",
        item: `${SITE_URL}/propiedades`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.title,
        item: propertyUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([propertyJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 pb-24">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/#propiedades" className="hover:text-primary transition-colors">
                Propiedades
              </Link>
              <span>/</span>
              <span className="max-w-[240px] truncate text-foreground">{p.title}</span>
            </div>
            <Link
              href="/#propiedades"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a propiedades
            </Link>
          </div>

          <header className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                  {p.operation}
                </span>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {p.type}
                </span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary" />
                    Destacada
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                {p.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground">
                {location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location}
                  </span>
                )}
                {featureSummary.length > 0 && (
                  <span className="text-sm">{featureSummary.join(" · ")}</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-card p-5 shadow-[0_0_40px_rgba(0,194,122,0.08)]">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Valor</p>
              <p className="mt-2 font-serif text-4xl font-bold text-primary">{price}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Consultanos para coordinar una visita o recibir más información.
              </p>
            </div>
          </header>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-12">
              <PropertyGallery images={p.images} title={p.title} />

              <Section eyebrow="Ficha" title="Información básica">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoTile icon={Home} label="Operación" value={p.operation} />
                  <InfoTile icon={Building2} label="Tipo" value={p.type} />
                  <InfoTile icon={MapPin} label="Ubicación" value={location || p.city} />
                  <InfoTile icon={Sparkles} label="Estado" value={p.status} />
                  <InfoTile icon={MapPin} label="Dirección" value={p.exact_address} />
                </div>
              </Section>

              <Section eyebrow="Espacios" title="Superficies y medidas">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoTile icon={Bed} label="Dormitorios" value={p.bedrooms} />
                  <InfoTile icon={Bath} label="Baños" value={p.bathrooms} />
                  <InfoTile icon={Square} label="Sup. total" value={formatMeasure(p.total_area)} />
                  <InfoTile
                    icon={Square}
                    label="Sup. cubierta"
                    value={formatMeasure(p.covered_area)}
                  />
                </div>
              </Section>

              {p.description && (
                <Section eyebrow="Detalle" title="Descripción">
                  <div className="max-w-3xl space-y-4 text-base leading-8 text-muted-foreground">
                    {p.description.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </Section>
              )}

              {activeAmenities.length > 0 && (
                <Section eyebrow="Confort" title="Comodidades">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {activeAmenities.map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4 text-foreground"
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section eyebrow="Zona" title="Ubicación">
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="relative aspect-[16/9] min-h-72 bg-muted">
                    <iframe
                      src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                      title={`Mapa de ${p.title}`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0 grayscale-[20%] invert-0"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/45 to-transparent" />
                  </div>
                  <div className="flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{mapAddress}</p>
                      {p.exact_address && location && (
                        <p className="mt-1 text-sm text-muted-foreground">{location}</p>
                      )}
                    </div>
                    <Button
                      asChild
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </Section>

              {relatedProperties && relatedProperties.length > 0 && (
                <Section eyebrow="Más opciones" title="También te puede interesar">
                  <div className="grid gap-6 md:grid-cols-3">
                    {(relatedProperties as Property[]).map((related) => (
                      <PropertyCard
                        key={related.id}
                        image={
                          related.images?.[0] ??
                          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                        }
                        price={formatPrice(related.price, related.currency, related.operation)}
                        title={related.title}
                        location={propertyLocation(related)}
                        type={related.type}
                        bedrooms={related.bedrooms ?? undefined}
                        bathrooms={related.bathrooms ?? undefined}
                        area={related.total_area ?? undefined}
                        operation={related.operation}
                        href={`/propiedades/${related.id}`}
                      />
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-5">
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="mb-4 text-xs uppercase tracking-[0.28em] text-primary">
                    Detalles de la propiedad
                  </p>
                  <dl>
                    <DetailRow label="Tipo de propiedad" value={p.type} />
                    <DetailRow label="Operación" value={p.operation} />
                    <DetailRow label="Precio" value={price} />
                    <DetailRow label="Ubicación" value={location || p.city} />
                    <DetailRow label="Dirección" value={p.exact_address} />
                    <DetailRow label="Superficie total" value={formatMeasure(p.total_area)} />
                    <DetailRow label="Superficie cubierta" value={formatMeasure(p.covered_area)} />
                    <DetailRow label="Dormitorios" value={p.bedrooms} />
                    <DetailRow label="Baños" value={p.bathrooms} />
                  </dl>
                </div>

                <div className="rounded-lg border border-primary/30 bg-card p-6 shadow-[0_0_40px_rgba(0,194,122,0.08)]">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    Consultar propiedad
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Te respondemos con disponibilidad, detalles y alternativas similares.
                  </p>

                  <div className="mt-5 space-y-3">
                    <a
                      href={`https://wa.me/5491141593878?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(0,194,122,0.35)]"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:silvanajunes@gmail.com?subject=${encodeURIComponent(`Consulta sobre: ${p.title}`)}`}
                      className="flex w-full items-center justify-center gap-3 rounded-lg border border-primary px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      <Mail className="h-5 w-5" />
                      Email
                    </a>
                    <a
                      href="tel:+5491141593878"
                      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Phone className="h-5 w-5" />
                      Llamar
                    </a>
                  </div>
                </div>

                {activeAmenities.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-6">
                    <p className="mb-4 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Incluye
                    </p>
                    <ul className="space-y-3">
                      {activeAmenities.map(({ key, label }) => (
                        <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                          <Check className="h-4 w-4 text-primary" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
