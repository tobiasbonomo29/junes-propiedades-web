"use client"

import Link from "next/link"
import { Instagram, Phone, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-bold text-foreground tracking-wide">
                J<span className="text-primary">UNES</span>
              </span>
              <span className="block text-primary text-xs tracking-[0.3em] uppercase mt-1">
                Propiedades
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm mb-6">
              Donde los buenos negocios comienzan. Tu socio de confianza en el mercado inmobiliario
              argentino.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/5491141593878"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/junespropiedades"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:silvanajunes@gmail.com"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#propiedades", label: "Propiedades" },
                { href: "#servicios", label: "Servicios" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#tasacion", label: "Tasación" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">
              Servicios
            </h4>
            <ul className="space-y-3">
              {[
                "Compra de Propiedades",
                "Venta de Propiedades",
                "Alquiler",
                "Tasaciones Judiciales",
                "Home Staging",
              ].map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Junes Propiedades. Todos los derechos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
