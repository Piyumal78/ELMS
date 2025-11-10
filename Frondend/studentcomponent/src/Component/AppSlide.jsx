import {LayoutDashboard,BookOpen ,File,GraduationCap,Send,Library} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "My Reports",
    url: "#",
    icon: File,
  },
  {
    title: "Grades",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
]

export function AppSlide() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 mb-6 px-4">
      <div className="flex items-center gap-2 text-lg font-medium">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-linear-to-r from-blue-700 to-blue-400">
          <Library className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
                    <span>ELMS</span>
                    <span className="text-gray-600 text-sm">Lab Management</span>
                </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 mt-6">
            <SidebarMenu className="space-y-1 ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className=" text-gray-700 hover:bg-blue-700 hover:text-white rounded-md">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}