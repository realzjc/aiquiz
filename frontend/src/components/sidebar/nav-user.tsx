"use client"

import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
    SettingsIcon,
    HelpCircleIcon,
} from "lucide-react"
import { useState } from "react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { SettingsDialog } from "../settings/SettingsDialog"


import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

export function NavUser() {
    const { isMobile } = useSidebar()
    const { user, logout } = useAuth()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const extendedUser = {
        ...user,
        avatar: "/avatars/shadcn.jpg"
    }
    console.log(extendedUser)
    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg grayscale">
                                    <AvatarImage src={extendedUser.avatar} alt={extendedUser.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{extendedUser.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {extendedUser.email}
                                    </span>
                                </div>
                                <MoreVerticalIcon className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white text-black shadow-lg border border-gray-200"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={extendedUser.avatar} alt={extendedUser.name} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{extendedUser.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {extendedUser.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <UserCircleIcon />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCardIcon />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <BellIcon />
                                    Notifications
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={(e) => {
                                    e.preventDefault();
                                    setSettingsOpen(true);
                                }}>
                                    <SettingsIcon />
                                    Settings
                                </DropdownMenuItem>

                                {/* <Button variant="outline">
                                        </Button> */}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <HelpCircleIcon />
                                Get Help
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
                                <LogOutIcon />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu >

            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </>
    )
}

// "use client"

// import { useState } from "react"
// import {
//     BellIcon,
//     CreditCardIcon,
//     LogOutIcon,
//     MoreVerticalIcon,
//     UserCircleIcon,
//     SettingsIcon,
//     HelpCircleIcon,
// } from "lucide-react"

// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from "@/components/ui/avatar"
// import {
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuGroup,
//     DropdownMenuItem,
// } from "@/components/ui/dropdown-menu"
// import {
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
//     useSidebar,
// } from "@/components/ui/sidebar"

// import { useAuth } from "@/contexts/AuthContext"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Copy } from "lucide-react"

// export function NavUser() {
//     const { isMobile } = useSidebar()
//     const { user, logout } = useAuth()
//     const [settingsOpen, setSettingsOpen] = useState(false)

//     if (!user) {
//         // 如果未登录，直接不渲染
//         return null
//     }

//     return (
//         <>
//             <SidebarMenu>
//                 <SidebarMenuItem>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <SidebarMenuButton
//                                 size="lg"
//                                 className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                             >
//                                 <Avatar className="h-8 w-8 rounded-lg">
//                                     {/* <AvatarImage src={user.avatar ?? "/default-avatar.png"} alt={user.email} /> */}
//                                     <AvatarFallback className="rounded-lg">
//                                         {user.name?.slice(0, 2).toUpperCase()}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 <div className="ml-2 flex-1 text-left text-sm leading-tight">
//                                     <div className="font-medium">{user.name}</div>
//                                     <div className="text-xs text-muted-foreground">{user.email}</div>
//                                 </div>
//                                 <MoreVerticalIcon className="ml-auto size-4" />
//                             </SidebarMenuButton>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent
//                             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//                             side={isMobile ? "bottom" : "right"}
//                             align="end"
//                             sideOffset={4}
//                         >
//                             <DropdownMenuLabel className="p-0 font-normal">
//                                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                                     <Avatar className="h-8 w-8 rounded-lg">
//                                         {/* <AvatarImage src={user.avatar ?? "/default-avatar.png"} alt={user.email} /> */}
//                                         <AvatarFallback className="rounded-lg">
//                                             {user.name?.slice(0, 2).toUpperCase()}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <div className="flex-1">
//                                         <div className="font-medium">{user.name}</div>
//                                         <div className="text-xs text-muted-foreground">{user.email}</div>
//                                     </div>
//                                 </div>
//                             </DropdownMenuLabel>

//                             <DropdownMenuSeparator />

//                             <DropdownMenuGroup>
//                                 <DropdownMenuItem>
//                                     <UserCircleIcon /> Account
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>
//                                     <CreditCardIcon /> Billing
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>
//                                     <BellIcon /> Notifications
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
//                                     <SettingsIcon /> Settings
//                                 </DropdownMenuItem>
//                             </DropdownMenuGroup>

//                             <DropdownMenuSeparator />

//                             <DropdownMenuItem>
//                                 <HelpCircleIcon /> Get Help
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={logout}>
//                                 <LogOutIcon /> Log out
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </SidebarMenuItem>
//             </SidebarMenu>

//             {/* 可选的 Settings 弹窗逻辑 */}
//             <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
//                 <DialogTrigger asChild>
//                     <></> {/* 实际触发由上面菜单项完成 */}
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>Share link</DialogTitle>
//                         <DialogDescription>
//                             Anyone who has this link will be able to view this.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="flex items-center space-x-2">
//                         <div className="grid flex-1 gap-2">
//                             <Label htmlFor="link" className="sr-only">Link</Label>
//                             <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
//                         </div>
//                         <Button size="sm" className="px-3">
//                             <Copy />
//                             <span className="sr-only">Copy</span>
//                         </Button>
//                     </div>
//                     <DialogFooter className="sm:justify-start">
//                         <DialogClose asChild>
//                             <Button variant="secondary">Close</Button>
//                         </DialogClose>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }
