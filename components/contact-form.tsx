"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" })
  }

  return (
    <section id="tasacion" className="py-24 bg-card relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Tasá tu propiedad <span className="text-primary">hoy</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Obtené una tasación profesional y gratuita de tu propiedad. Nuestro equipo de expertos
                te brindará un análisis detallado del valor de mercado.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-foreground">Completá el formulario con tus datos</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-foreground">Te contactamos en menos de 24hs</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p className="text-foreground">Recibí tu tasación sin compromiso</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-background rounded-2xl p-8 border border-border shadow-2xl">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Solicitar Tasación
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm text-muted-foreground mb-2"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-muted-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm text-muted-foreground mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="11 1234 5678"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm text-muted-foreground mb-2"
                  >
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    className="w-full bg-muted text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    placeholder="Contanos sobre tu propiedad..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,194,122,0.5)] transition-all duration-300 py-6 text-lg"
                >
                  Solicitar Tasación
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
