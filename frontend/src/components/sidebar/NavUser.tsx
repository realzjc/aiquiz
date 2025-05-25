"use client"

import { useEffect } from "react"
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    Settings2,
} from "lucide-react"

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
import { DROPDOWN_MENU_STYLE } from "@/lib/constants"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Skeleton } from "@/components/ui/skeleton"

const getInitials = (name?: string, email?: string): string => {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        if (parts.length === 1 && parts[0] && parts[0].length > 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        if (parts.length === 1 && parts[0]) {
            return parts[0][0].toUpperCase();
        }
    }
    if (email) {
        const emailInitial = email[0]?.toUpperCase();
        if (emailInitial) return emailInitial;
    }
    return "??";
};

export function NavUser() {
    const { isMobile } = useSidebar()
    const { user, isAuthenticated, isLoading, logout } = useAuth()

    useEffect(() => {
        if (user) {
            console.log("User object:", user)
        }
    }, [user])

    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex h-12 w-full items-center gap-3 rounded-lg px-3 py-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="mt-1 h-3 w-24" />
                        </div>
                        <Skeleton className="ml-auto h-4 w-4" />
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (!isAuthenticated || !user) {
        return null
    }

    const displayName = user.name || (user.email ? user.email.split('@')[0] : "User")
    const displayEmail = user.email || "No email provided"
    const avatarSrc = user.avatar
    const avatarFallbackText = getInitials(user.name, user.email)

    const handleLogout = async () => {
        await logout()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
                                <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                                    {avatarFallbackText}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{displayName}</span>
                                <span className="truncate text-xs">{displayEmail}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={DROPDOWN_MENU_STYLE}
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
                                    <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                                        {avatarFallbackText}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{displayName}</span>
                                    <span className="truncate text-xs">{displayEmail}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles className="mr-2 h-4 w-4" />
                                <span>Upgrade to Pro</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                <span>Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Notifications</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings2 className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
