"use client"

import { Home, TrendingUp, Search, Scale } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Compra y Venta de Propiedades",
    description:
      "Te acompañamos en todo el proceso de compra o venta de tu propiedad con atención personalizada y asesoramiento profesional.",
  },
  {
    icon: TrendingUp,
    title: "Preparación de Propiedades",
    description:
      "Preparamos tu propiedad para venta o alquiler con servicios de home staging para obtener el máximo rendimiento.",
  },
  {
    icon: Scale,
    title: "Tasaciones Judiciales",
    description:
      "Realizamos tasaciones oficiales para procesos judiciales, sucesiones y divorcios con peritajes certificados.",
  },
  {
    icon: Search,
    title: "Búsqueda Personalizada",
    description:
      "Encontramos la propiedad ideal según tus necesidades y preferencias, ahorrándote tiempo y esfuerzo.",
  },
]

export function Services() {
  return (
    <section id="servicios" className="py-24 bg-card relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para todas tus necesidades inmobiliarias
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-background rounded-xl p-8 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,194,122,0.1)] text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <service.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
