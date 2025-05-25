"use client"

import { useNavigate } from "react-router-dom"
import { LayoutDashboardIcon, MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavTop() {
    const navigate = useNavigate()

    const handleQuickCreateClick = () => {
        navigate("/quick-create")
    }

    const handleDashboardClick = () => {
        navigate("/dashboard")
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Quick Create" onClick={handleQuickCreateClick}>
                            <PlusCircleIcon />
                            <span>Quick Create</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Dashboard" onClick={handleDashboardClick}>
                            <LayoutDashboardIcon />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
