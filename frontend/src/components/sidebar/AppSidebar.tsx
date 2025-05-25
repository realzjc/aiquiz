"use client"

import * as React from "react"
import { NavUser } from "@/components/sidebar/NavUser"
import { NavTop } from "@/components/sidebar/NavTop"
import { NavBanks } from "@/components/sidebar/NavBanks"
import { TeamSwitcher } from "@/components/sidebar/TeamSwitcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// // This is sample data.
// const data = {
//     user: {
//         name: "shadcn",
//         email: "m@example.com",
//         avatar: "/avatars/shadcn.jpg",
//     },
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavTop />
                <NavBanks />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}