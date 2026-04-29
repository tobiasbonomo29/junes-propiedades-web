import { Navbar } from "@/components/navbar"
import { FeaturedProperties } from "@/components/featured-properties"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

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
