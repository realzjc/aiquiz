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
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/lib/api"

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



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { banks, addBank } = useBanks()
    const { isMobile } = useSidebar()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    const navigate = useNavigate()

    const handleAddBank = async () => {
        try {
            // 1. 发请求 —— 这里 user_id 看你后端是否必填，
            //    可以从 AuthContext 里拿当前用户 id
            const res = await api.post("/quizzes/banks", {
                name: "Untitled Bank",
                description: "Untitled Bank"
            })
            // newBank 里通常会有 { id, name, description, ... }
            const newBank = res.data
            // 2. 更新全局状态（只挑用得到的字段）
            addBank({
                id: newBank.id,
                name: newBank.name,
                url: `/bank/${newBank.id}`, // 👈 补上 url
                icon: FileText,             // 👈 补上 icon
            })

            // 3. 跳到新页面
            navigate(`/bank/${newBank.id}`)
        } catch (err) {
            console.error("新增 Bank 失败:", err)
        }
    }


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
                }))}
                    onAddBank={handleAddBank}
                />
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