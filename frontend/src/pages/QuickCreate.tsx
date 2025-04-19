import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/common/site-header"
import data from "@/data/data.json"
import { DataTable } from "@/components/common/data-table"
import { ChartAreaInteractive } from "@/components/common/chart-area-interactive"
// export default function Home({ children }: { children: React.ReactNode }) {
export default function Home({ children }: { children?: React.ReactNode }) {
    return (
        // <SidebarProvider >
        //     <AppSidebar />
        //     <SidebarInset>
        //         <SiteHeader />

        //     </SidebarInset>
        // </SidebarProvider>
        <div className="flex flex-1 flex-col">
        </div>
    )
}
