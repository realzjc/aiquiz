import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

// 定义用户类型
interface User {
    id: string;
    email: string;
    name?: string;
    // 其他用户属性...
}

// 定义认证上下文类型
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 创建提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 初始化时检查是否已登录
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // 验证 token 并获取用户信息
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token 无效，清除存储
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // 登录函数
    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    // 登出函数
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // 刷新用户信息
    const refreshUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to refresh user data', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// 创建自定义钩子
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
