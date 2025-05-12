import { Topbar } from "@/components/layout/topbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "sonner"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-4">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
} 