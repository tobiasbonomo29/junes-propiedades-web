import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteProperty, toggleFeatured } from "./actions"
import { Plus, Pencil, Trash2, Star, StarOff } from "lucide-react"
import type { Property } from "@/lib/types"

function formatPrice(price: number, currency: string, operation: string) {
  const formatted = new Intl.NumberFormat("es-AR").format(price)
  return `${currency} ${formatted}${operation === "Alquiler" ? "/mes" : ""}`
}

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
        Error al cargar propiedades: {error.message}
      </div>
    )
  }

  const stats = {
    total: properties?.length ?? 0,
    activas: properties?.filter((p) => p.status === "Activa").length ?? 0,
    vendidas: properties?.filter((p) => p.status === "Vendida").length ?? 0,
    alquiladas: properties?.filter((p) => p.status === "Alquilada").length ?? 0,
    destacadas: properties?.filter((p) => p.featured).length ?? 0,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Propiedades</h1>
          <p className="text-muted-foreground mt-1">{stats.total} propiedades en total</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/propiedades/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Propiedad
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Activas", value: stats.activas, color: "text-primary" },
          { label: "Vendidas", value: stats.vendidas, color: "text-yellow-500" },
          { label: "Alquiladas", value: stats.alquiladas, color: "text-blue-400" },
          { label: "Destacadas", value: stats.destacadas, color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold font-serif ${stat.color}`}>{stat.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {!properties?.length ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay propiedades publicadas todavía.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/admin/propiedades/nueva">
              <Plus className="w-4 h-4 mr-2" />
              Crear primera propiedad
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Propiedad</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Precio</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Estado</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">★</th>
                  <th className="text-right px-4 py-3 text-muted-foreground font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(properties as Property[]).map((property) => {
                  const toggleFeaturedAction = toggleFeatured.bind(null, property.id, !property.featured)
                  const deleteAction = deleteProperty.bind(null, property.id)

                  return (
                    <tr key={property.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {property.images?.[0] ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                Sin foto
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground line-clamp-1">{property.title}</p>
                            <p className="text-muted-foreground text-xs">
                              {[property.neighborhood, property.city].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-1">
                          <p className="text-foreground">{property.type}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              property.operation === "Venta"
                                ? "border-primary/50 text-primary"
                                : "border-blue-400/50 text-blue-400"
                            }`}
                          >
                            {property.operation}
                          </Badge>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-primary font-semibold">
                          {formatPrice(property.price, property.currency, property.operation)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            property.status === "Activa"
                              ? "border-primary/40 text-primary bg-primary/10"
                              : property.status === "Vendida"
                              ? "border-yellow-500/40 text-yellow-500 bg-yellow-500/10"
                              : "border-blue-400/40 text-blue-400 bg-blue-400/10"
                          }
                        >
                          {property.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <form action={toggleFeaturedAction}>
                          <button
                            type="submit"
                            title={property.featured ? "Quitar destacado" : "Destacar"}
                            className={`transition-colors ${
                              property.featured
                                ? "text-amber-400 hover:text-amber-300"
                                : "text-muted-foreground hover:text-amber-400"
                            }`}
                          >
                            {property.featured ? (
                              <Star className="w-5 h-5 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5" />
                            )}
                          </button>
                        </form>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm" title="Editar">
                            <Link href={`/admin/propiedades/${property.id}/editar`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <form action={deleteAction}>
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              title="Eliminar"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
