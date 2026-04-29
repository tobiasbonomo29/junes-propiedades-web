"use client"

import { useActionState } from "react"
import { signIn } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, {})

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Junes <span className="text-primary">Propiedades</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Panel de Administración</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Iniciar Sesión</h2>

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@ejemplo.com"
                required
                autoComplete="email"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-background border-border"
              />
            </div>

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
                {state.error === "Invalid login credentials"
                  ? "Email o contraseña incorrectos"
                  : state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
