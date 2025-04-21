// "use client"

// import { type LucideIcon, PlusCircleIcon, MailIcon, Search, SquarePen } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Link } from "react-router-dom"

// import {
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
// } from "@/components/ui/sidebar"

// export function NavMain({
//     items,
// }: {
//     items: {
//         title: string
//         url: string
//         icon?: LucideIcon
//     }[]
// }) {
//     return (
//         <SidebarGroup>
//             <SidebarGroupContent className="flex flex-col gap-2">
//                 <SidebarMenu>
//                     {items.map((item) => (
//                         <SidebarMenuItem key={item.title}>
//                             {/* <SidebarMenuButton tooltip={item.title}>
//                                 {item.icon && <item.icon />}
//                                 <span>{item.title}</span>
//                             </SidebarMenuButton> */}
//                             <SidebarMenuButton asChild tooltip={item.title}>
//                                 <Link to={item.url} className="flex items-center gap-2">
//                                     {item.icon && <item.icon />}
//                                     <span>{item.title}</span>
//                                 </Link>
//                             </SidebarMenuButton>
//                         </SidebarMenuItem>
//                     ))}
//                 </SidebarMenu>
//             </SidebarGroupContent>
//         </SidebarGroup>
//     )
// }


"use client"

import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavMainProps = {
    items: { title: string; url: string; icon?: LucideIcon }[]
    onSearchOpen: () => void
}
export function NavMain({
    items,
    onSearchOpen,
}: NavMainProps) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.title === "Search" ? (
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                >
                                    <button
                                        onClick={onSearchOpen}
                                        className="flex items-center gap-2 w-full text-left"
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </button>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link to={item.url} className="flex items-center gap-2">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent >
        </SidebarGroup >
    )
}
