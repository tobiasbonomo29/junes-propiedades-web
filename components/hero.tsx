"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroProps {
  initialFilters?: {
    operacion?: string
    tipo?: string
    ubicacion?: string
  }
}

export function Hero({ initialFilters }: HeroProps) {
  const [operacion, setOperacion] = useState(initialFilters?.operacion ?? "")
  const [tipoPropiedad, setTipoPropiedad] = useState(initialFilters?.tipo ?? "")
  const [ubicacion, setUbicacion] = useState(initialFilters?.ubicacion ?? "")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/35 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <img
              src="/junes-logo.png"
              alt="Junes Propiedades"
              className="h-80 md:h-[26rem] lg:h-[31rem] object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.75)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
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

          <form
            action="/propiedades"
            method="get"
            className="w-full max-w-4xl bg-card/90 backdrop-blur-md rounded-xl p-6 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Tipo de operación
                </label>
                <div className="relative">
                  <select
                    name="operacion"
                    value={operacion}
                    onChange={(e) => setOperacion(e.target.value)}
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas</option>
                    <option value="Venta">Compra</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Alquiler Temporario">Alquiler Temporario</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Tipo de propiedad
                </label>
                <div className="relative">
                  <select
                    name="tipo"
                    value={tipoPropiedad}
                    onChange={(e) => setTipoPropiedad(e.target.value)}
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas</option>
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="PH">PH</option>
                    <option value="Local">Local Comercial</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Lote">Lote</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Ubicación
                </label>
                <input
                  name="ubicacion"
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full bg-muted text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ciudad, dirección, calle..."
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,194,122,0.4)] transition-all duration-300 py-3 h-[50px]">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>
    </section>
  )
}
