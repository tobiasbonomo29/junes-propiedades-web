import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProperties } from "@/components/featured-properties"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { ContactForm } from "@/components/contact-form"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Services />
      <About />
      <ContactForm />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
