import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { PropertyCard } from "./property-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Property } from "@/lib/types"

interface PropertyFilters {
  operacion?: string
  tipo?: string
  ubicacion?: string
}

interface FeaturedPropertiesProps {
  filters?: PropertyFilters
  mode?: "featured" | "results"
}

function formatPrice(price: number, currency: string, operation: string) {
  const formatted = new Intl.NumberFormat("es-AR").format(price)
  return `${currency} ${formatted}${operation === "Alquiler" ? "/mes" : ""}`
}

function hasActiveFilters(filters?: PropertyFilters) {
  return Boolean(filters?.operacion || filters?.tipo || filters?.ubicacion)
}

export async function FeaturedProperties({
  filters,
  mode = "featured",
}: FeaturedPropertiesProps) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "Activa")

  if (filters?.operacion) {
    query = query.eq("operation", filters.operacion)
  }

  if (filters?.tipo) {
    query = query.eq("type", filters.tipo)
  }

  if (filters?.ubicacion) {
    const location = filters.ubicacion.replaceAll(",", " ")
    query = query.or(
      `city.ilike.%${location}%,neighborhood.ilike.%${location}%,exact_address.ilike.%${location}%`
    )
  }

  const filtered = mode === "results" || hasActiveFilters(filters)
  const { data: properties } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(mode === "results" ? 60 : 6)

  return (
    <section id="propiedades" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {mode === "results" && (
            <div className="mb-8">
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <Link href="/#propiedades">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Volver atrás
                </Link>
              </Button>
            </div>
          )}

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {filtered ? "Resultados de " : "Propiedades "}
            <span className="text-primary">{filtered ? "Búsqueda" : "Destacadas"}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {filtered
              ? "Estas son las propiedades que coinciden con los filtros seleccionados."
              : "Descubrí nuestra selección de propiedades premium en las mejores ubicaciones de Argentina"}
          </p>
        </div>

        {properties && properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {(properties as Property[]).map((property, index) => (
                <div
                  key={property.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard
                    image={
                      property.images?.[0] ??
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                    }
                    price={formatPrice(property.price, property.currency, property.operation)}
                    title={property.title}
                    location={
                      [property.neighborhood, property.city].filter(Boolean).join(", ")
                    }
                    type={property.type}
                    bedrooms={property.bedrooms ?? undefined}
                    bathrooms={property.bathrooms ?? undefined}
                    area={property.total_area ?? undefined}
                    operation={property.operation}
                    href={`/propiedades/${property.id}`}
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              {filtered ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Link href="/propiedades">Limpiar filtros</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                >
                  <Link href="/propiedades">
                    Ver todas las propiedades
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {filtered
                ? "No encontramos propiedades con esos filtros."
                : "Próximamente nuevas propiedades disponibles."}
            </p>
            {filtered && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Link href="/propiedades">Limpiar filtros</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
