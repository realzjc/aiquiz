import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast, Toaster } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()

    // 如果用户已登录，重定向到仪表盘
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard")
        }
    }, [isAuthenticated, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            })

            // 使用 AuthContext 的 login 函数存储用户信息和状态
            login(response.data.access_token, {
                id: response.data.user_id,
                email: response.data.email,
                // 其他用户数据...
            })
            console.log("login success")
            console.log(response.data)
            toast.success("Login successful")
            navigate("/dashboard")
        } catch (err: any) {
            const detail = err?.response?.data?.detail
            let msg = "Login failed. Please try again."
            console.log(detail)
            if (Array.isArray(detail)) {
                msg = detail.map((d: any) => d.msg).join("；")
            } else if (typeof detail === "string") {
                msg = detail
            } else {
                msg = "Login failed"
            }
            toast.error(msg)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Toaster richColors position="top-right" />

            <Card className="bg-black text-white border border-gray-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-6">
                        <div className="grid gap-4">
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
                                    disabled={isLoading}
                                    className="bg-gray-900 text-white placeholder-gray-600 border border-gray-700"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-gray-400">
                                        Password
                                    </Label>
                                    <Link
                                        to="/forgot-password"
                                        className="ml-auto text-sm text-gray-500 hover:text-gray-300"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-gray-900 text-white placeholder-gray-600 border border-gray-700"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black hover:bg-gray-200 active:bg-gray-300 transition rounded-lg py-3 shadow"
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="underline hover:text-gray-300">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-center text-xs text-gray-500">
                By clicking continue, you agree to our <br />
                <Link to="/terms-of-service" className="underline hover:text-gray-300">
                    Terms of Service
                </Link>
                and{' '}
                <Link to="/privacy-policy" className="underline hover:text-gray-300">
                    Privacy Policy
                </Link>.
            </div>
        </div>
    )
}
