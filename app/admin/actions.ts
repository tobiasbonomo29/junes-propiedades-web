"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { PropertyInsert } from "@/lib/types"

const OPERATIONS = ["Venta", "Alquiler", "Alquiler Temporario"] as const
const PROPERTY_TYPES = ["Casa", "Departamento", "PH", "Local", "Oficina", "Lote"] as const
const CURRENCIES = ["USD", "ARS"] as const
const STATUSES = ["Activa", "Vendida", "Alquilada"] as const

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key)
  return value ? value : null
}

function positiveNumber(formData: FormData, key: string) {
  const value = Number(text(formData, key))
  return Number.isFinite(value) && value > 0 ? value : null
}

function nullableNumber(formData: FormData, key: string) {
  const raw = text(formData, key)
  if (!raw) return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

function option<T extends readonly string[]>(
  formData: FormData,
  key: string,
  options: T,
  fallback: T[number],
) {
  const value = text(formData, key)
  return options.includes(value as T[number]) ? (value as T[number]) : fallback
}

function existingImages(formData: FormData) {
  return formData
    .getAll("existing_images")
    .filter((value): value is string => typeof value === "string" && value.length > 0)
}

function existingVideos(formData: FormData) {
  return formData
    .getAll("existing_videos")
    .filter((value): value is string => typeof value === "string" && value.length > 0)
}

async function uploadMedia(formData: FormData, field: string, type: "image" | "video") {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const uploadedUrls: string[] = []
  const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024

  for (const value of formData.getAll(field)) {
    if (!(value instanceof File) || value.size === 0) continue
    if (!value.type.startsWith(`${type}/`)) continue
    if (value.size > maxSize) continue

    const ext = value.name.split(".").pop() || (type === "image" ? "jpg" : "mp4")
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(filename, value)

    if (error) throw new Error(error.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(data.path)

    uploadedUrls.push(publicUrl)
  }

  return uploadedUrls
}

function storagePathFromUrl(url: string) {
  return url.split("/property-images/")[1]?.split("?")[0] ?? ""
}

export async function savePropertyFromForm(id: string | null, formData: FormData) {
  const title = text(formData, "title")
  const price = positiveNumber(formData, "price")
  const city = text(formData, "city")

  if (!title) throw new Error("El título es requerido")
  if (!price) throw new Error("Ingresá un precio válido mayor a 0")
  if (!city) throw new Error("La ciudad es requerida")

  const uploadedImages = await uploadMedia(formData, "images", "image")
  const uploadedVideos = await uploadMedia(formData, "videos", "video")
  const data: PropertyInsert = {
    title,
    description: nullableText(formData, "description"),
    price,
    currency: option(formData, "currency", CURRENCIES, "USD"),
    operation: option(formData, "operation", OPERATIONS, "Venta"),
    type: option(formData, "type", PROPERTY_TYPES, "Casa"),
    neighborhood: nullableText(formData, "neighborhood"),
    exact_address: nullableText(formData, "exact_address"),
    city,
    bedrooms: nullableNumber(formData, "bedrooms"),
    bathrooms: nullableNumber(formData, "bathrooms"),
    total_area: nullableNumber(formData, "total_area"),
    covered_area: nullableNumber(formData, "covered_area"),
    garage: formData.has("garage"),
    pool: formData.has("pool"),
    garden: formData.has("garden"),
    security: formData.has("security"),
    images: [...existingImages(formData), ...uploadedImages],
    videos: [...existingVideos(formData), ...uploadedVideos],
    featured: formData.has("featured"),
    status: option(formData, "status", STATUSES, "Activa"),
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const result = id
    ? await supabase.from("properties").update(data).eq("id", id)
    : await supabase.from("properties").insert(data)

  if (result.error) throw new Error(result.error.message)

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/propiedades")
  if (id) revalidatePath(`/propiedades/${id}`)
  redirect("/admin")
}

export async function createProperty(
  data: PropertyInsert,
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("properties").insert(data)
  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/propiedades")
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
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${id}`)
  return {}
}

export async function deleteProperty(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Eliminar archivos del storage
  const { data: property } = await supabase
    .from("properties")
    .select("images, videos")
    .eq("id", id)
    .single()

  const paths = [
    ...((property?.images as string[] | undefined) ?? []),
    ...((property?.videos as string[] | undefined) ?? []),
  ]
    .map(storagePathFromUrl)
    .filter(Boolean)

  if (paths.length > 0) {
    await supabase.storage.from("property-images").remove(paths)
  }

  await supabase.from("properties").delete().eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${id}`)
  redirect("/admin")
}

export async function toggleFeatured(id: string, featured: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.from("properties").update({ featured }).eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${id}`)
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
