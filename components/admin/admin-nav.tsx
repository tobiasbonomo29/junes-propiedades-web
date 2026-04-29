"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/admin/actions"
import { LayoutDashboard, Plus, LogOut } from "lucide-react"

interface AdminNavProps {
  userEmail?: string
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/admin" className="font-serif text-xl font-bold text-foreground">
          Junes <span className="text-primary">Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={pathname === "/admin" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href="/admin">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Propiedades
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className={
              pathname === "/admin/propiedades/nueva"
                ? "bg-primary text-primary-foreground"
                : "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
            }
          >
            <Link href="/admin/propiedades/nueva">
              <Plus className="w-4 h-4 mr-2" />
              Nueva
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
          )}
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
