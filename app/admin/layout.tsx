import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {user && <AdminNav userEmail={user.email} />}
      <main className={user ? "container mx-auto px-4 py-8" : ""}>{children}</main>
    </div>
  )
}
