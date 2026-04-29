"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  const [operacion, setOperacion] = useState("")
  const [tipoPropiedad, setTipoPropiedad] = useState("")
  const [ubicacion, setUbicacion] = useState("")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo Icon */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GNMyDkRjpt7aBNrYk0LuDVlree0ZSj.png"
              alt="Junes Propiedades"
              className="h-48 md:h-64 object-contain"
            />
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Compra, venta y tasación de propiedades con atención personalizada
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,194,122,0.5)] transition-all duration-300 text-lg px-8"
            >
              <Link href="#propiedades">Ver Propiedades</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8"
            >
              <Link href="#tasacion">Solicitar Tasación</Link>
            </Button>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-4xl bg-card/90 backdrop-blur-md rounded-xl p-6 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Operación */}
              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Operación
                </label>
                <div className="relative">
                  <select
                    value={operacion}
                    onChange={(e) => setOperacion(e.target.value)}
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas</option>
                    <option value="compra">Compra</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Tipo de Propiedad */}
              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Tipo de Propiedad
                </label>
                <div className="relative">
                  <select
                    value={tipoPropiedad}
                    onChange={(e) => setTipoPropiedad(e.target.value)}
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="local">Local Comercial</option>
                    <option value="terreno">Terreno</option>
                    <option value="oficina">Oficina</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Ubicación */}
              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Ubicación
                </label>
                <div className="relative">
                  <select
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas</option>
                    <option value="capital">Capital Federal</option>
                    <option value="zona-norte">Zona Norte</option>
                    <option value="zona-sur">Zona Sur</option>
                    <option value="zona-oeste">Zona Oeste</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,194,122,0.4)] transition-all duration-300 py-3 h-[50px]">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>
    </section>
  )
}
