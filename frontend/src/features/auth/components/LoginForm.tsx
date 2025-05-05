// src/features/auth/components/LoginForm.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/authService";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // 如果用户已登录，重定向到仪表盘
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 使用修改后的loginUser函数，它会使用FormData格式
            const response = await loginUser(email, password);

            // 使用 AuthContext 的 login 函数存储用户信息和状态
            login(response.access_token, {
                id: response.user_id,
                email: response.email,
            });

            toast.success("登录成功");
            navigate("/dashboard");
        } catch (err: any) {
            const detail = err?.response?.data?.detail;
            let msg = "登录失败，请重试";

            if (Array.isArray(detail)) {
                msg = detail.map((d: any) => d.msg).join("；");
            } else if (typeof detail === "string") {
                msg = detail;
            }

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
                        登录您的账户
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-4">
                            {/* 邮箱 */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-400">
                                    邮箱
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
                                        密码
                                    </Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-500 hover:text-blue-400"
                                    >
                                        忘记密码?
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
                            {isLoading ? "登录中..." : "登录"}
                        </Button>

                        <div className="text-center text-sm text-gray-400">
                            还没有账号?{" "}
                            <Link
                                to="/register"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                注册
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}