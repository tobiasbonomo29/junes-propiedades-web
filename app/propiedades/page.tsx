import { Navbar } from "@/components/navbar"
import { FeaturedProperties } from "@/components/featured-properties"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler",
  description:
    "Buscá propiedades en venta, alquiler y alquiler temporario con Junes Propiedades. Casas, departamentos, PH, locales, oficinas y lotes.",
  alternates: {
    canonical: "/propiedades",
  },
  openGraph: {
    title: "Propiedades en venta y alquiler | Junes Propiedades",
    description:
      "Explorá propiedades disponibles en Buenos Aires y Argentina con atención personalizada.",
    url: "/propiedades",
  },
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    operacion?: string
    tipo?: string
    ubicacion?: string
  }>
}) {
  const filters = await searchParams

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FeaturedProperties filters={filters} mode="results" />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
