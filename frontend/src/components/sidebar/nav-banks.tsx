"use client"

import {
    FolderIcon,
    ShareIcon,
    MoreHorizontalIcon,
    type LucideIcon,
    Plus,
    FileEditIcon,
    Trash,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupAction,
    useSidebar,
} from "@/components/ui/sidebar"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

const handleDelete = (name: string) => {
    // TODO: 调用 API 或更新状态
    console.log(`Deleting ${name}`)
    //你后续也可以把它换成实际的 fetch('/api/delete', ...) 请求。
}

export function NavBanks({
    items,
    onAddBank,
}: {
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
    onAddBank: () => void
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quiz Banks</SidebarGroupLabel>
            <SidebarGroupAction title="Add Bank" onClick={onAddBank}>
                <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction
                                    showOnHover
                                    className="rounded-sm data-[state=open]:bg-accent"
                                >
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-24 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <FileEditIcon />
                                    <span>Rename</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <ShareIcon />
                                    <span>Share</span>
                                </DropdownMenuItem>

                                {/* <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600">
                                    <Trash className="h-4 w-4" />
                                    <a href="">
                                        <span>Delete</span>
                                    </a>
                                </DropdownMenuItem> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className="text-red-500 hover:text-red-600 focus:text-red-600"
                                            onSelect={(e) => e.preventDefault()}>
                                            <Trash className="h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete the quiz bank <b>{item.name}</b>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(item.name)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
