import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageCircle, PhoneCall } from "lucide-react"

const tasacionWhatsappMessage = encodeURIComponent(
  "Hola! Quiero solicitar una tasación de mi propiedad."
)

const tasacionWhatsappHref = `https://wa.me/5491141593878?text=${tasacionWhatsappMessage}`

export function ContactForm() {
  return (
    <section id="tasacion" className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Tasá tu propiedad <span className="text-primary">hoy</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Obtené una tasación profesional y gratuita hablando directo con nuestro equipo.
                Te asesoramos por WhatsApp para avanzar rápido y sin formularios.
              </p>

              <div className="space-y-4">
                {[
                  "Escribinos por WhatsApp",
                  "Contanos la ubicación y características",
                  "Coordinamos tu tasación sin compromiso",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background rounded-2xl p-8 border border-border shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Solicitá tu tasación por WhatsApp
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tocá el botón y envianos los datos de tu propiedad. Respondemos de forma
                personalizada para ayudarte a conocer su valor de mercado.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Atención directa con el equipo",
                  "Sin formularios ni pasos innecesarios",
                  "Consulta gratuita y sin compromiso",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,194,122,0.5)] transition-all duration-300 py-6 text-lg"
              >
                <a href={tasacionWhatsappHref} target="_blank" rel="noopener noreferrer">
                  Contactar por WhatsApp
                  <PhoneCall className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
