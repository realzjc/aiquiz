"use client"

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
    FolderIcon,
    ShareIcon,
    MoreHorizontalIcon,
    type LucideIcon,
    Plus,
    FileEditIcon,
    Trash,
    Check,
    X,
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
import { useBanks } from "@/features/bank/hooks/useBanks"
import { DROPDOWN_MENU_STYLE } from "@/lib/constants"
import { Input } from "@/components/ui/input"

export function NavBanks() {
    const { isMobile } = useSidebar()
    const { banks, addBank, deleteBank, renameBank } = useBanks();
    const navigate = useNavigate();

    const [editingBankId, setEditingBankId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingBankId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingBankId]);

    const handleAddBank = async () => {
        try {
            const newBankId = await addBank("untitled");
            console.log("New bank created successfully:", newBankId);

            navigate(`/bank/${newBankId}`);
        } catch (error) {
            console.error("Failed to create bank:", error);
        }
    };

    const handleStartRename = (bankId: string, currentName: string) => {
        setEditingBankId(bankId);
        setEditingName(currentName);
    };

    const handleSaveRename = async () => {
        if (editingBankId && editingName.trim()) {
            await renameBank(editingBankId, editingName.trim());
            setEditingBankId(null);
            setEditingName("");
        }
    };

    const handleCancelRename = () => {
        setEditingBankId(null);
        setEditingName("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSaveRename();
        } else if (e.key === "Escape") {
            handleCancelRename();
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            handleSaveRename();
        }
    };

    useEffect(() => {
        if (editingBankId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingBankId, editingName]);

    const handleDeleteClick = (e: React.MouseEvent, bankId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingBankId(bankId);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deletingBankId) {
            try {
                console.log(`Begin to delete bank, ID: ${deletingBankId}`);
                await deleteBank(deletingBankId);
                console.log(`Bank deleted successfully, ID: ${deletingBankId}`);
                setDeletingBankId(null);
                setIsAlertOpen(false);
                navigate("/dashboard");
            } catch (error) {
                console.error(`Failed to delete bank, ID: ${deletingBankId}:`, error);
                // 可以添加用户提示
                alert("Failed to delete bank, please try again");
                setIsAlertOpen(false);
            }
        }
    };

    return (
        <>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>Quiz Banks</SidebarGroupLabel>
                <SidebarGroupAction title="Add Bank" onClick={handleAddBank}>
                    <Plus /> <span className="sr-only">Add Bank</span>
                </SidebarGroupAction>
                <SidebarMenu>
                    {banks.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            {editingBankId === item.id ? (
                                <div className="flex w-full items-center gap-2 px-3 py-2">
                                    <FolderIcon className="h-4 w-4 shrink-0" />
                                    <Input
                                        ref={inputRef}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="h-7 py-1"
                                    />
                                    <button
                                        onClick={handleSaveRename}
                                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleCancelRename}
                                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <SidebarMenuButton asChild>
                                        <Link to={`/bank/${item.id}`}>
                                            <FolderIcon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuAction showOnHover>
                                                <MoreHorizontalIcon />
                                            </SidebarMenuAction>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={DROPDOWN_MENU_STYLE}>
                                            <DropdownMenuItem
                                                onClick={() => handleStartRename(item.id, item.name)}
                                            >
                                                <FileEditIcon className="mr-2 h-4 w-4" />
                                                <span>Rename</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ShareIcon className="mr-2 h-4 w-4" />
                                                <span>Share</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500 hover:text-red-600 focus:text-red-600"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(e as unknown as React.MouseEvent, item.id);
                                                }}
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {deletingBankId ? banks.find(b => b.id === deletingBankId)?.name : ""}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
