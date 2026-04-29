import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { PropertyForm } from "@/components/admin/property-form"
import type { Property } from "@/lib/types"

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarPropiedad({ params }: EditPropertyPageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single()

  if (!property) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Editar Propiedad</h1>
        <p className="text-muted-foreground mt-1 line-clamp-1">{property.title}</p>
      </div>
      <PropertyForm property={property as Property} />
    </div>
  )
}
