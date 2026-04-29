"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { PropertyInsert } from "@/lib/types"

export async function createProperty(
  data: PropertyInsert,
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("properties").insert(data)
  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")
  return {}
}

export async function updateProperty(
  id: string,
  data: Partial<PropertyInsert>,
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("properties").update(data).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")
  return {}
}

export async function deleteProperty(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Eliminar imágenes del storage
  const { data: property } = await supabase
    .from("properties")
    .select("images")
    .eq("id", id)
    .single()

  if (property?.images?.length) {
    const paths = (property.images as string[])
      .map((url) => url.split("/property-images/")[1] ?? "")
      .filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from("property-images").remove(paths)
    }
  }

  await supabase.from("properties").delete().eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/")
  redirect("/admin")
}

export async function toggleFeatured(id: string, featured: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.from("properties").update({ featured }).eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/")
}

export async function signIn(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect("/admin")
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  redirect("/admin/login")
}
