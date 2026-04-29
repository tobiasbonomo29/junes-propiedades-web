"use client"

import { Phone, Instagram, Mail, MapPin } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "11 4159 3878",
    href: "https://wa.me/5491141593878",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@junespropiedades",
    href: "https://instagram.com/junespropiedades",
  },
  {
    icon: Mail,
    label: "Email",
    value: "silvanajunes@gmail.com",
    href: "mailto:silvanajunes@gmail.com",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Buenos Aires, Argentina",
    href: "#",
  },
]

export function Contact() {
  return (
    <section id="contacto" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">Contactanos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estamos para ayudarte. Comunicate con nosotros por el medio que prefieras.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactInfo.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,194,122,0.1)] text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                {item.value}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
