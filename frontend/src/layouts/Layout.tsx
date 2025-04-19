// src/layouts/Layout.tsx
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/common/site-header"
import { HeaderProvider } from "@/contexts/HeaderContext"

export default function Layout() {
    return (
        <SidebarProvider>
            <HeaderProvider>
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    <div className="p-6">
                        <Outlet /> {/* 子页面渲染位置 */}
                    </div>
                </SidebarInset>
            </HeaderProvider>
        </SidebarProvider>
    )
}
