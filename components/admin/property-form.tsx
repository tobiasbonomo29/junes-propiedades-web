"use client"

import { useState, useTransition, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { createProperty, updateProperty } from "@/app/admin/actions"
import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, X, Loader2 } from "lucide-react"

const propertySchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  price: z.coerce
    .number({ invalid_type_error: "Ingresá un precio válido" })
    .positive("El precio debe ser mayor a 0"),
  currency: z.enum(["USD", "ARS"]),
  operation: z.enum(["Venta", "Alquiler"]),
  type: z.enum(["Casa", "Departamento", "PH", "Local", "Oficina", "Lote"]),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "La ciudad es requerida"),
  bedrooms: z.coerce.number().int().min(0).nullable().optional(),
  bathrooms: z.coerce.number().int().min(0).nullable().optional(),
  total_area: z.coerce.number().min(0).nullable().optional(),
  covered_area: z.coerce.number().min(0).nullable().optional(),
  garage: z.boolean().default(false),
  pool: z.boolean().default(false),
  garden: z.boolean().default(false),
  security: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.enum(["Activa", "Vendida", "Alquilada"]),
})

type PropertyFormValues = z.infer<typeof propertySchema>

interface NewImageFile {
  file: File
  preview: string
}

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [existingImages, setExistingImages] = useState<string[]>(
    property?.images ?? []
  )
  const [newImages, setNewImages] = useState<NewImageFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property?.price ?? undefined,
      currency: property?.currency ?? "USD",
      operation: property?.operation ?? "Venta",
      type: property?.type ?? "Casa",
      neighborhood: property?.neighborhood ?? "",
      city: property?.city ?? "Buenos Aires",
      bedrooms: property?.bedrooms ?? null,
      bathrooms: property?.bathrooms ?? null,
      total_area: property?.total_area ?? null,
      covered_area: property?.covered_area ?? null,
      garage: property?.garage ?? false,
      pool: property?.pool ?? false,
      garden: property?.garden ?? false,
      security: property?.security ?? false,
      featured: property?.featured ?? false,
      status: property?.status ?? "Activa",
    },
  })

  const w = {
    currency: watch("currency"),
    operation: watch("operation"),
    type: watch("type"),
    status: watch("status"),
    garage: watch("garage"),
    pool: watch("pool"),
    garden: watch("garden"),
    security: watch("security"),
    featured: watch("featured"),
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    )
    setNewImages((prev) => [
      ...prev,
      ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ])
  }

  function removeExisting(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url))
  }

  function removeNew(index: number) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const onSubmit = (values: PropertyFormValues) => {
    setError(null)
    startTransition(async () => {
      try {
        const supabase = createClient()
        const uploadedUrls: string[] = []

        for (const { file } of newImages) {
          const ext = file.name.split(".").pop()
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { data, error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filename, file)

          if (uploadError) throw new Error(uploadError.message)

          const {
            data: { publicUrl },
          } = supabase.storage.from("property-images").getPublicUrl(data.path)

          uploadedUrls.push(publicUrl)
        }

        const allImages = [...existingImages, ...uploadedUrls]
        const normalized = {
          ...values,
          description: values.description ?? null,
          neighborhood: values.neighborhood ?? null,
          bedrooms: values.bedrooms ?? null,
          bathrooms: values.bathrooms ?? null,
          total_area: values.total_area ?? null,
          covered_area: values.covered_area ?? null,
          images: allImages,
        }
        const result = property
          ? await updateProperty(property.id, normalized)
          : await createProperty(normalized)

        if (result.error) {
          setError(result.error)
          return
        }

        router.push("/admin")
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado al guardar")
      }
    })
  }

  const totalImages = existingImages.length + newImages.length

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Información General */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Información General</h2>

        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Ej: Casa moderna en Nordelta"
            className="bg-background"
          />
          {errors.title && (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Descripción detallada de la propiedad, sus características y puntos destacados..."
            className="bg-background min-h-[120px] resize-none"
          />
        </div>
      </section>

      {/* Precio y Operación */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Precio y Operación</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>
              Operación <span className="text-destructive">*</span>
            </Label>
            <Select
              value={w.operation}
              onValueChange={(v) => setValue("operation", v as "Venta" | "Alquiler")}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venta">Venta</SelectItem>
                <SelectItem value="Alquiler">Alquiler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Precio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price")}
              placeholder="0"
              className="bg-background"
            />
            {errors.price && (
              <p className="text-destructive text-xs">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Moneda <span className="text-destructive">*</span>
            </Label>
            <Select
              value={w.currency}
              onValueChange={(v) => setValue("currency", v as "USD" | "ARS")}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD — Dólares</SelectItem>
                <SelectItem value="ARS">ARS — Pesos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Características</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Tipo de propiedad <span className="text-destructive">*</span>
            </Label>
            <Select
              value={w.type}
              onValueChange={(v) => setValue("type", v as PropertyFormValues["type"])}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Casa", "Departamento", "PH", "Local", "Oficina", "Lote"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              Ciudad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="Buenos Aires"
              className="bg-background"
            />
            {errors.city && (
              <p className="text-destructive text-xs">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Barrio / Zona</Label>
            <Input
              id="neighborhood"
              {...register("neighborhood")}
              placeholder="Ej: Palermo, Nordelta, San Isidro"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedrooms">Dormitorios</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              {...register("bedrooms")}
              placeholder="—"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Baños</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              {...register("bathrooms")}
              placeholder="—"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_area">Superficie total (m²)</Label>
            <Input
              id="total_area"
              type="number"
              step="0.01"
              min="0"
              {...register("total_area")}
              placeholder="—"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="covered_area">Superficie cubierta (m²)</Label>
            <Input
              id="covered_area"
              type="number"
              step="0.01"
              min="0"
              {...register("covered_area")}
              placeholder="—"
              className="bg-background"
            />
          </div>
        </div>
      </section>

      {/* Comodidades */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Comodidades</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { key: "garage", label: "Cochera" },
              { key: "pool", label: "Pileta" },
              { key: "garden", label: "Jardín" },
              { key: "security", label: "Seguridad" },
            ] as const
          ).map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center gap-3 bg-background rounded-lg p-3 border border-border"
            >
              <Switch
                id={key}
                checked={w[key]}
                onCheckedChange={(checked) => setValue(key, checked)}
              />
              <Label htmlFor={key} className="cursor-pointer text-sm select-none">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </section>

      {/* Estado y Publicación */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Estado y Publicación</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={w.status}
              onValueChange={(v) => setValue("status", v as PropertyFormValues["status"])}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activa">Activa</SelectItem>
                <SelectItem value="Vendida">Vendida</SelectItem>
                <SelectItem value="Alquilada">Alquilada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="flex items-center gap-3 bg-background rounded-lg px-4 py-3 border border-border"
          >
            <Switch
              id="featured"
              checked={w.featured}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <div>
              <Label htmlFor="featured" className="cursor-pointer text-sm font-medium select-none">
                Propiedad destacada
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aparece en la sección principal del sitio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Imágenes */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Imágenes
          {totalImages > 0 && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalImages})
            </span>
          )}
        </h2>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/10"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium text-sm">
            Arrastrá imágenes aquí o hacé clic para seleccionar
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            JPG, PNG, WebP — máximo 5 MB por imagen
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Previews */}
        {totalImages > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingImages.map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeExisting(url)}
                    className="bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  Actual
                </span>
              </div>
            ))}
            {newImages.map(({ preview }, index) => (
              <div
                key={preview}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeNew(index)}
                    className="bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="absolute bottom-1 left-1 bg-primary/80 text-white text-xs px-1.5 py-0.5 rounded">
                  Nueva
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pb-8">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {property ? "Guardando..." : "Publicando..."}
            </>
          ) : property ? (
            "Guardar cambios"
          ) : (
            "Publicar propiedad"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin")}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
