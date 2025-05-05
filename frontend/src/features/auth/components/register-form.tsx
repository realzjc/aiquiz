"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast, Toaster } from "sonner"
interface RegisterFormProps extends React.ComponentPropsWithoutRef<"div"> { }

export function RegisterForm({ className, ...props }: RegisterFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // 自动清除错误提示
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 50000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("The passwords you entered do not match")
            return
        }

        try {
            await api.post("/auth/register", { email, password })
            toast.success("Registered successfully", {
                description: "You can now log in with your new account.",
            })
            navigate("/login")
        } catch (err: any) {
            const detail = err?.response?.data?.detail
            let msg = "Registration failed, please try again"
            if (Array.isArray(detail)) {
                msg = detail.map((d: any) => d.msg).join("；")
            } else if (typeof detail === "string") {
                msg = detail
            }
            toast.error(msg)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Toaster richColors position="top-right" />
            <Card className="bg-black text-white border border-gray-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="grid gap-6">
                        <div className="grid gap-4">
                            {/* 用户名 / 邮箱 */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-400">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-900 text-white placeholder-gray-600 border border-gray-700"
                                />
                            </div>

                            {/* 密码 */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-gray-400">
                                    Input Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-900 text-white placeholder-gray-600 border border-gray-700"
                                />
                            </div>

                            {/* 确认密码 */}
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password" className="text-gray-400">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-gray-900 text-white placeholder-gray-600 border border-gray-700"
                                />
                            </div>

                            {/* 提交按钮 */}
                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-gray-200 active:bg-gray-300 transition rounded-lg py-3 shadow"
                            >
                                Sign Up
                            </Button>
                        </div>

                        {/* 已有账号？跳转到登录 */}
                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="underline hover:text-gray-300">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
