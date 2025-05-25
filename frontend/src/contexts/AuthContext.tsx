// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { getCurrentUser } from '@/features/auth/services/authService';
import api from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token 无效，清除存储
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // 登录函数
    const login = async (token: string, basicUserData: User) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);

        // 设置临时用户数据
        setUser(basicUserData);

        // 获取完整的用户信息
        try {
            const fullUserData = await getCurrentUser();
            setUser(fullUserData);
        } catch (error) {
            console.error('Failed to fetch complete user data:', error);
            // 保留基本用户数据，不影响登录流程
        }
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
            const userData = await getCurrentUser();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Failed to refresh user data', error);
            return null;
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

// 自定义钩子
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}