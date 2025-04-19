import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import React from "react";
// 设置选项类型
type SettingsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsProps) {
    // 用户设置状态
    const [username, setUsername] = useState("shadcn");
    const [email, setEmail] = useState("m@example.com");

    // 界面设置状态
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("中文");

    // 通知设置状态
    const [emailNotifications, setEmailNotifications] = useState(true);

    const handleSave = () => {
        // 保存设置逻辑
        console.log("保存设置", { username, email, theme, language, emailNotifications });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>设置</DialogTitle>
                    <DialogDescription>
                        调整您的账户和应用程序设置
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                    <div className="flex">
                        <TabsList className="flex-col h-auto mr-4 w-[150px]">
                            <TabsTrigger value="account" className="justify-start w-full">账户</TabsTrigger>
                            <TabsTrigger value="appearance" className="justify-start w-full">界面</TabsTrigger>
                            <TabsTrigger value="notifications" className="justify-start w-full">通知</TabsTrigger>
                            <TabsTrigger value="security" className="justify-start w-full">安全</TabsTrigger>
                        </TabsList>

                        <div className="flex-1">
                            <TabsContent value="account" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            用户名
                                        </Label>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            邮箱
                                        </Label>
                                        <Input
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="appearance" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="theme" className="text-right">
                                            主题
                                        </Label>
                                        <select
                                            id="theme"
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            className="col-span-3 p-2 border rounded-md"
                                        >
                                            <option value="light">浅色</option>
                                            <option value="dark">深色</option>
                                            <option value="system">跟随系统</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="language" className="text-right">
                                            语言
                                        </Label>
                                        <select
                                            id="language"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="col-span-3 p-2 border rounded-md"
                                        >
                                            <option value="中文">中文</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email-notifications" className="text-right">
                                            邮件通知
                                        </Label>
                                        <div className="col-span-3 flex items-center">
                                            <input
                                                type="checkbox"
                                                id="email-notifications"
                                                checked={emailNotifications}
                                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span>接收邮件通知</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="current-password" className="text-right">
                                            当前密码
                                        </Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="new-password" className="text-right">
                                            新密码
                                        </Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleSave}>保存更改</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}