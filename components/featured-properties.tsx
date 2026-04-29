import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { PropertyCard } from "./property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Property } from "@/lib/types"

function formatPrice(price: number, currency: string, operation: string) {
  const formatted = new Intl.NumberFormat("es-AR").format(price)
  return `${currency} ${formatted}${operation === "Alquiler" ? "/mes" : ""}`
}

export async function FeaturedProperties() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "Activa")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <section id="propiedades" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Propiedades <span className="text-primary">Destacadas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubrí nuestra selección de propiedades premium en las mejores ubicaciones de Argentina
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              >
                <Link href="#">
                  Ver todas las propiedades
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Próximamente nuevas propiedades disponibles.</p>
          </div>
        )}
      </div>
    </section>
  )
}
