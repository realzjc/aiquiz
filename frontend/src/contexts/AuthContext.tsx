// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '@/services/api';
// import {
//     checkAuthStatus,
//     logoutUser,
// } from '@/services/auth';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true); // ✅ 关键点：防止无限渲染

//     // 页面加载/刷新时恢复登录状态
//     useEffect(() => {
//         async function restoreSession() {
//             const { isAuthenticated, user } = await checkAuthStatus();
//             setIsAuthenticated(isAuthenticated);
//             setUser(user);
//             setLoading(false); // ✅ 完成加载
//         }

//         restoreSession();
//     }, []);

//     const login = () => {
//         // 登录成功后，实际身份状态将由 useEffect 中 /users/me 确认
//         setIsAuthenticated(true);
//     };

//     // const logout = async () => {
//     //     await api.post('/auth/logout');
//     //     setIsAuthenticated(false);
//     //     setUser(null);
//     // };
//     const logout = async () => {
//         try {
//             await logoutUser();
//         } catch (e) {
//             console.warn('Logout failed or already expired');
//         } finally {
//             setIsAuthenticated(false);
//             setUser(null);
//         }
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";
import { checkAuthStatus, logoutUser } from "@/services/auth";

// ✅ 定义类型
interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    logout: () => Promise<void>;
    loading: boolean;
}

// ✅ 声明上下文类型
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            const { isAuthenticated, user } = await checkAuthStatus();
            setIsAuthenticated(isAuthenticated);
            setUser(user);
            setLoading(false);
        }

        restoreSession();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.warn("Logout failed or already expired");
        } finally {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
