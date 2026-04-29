"use client"

import { MapPin, Bed, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PropertyCardProps {
  image: string
  price: string
  title: string
  location: string
  type: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  operation: "Venta" | "Alquiler"
  href?: string
}

export function PropertyCard({
  image,
  price,
  title,
  location,
  type,
  bedrooms,
  bathrooms,
  area,
  operation,
  href,
}: PropertyCardProps) {
  const Wrapper = href ? Link : "div"

  return (
    <Wrapper href={href ?? "#"} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,194,122,0.15)] block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Operation Badge */}
        <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${
          operation === "Venta" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-primary"
        }`}>
          {operation}
        </span>

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background"
          >
            Ver Detalles
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <p className="text-2xl font-serif font-bold text-primary mb-2">{price}</p>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1">{title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Type */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{type}</p>

        {/* Features */}
        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {bedrooms && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Square className="w-4 h-4" />
                <span className="text-sm">{area} m²</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  )
}
