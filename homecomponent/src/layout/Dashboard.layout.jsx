import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../Component/Appside"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full min-h-screen">
        <div className="p-4 border-b bg-white relative left-64">
          <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-md" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
          <p className="text-gray-600">Select an option from the sidebar to get started.</p>
        </div>
      </main>
    </SidebarProvider>
  )
}