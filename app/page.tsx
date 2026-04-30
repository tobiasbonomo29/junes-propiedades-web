import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProperties } from "@/components/featured-properties"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { ContactForm } from "@/components/contact-form"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

export default function Home() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/junes-logo.png`,
      image: `${SITE_URL}/junes-logo.png`,
      description: SITE_DESCRIPTION,
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      areaServed: ["Buenos Aires", "Argentina"],
      sameAs: [INSTAGRAM_URL],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: CONTACT_PHONE,
          contactType: "customer service",
          areaServed: "AR",
          availableLanguage: ["es"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/propiedades?ubicacion={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ]

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
