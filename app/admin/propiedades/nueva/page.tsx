import { PropertyForm } from "@/components/admin/property-form"

export default function NuevaPropiedad() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Nueva Propiedad</h1>
        <p className="text-muted-foreground mt-1">
          Completá los datos para publicar una nueva propiedad
        </p>
      </div>
      <PropertyForm />
    </div>
  )
}
