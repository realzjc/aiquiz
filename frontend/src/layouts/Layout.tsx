// src/layouts/Layout.tsx
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { SiteHeader } from "@/components/siteheader/SiteHeader"
import { HeaderProvider } from "@/contexts/HeaderContext"
import { BanksProvider } from "@/contexts/BanksContext"

export default function Layout() {
    return (
        <SidebarProvider>
            <HeaderProvider>
                <BanksProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <SiteHeader />
                        <div className="p-6">
                            <Outlet /> {/* 子页面渲染位置 */}
                        </div>
                    </SidebarInset>
                </BanksProvider>
            </HeaderProvider>
        </SidebarProvider>
    )
}
