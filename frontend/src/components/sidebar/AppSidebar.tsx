// src/components/sidebar/AppSidebar.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings, Trash, Edit, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanks } from "@/features/bank/hooks/useBanks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

export function AppSidebar() {
    const { banks, addBank, renameBank, deleteBank } = useBanks();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newBankName, setNewBankName] = useState("");
    const [editingBank, setEditingBank] = useState<{ id: string; name: string } | null>(null);

    const handleAddBank = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBankName.trim()) return;

        try {
            const bankId = await addBank(newBankName);
            setNewBankName("");
            setIsAddDialogOpen(false);
            toast.success("题库创建成功");
            navigate(`/bank/${bankId}`);
        } catch (error) {
            toast.error("创建题库失败");
            console.error(error);
        }
    };

    const handleEditBank = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBank || !newBankName.trim()) return;

        try {
            await renameBank(editingBank.id, newBankName);
            setNewBankName("");
            setEditingBank(null);
            setIsEditDialogOpen(false);
            toast.success("题库已更新");
        } catch (error) {
            toast.error("更新题库失败");
            console.error(error);
        }
    };

    const handleDeleteBank = async (id: string) => {
        if (!confirm("确定要删除这个题库吗？此操作不可撤销。")) return;

        try {
            await deleteBank(id);
            toast.success("题库已删除");
            navigate("/dashboard");
        } catch (error) {
            toast.error("删除题库失败");
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("已退出登录");
    };

    return (
        <div className="w-64 h-screen bg-gray-950 border-r border-gray-800 flex flex-col">
            {/* 顶部标题 */}
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white">题库助手</h1>
            </div>

            {/* 题库列表 */}
            <div className="flex-1 overflow-auto py-4">
                <div className="px-4 mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-400">我的题库</h2>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                                <DialogTitle className="text-white">创建新题库</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddBank} className="space-y-4">
                                <Input
                                    placeholder="题库名称"
                                    value={newBankName}
                                    onChange={(e) => setNewBankName(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                                <Button type="submit" className="w-full">创建</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-1">
                    {banks.map((bank) => (
                        <div key={bank.id} className="group px-2 flex items-center">
                            <Link
                                to={`/bank/${bank.id}`}
                                className={cn(
                                    "flex-1 flex items-center px-2 py-1.5 text-sm rounded-md",
                                    location.pathname === `/bank/${bank.id}`
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                {bank.name}
                            </Link>
                            <div className="flex opacity-0 group-hover:opacity-100">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                        setEditingBank(bank);
                                        setNewBankName(bank.name);
                                        setIsEditDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500"
                                    onClick={() => handleDeleteBank(bank.id)}
                                >
                                    <Trash className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 编辑题库对话框 */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">编辑题库</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditBank} className="space-y-4">
                        <Input
                            placeholder="题库名称"
                            value={newBankName}
                            onChange={(e) => setNewBankName(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button type="submit" className="w-full">保存</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 底部按钮 */}
            <div className="p-4 border-t border-gray-800 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    设置
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    退出
                </Button>
            </div>
        </div>
    );
}