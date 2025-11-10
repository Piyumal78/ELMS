import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSlide  } from './AppSlide'
import Navigation from "./Navigation"
import DashBoard from "./DashBoard"
import Lab from "./Lab"

const Student = () => {
  return (
    <>
        <SidebarProvider>
            <AppSlide  />
            <main className="flex flex-col ml-32">
                <Navigation />
                <SidebarTrigger className="ml-20" />
                <DashBoard />
                <Lab />
            </main>
      </SidebarProvider>
    </>
  )
}

export default Student