import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/common/site-header"
import data from "@/data/data.json"
import { DataTable } from "@/components/common/data-table"
import { ChartAreaInteractive } from "@/components/common/chart-area-interactive"

export default function Dashboard({ children }: { children?: React.ReactNode }) {
    return (
        // <SidebarProvider >
        //     <AppSidebar />
        //     <SidebarInset>
        //         <SiteHeader />
        //         <div className="flex flex-1 flex-col">
        //             <div className="@container/main flex flex-1 flex-col gap-2">
        //                 <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        //                     {/* <SectionCards /> */}
        //                     <div className="px-4 lg:px-6">
        //                         <ChartAreaInteractive />
        //                     </div>

        //                 </div>
        //             </div>
        //         </div>
        //     </SidebarInset>
        // </SidebarProvider>
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* <SectionCards /> */}
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>

                </div>
            </div>
        </div>
    )
}
