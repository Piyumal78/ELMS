
import { Link } from "react-router-dom";

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


export function AppSidebar(props) {
  return (
    <Sidebar className="py-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to="/" className="flex items-center gap-3">
                 <div className="flex justify-center items-center w-10 h-10 bg-lime-400 rounded-full text-black">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round" 
                    className="lucide lucide-wind-icon lucide-wind block">
                    <path d="M12.8 19.6A2 2 0 1 0 14 16H2"/>
                    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/>
                    <path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>
                </svg>
                </div>
                <span className="text-xl font-bold font-sans text-black">Aelora</span>
            </Link> 
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-10">
            <SidebarMenu>
              {props.items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1 text-black font-semibold  text-9xl" size="2xl">
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