export type PropertyOperation = "Venta" | "Alquiler"
export type PropertyType = "Casa" | "Departamento" | "PH" | "Local" | "Oficina" | "Lote"
export type PropertyCurrency = "USD" | "ARS"
export type PropertyStatus = "Activa" | "Vendida" | "Alquilada"

export interface Property {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string | null
  price: number
  currency: PropertyCurrency
  operation: PropertyOperation
  type: PropertyType
  neighborhood: string | null
  city: string
  bedrooms: number | null
  bathrooms: number | null
  total_area: number | null
  covered_area: number | null
  garage: boolean
  pool: boolean
  garden: boolean
  security: boolean
  images: string[]
  featured: boolean
  status: PropertyStatus
}

export type PropertyInsert = Omit<Property, "id" | "created_at" | "updated_at">
export type PropertyUpdate = Partial<PropertyInsert>
