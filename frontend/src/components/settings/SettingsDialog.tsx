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

// Settings dialog props
type SettingsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsProps) {
    const [username, setUsername] = useState("shadcn");
    const [email, setEmail] = useState("m@example.com");
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("Chinese");
    const [emailNotifications, setEmailNotifications] = useState(true);

    const handleSave = () => {
        console.log("Saved settings", { username, email, theme, language, emailNotifications });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white text-black shadow-lg border border-gray-400">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Adjust your account and application preferences
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                    <div className="flex">
                        <TabsList className="flex-col h-auto mr-4 w-[150px]">
                            <TabsTrigger value="account" className="justify-start w-full">Account</TabsTrigger>
                            <TabsTrigger value="appearance" className="justify-start w-full">Appearance</TabsTrigger>
                            <TabsTrigger value="notifications" className="justify-start w-full">Notifications</TabsTrigger>
                            <TabsTrigger value="security" className="justify-start w-full">Security</TabsTrigger>
                        </TabsList>

                        <div className="flex-1">
                            <TabsContent value="account" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
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
                                            Email
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
                                            Theme
                                        </Label>
                                        <select
                                            id="theme"
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            className="col-span-3 p-2 border rounded-md"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                            <option value="system">System</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="language" className="text-right">
                                            Language
                                        </Label>
                                        <select
                                            id="language"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="col-span-3 p-2 border rounded-md"
                                        >
                                            <option value="Chinese">Chinese</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email-notifications" className="text-right">
                                            Email Notifications
                                        </Label>
                                        <div className="col-span-3 flex items-center">
                                            <input
                                                type="checkbox"
                                                id="email-notifications"
                                                checked={emailNotifications}
                                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span>Receive email updates</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="mt-0">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="current-password" className="text-right">
                                            Current Password
                                        </Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="new-password" className="text-right">
                                            New Password
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
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
