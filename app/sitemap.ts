import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return routes
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: properties } = await supabase
    .from("properties")
    .select("id, updated_at, created_at")
    .eq("status", "Activa")
    .order("updated_at", { ascending: false })
    .limit(500)

  return [
    ...routes,
    ...(properties ?? []).map((property) => ({
      url: `${SITE_URL}/propiedades/${property.id}`,
      lastModified: new Date(property.updated_at ?? property.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
