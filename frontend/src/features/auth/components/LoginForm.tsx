// src/features/auth/components/LoginForm.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { loginUser } from "@/features/auth/services/authService";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const { login, isAuthenticated } = useAuth();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // 如果用户已登录，重定向到仪表盘
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Login form submitted");

        try {
            // 使用修改后的loginUser函数，它会使用FormData格式
            const response = await loginUser(email, password);

            // 使用 AuthContext 的 login 函数存储用户信息和状态
            login(response.access_token, {
                id: response.user_id,
                email: response.email,
            });
            console.log("Login successful");
            toast.success("Login successful");
            navigate("/dashboard");
        } catch (err: any) {
            const detail = err?.response?.data?.detail;
            let msg = "Login failed. Please try again.";

            if (Array.isArray(detail)) {
                msg = detail.map((d: any) => d.msg).join("; ");
            } else if (typeof detail === "string") {
                msg = detail;
            }
            console.error("Login error:", msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-gray-950 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl text-center text-white">
                        Sign in to your account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-4">
                            {/* 邮箱 */}
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-400">
                                        Password
                                    </Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-500 hover:text-blue-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-900 text-white border border-gray-700"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>

                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
