import { savePropertyFromForm } from "@/app/admin/actions"
import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import Link from "next/link"

const OPERATIONS = ["Venta", "Alquiler", "Alquiler Temporario"] as const
const PROPERTY_TYPES = ["Casa", "Departamento", "PH", "Local", "Oficina", "Lote"] as const
const CURRENCIES = ["USD", "ARS"] as const
const STATUSES = ["Activa", "Vendida", "Alquilada"] as const

interface PropertyFormProps {
  property?: Property
}

function safeOption<T extends readonly string[]>(
  value: string | null | undefined,
  options: T,
  fallback: T[number],
) {
  return options.includes(value as T[number]) ? (value as T[number]) : fallback
}

function bool(value: boolean | null | undefined) {
  return Boolean(value)
}

export function PropertyForm({ property }: PropertyFormProps) {
  const action = savePropertyFromForm.bind(null, property?.id ?? null)

  return (
    <form action={action} className="max-w-3xl space-y-6" encType="multipart/form-data">
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">Información general</h2>
        <TextField
          id="title"
          name="title"
          label="Título"
          required
          defaultValue={property?.title ?? ""}
        />
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={property?.description ?? ""}
            className="min-h-[120px] resize-y bg-background"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">Precio y operación</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField
            name="operation"
            label="Operación"
            options={OPERATIONS}
            defaultValue={safeOption(property?.operation, OPERATIONS, "Venta")}
            required
          />
          <TextField
            id="price"
            name="price"
            label="Precio"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={property?.price?.toString() ?? ""}
          />
          <SelectField
            name="currency"
            label="Moneda"
            options={CURRENCIES}
            defaultValue={safeOption(property?.currency, CURRENCIES, "USD")}
            labels={{ USD: "USD - Dólares", ARS: "ARS - Pesos" }}
            required
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">Características</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            name="type"
            label="Tipo de propiedad"
            options={PROPERTY_TYPES}
            defaultValue={safeOption(property?.type, PROPERTY_TYPES, "Casa")}
            required
          />
          <TextField
            id="city"
            name="city"
            label="Ciudad"
            required
            defaultValue={property?.city ?? "Buenos Aires"}
          />
          <TextField
            id="neighborhood"
            name="neighborhood"
            label="Barrio / zona"
            defaultValue={property?.neighborhood ?? ""}
          />
          <div className="space-y-2 sm:col-span-2">
            <TextField
              id="exact_address"
              name="exact_address"
              label="Dirección exacta"
              defaultValue={property?.exact_address ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Se usa para mostrar la ubicación precisa en Google Maps.
            </p>
          </div>
          <TextField
            id="bedrooms"
            name="bedrooms"
            label="Dormitorios"
            type="number"
            min="0"
            defaultValue={property?.bedrooms?.toString() ?? ""}
          />
          <TextField
            id="bathrooms"
            name="bathrooms"
            label="Baños"
            type="number"
            min="0"
            defaultValue={property?.bathrooms?.toString() ?? ""}
          />
          <TextField
            id="total_area"
            name="total_area"
            label="Superficie total (m²)"
            type="number"
            step="0.01"
            min="0"
            defaultValue={property?.total_area?.toString() ?? ""}
          />
          <TextField
            id="covered_area"
            name="covered_area"
            label="Superficie cubierta (m²)"
            type="number"
            step="0.01"
            min="0"
            defaultValue={property?.covered_area?.toString() ?? ""}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">Comodidades</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CheckboxField name="garage" label="Cochera" defaultChecked={bool(property?.garage)} />
          <CheckboxField name="pool" label="Pileta" defaultChecked={bool(property?.pool)} />
          <CheckboxField name="garden" label="Jardín" defaultChecked={bool(property?.garden)} />
          <CheckboxField name="security" label="Seguridad" defaultChecked={bool(property?.security)} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">Estado y publicación</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            name="status"
            label="Estado"
            options={STATUSES}
            defaultValue={safeOption(property?.status, STATUSES, "Activa")}
          />
          <CheckboxField
            name="featured"
            label="Propiedad destacada"
            description="Aparece en la sección principal del sitio"
            defaultChecked={bool(property?.featured)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">
          Imágenes
          {property?.images?.length ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({property.images.length})
            </span>
          ) : null}
        </h2>

        <label
          htmlFor="images"
          className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/10"
        >
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <span className="block text-sm font-medium text-foreground">
            Hacé clic para seleccionar imágenes
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            JPG, PNG, WebP - máximo 5 MB por imagen
          </span>
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="block w-full rounded-md border border-border bg-background p-2 text-sm text-foreground"
        />

        {property?.images?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {property.images.map((url) => (
              <label
                key={url}
                className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                  Actual
                </span>
                <span className="absolute inset-x-0 top-0 bg-black/70 px-2 py-1 text-xs text-white">
                  <input
                    type="checkbox"
                    name="existing_images"
                    value={url}
                    defaultChecked
                    className="mr-1 accent-primary"
                  />
                  Mantener
                </span>
              </label>
            ))}
          </div>
        ) : null}
      </section>

      <div className="flex items-center gap-4 pb-8">
        <Button
          type="submit"
          className="min-w-[160px] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {property ? "Guardar cambios" : "Publicar propiedad"}
        </Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/admin">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}

function TextField({
  id,
  name,
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  name: string
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input id={id} name={name} required={required} className="bg-background" {...props} />
    </div>
  )
}

function SelectField<T extends readonly string[]>({
  name,
  label,
  options,
  labels,
  defaultValue,
  required,
}: {
  name: string
  label: string
  options: T
  labels?: Partial<Record<T[number], string>>
  defaultValue: T[number]
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {options.map((option) => {
          const value = option as T[number]
          return (
            <option key={option} value={option}>
              {labels?.[value] ?? option}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string
  label: string
  description?: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3">
      <input
        name={name}
        type="checkbox"
        defaultChecked={Boolean(defaultChecked)}
        className="h-4 w-4 rounded border-border accent-primary"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? <span className="block text-xs text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  )
}
