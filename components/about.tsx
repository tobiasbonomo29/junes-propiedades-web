"use client"

import { CheckCircle } from "lucide-react"

const features = [
  "Atención personalizada y dedicada",
  "Amplia experiencia en el mercado inmobiliario",
  "Red de contactos y compradores calificados",
  "Asesoramiento legal y financiero",
  "Transparencia en todas las operaciones",
  "Seguimiento post-venta",
]

export function About() {
  return (
    <section id="nosotros" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
                alt="Junes Propiedades - Sobre Nosotros"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-card rounded-xl p-6 border border-border shadow-2xl">
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary mb-1">15+</p>
                <p className="text-sm text-muted-foreground">Años de experiencia</p>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sobre <span className="text-primary">Nosotros</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              En <span className="text-foreground font-semibold">Junes Propiedades</span>, nos dedicamos
              a hacer realidad tus sueños inmobiliarios. Con más de 15 años de experiencia en el mercado
              argentino, ofrecemos un servicio integral y personalizado que se adapta a las necesidades
              de cada cliente.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Nuestro compromiso es brindarte la mejor atención, con transparencia y profesionalismo en
              cada operación. Ya sea que busques comprar, vender o alquilar, estamos aquí para guiarte
              en cada paso del proceso.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
