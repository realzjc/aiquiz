import { ArrowUpCircleIcon, Calendar, Home, Inbox, Search, Settings, SquarePen, MailIcon, PanelLeft, PlusCircleIcon, Plus, Trash, MoreHorizontal, FileText, Rocket, CreditCard, Bell, LogOut, Settings2, LayoutDashboardIcon, ListIcon, BarChartIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, FileCodeIcon, SettingsIcon, HelpCircleIcon, SearchIcon, DatabaseIcon, ClipboardListIcon, FileIcon } from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupAction,
    SidebarMenuAction,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavBanks } from "@/components/sidebar/nav-banks"
import { NavMain } from "@/components/sidebar/nav-main"
import { useBanks } from "@/contexts/BanksContext"
import { banks } from "@/data/mock-banks" // ✅ 从 mock 数据中读取
import { SearchDialog } from "@/components/sidebar/SearchDialog"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Quick Create",
            url: "/quick-create",
            icon: SquarePen,
        },
        {
            title: "Home",
            url: "/home",
            icon: Home,
        },

        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Search",
            url: "#",
            icon: SearchIcon,
        },
        // {
        //     title: "Inbox",
        //     url: "#",
        //     icon: Inbox,
        // },
        // {
        //     title: "Lifecycle",
        //     url: "#",
        //     icon: ListIcon,
        // },
        // {
        //     title: "Analytics",
        //     url: "#",
        //     icon: BarChartIcon,
        // },
        // {
        //     title: "Projects",
        //     url: "#",
        //     icon: FolderIcon,
        // },
        // {
        //     title: "Team",
        //     url: "#",
        //     icon: UsersIcon,
        // },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: CameraIcon,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: FileTextIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: FileCodeIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: SettingsIcon,
        // },
        // {
        //     title: "Get Help",
        //     url: "#",
        //     icon: HelpCircleIcon,
        // },
        // {
        //     title: "Search",
        //     url: "#",
        //     icon: SearchIcon,
        // },
    ],
    banks: [
        {
            name: "Bank1",
            url: "#",
            icon: FileText,
        },
        {
            name: "Bank2",
            url: "#",
            icon: FileText,
        },
        {
            name: "Bank3",
            url: "#",
            icon: FileText,
        },
    ],
}
//     {
//     title: "Home",
//         url: "#",
//             icon: Home,
//     },
// }
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { banks } = useBanks()
    const { isMobile } = useSidebar()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const [searchOpen, setSearchOpen] = useState(false)
    return (
        <Sidebar collapsible="offcanvas" {...props}>

            <SidebarHeader className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex justify-between items-center w-full">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <span className="text-base font-semibold">AI QUIZ</span>
                            </a>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={data.navMain}
                    onSearchOpen={() => setSearchOpen(true)}
                />
                <NavBanks items={banks.map(bank => ({
                    name: bank.name,
                    url: `/bank/${bank.id}`,
                    icon: FileText,
                }))} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                {/* <NavUser user={data.user} /> */}
                <NavUser />
            </SidebarFooter>

            {/* 把 SearchDialog 放到 Sidebar 下，这样它的 overlay 会盖住整个页面 */}
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Sidebar>
    )
}