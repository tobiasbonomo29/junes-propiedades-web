"use client"

import { PropertyCard } from "./property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    price: "USD 450.000",
    title: "Casa moderna en Nordelta",
    location: "Nordelta, Tigre",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    operation: "Venta" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    price: "USD 285.000",
    title: "Departamento premium en Puerto Madero",
    location: "Puerto Madero, CABA",
    type: "Departamento",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    operation: "Venta" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    price: "$ 850.000 / mes",
    title: "PH renovado en Palermo",
    location: "Palermo, CABA",
    type: "PH",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    operation: "Alquiler" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
    price: "USD 520.000",
    title: "Casa con jardín en San Isidro",
    location: "San Isidro, GBA Norte",
    type: "Casa",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    operation: "Venta" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2070&auto=format&fit=crop",
    price: "USD 180.000",
    title: "Oficina en Microcentro",
    location: "Microcentro, CABA",
    type: "Oficina",
    area: 80,
    operation: "Venta" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
    price: "$ 1.200.000 / mes",
    title: "Loft de diseño en Belgrano",
    location: "Belgrano, CABA",
    type: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    operation: "Alquiler" as const,
  },
]

export function FeaturedProperties() {
  return (
    <section id="propiedades" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Propiedades <span className="text-primary">Destacadas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubrí nuestra selección de propiedades premium en las mejores ubicaciones de Argentina
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>

        {/* CTA Button */}
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
      </div>
    </section>
  )
}
