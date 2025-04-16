// import api from '@/services/api';

// export async function loginUser(email, password) {
//     const formData = new FormData();
//     formData.append('username', email);  // FastAPI 的 OAuth2PasswordRequestForm 需要用 username 字段
//     formData.append('password', password);

//     const res = await api.post('/auth/login', formData);
//     return res.data;
// }

// export async function registerUser(email, password) {
//     const res = await api.post('/auth/register', { email, password });
//     return res.data;
// }

// export async function logoutUser() {
//     const res = await api.post('/auth/logout');
//     return res.data;
// }

// export async function checkAuthStatus() {
//     try {
//         const res = await api.get('/users/me');
//         return { isAuthenticated: true, user: res.data };
//     } catch (error) {
//         return { isAuthenticated: false, user: null };
//     }
// }

import api from "@/services/api";

// 用户类型（根据后端返回结构自定义）
export interface User {
    id: number;
    email: string;
    // ...其他字段，按需添加
}

// 登录：返回 token 或其他认证信息
export async function loginUser(email: string, password: string): Promise<any> {
    const formData = new FormData();
    formData.append("username", email); // FastAPI 默认用 username 字段
    formData.append("password", password);

    const res = await api.post("/auth/login", formData);
    return res.data; // 你可以改成 Promise<{ token: string }> 等明确类型
}

// 注册：返回用户信息或状态
export async function registerUser(
    email: string,
    password: string
): Promise<User> {
    const res = await api.post("/auth/register", { email, password });
    return res.data;
}

// 登出：返回状态
export async function logoutUser(): Promise<any> {
    const res = await api.post("/auth/logout");
    return res.data;
}

// 检查登录状态：返回登录状态和用户信息
export async function checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: User | null;
}> {
    try {
        const res = await api.get<User>("/users/me");
        return { isAuthenticated: true, user: res.data };
    } catch (error) {
        return { isAuthenticated: false, user: null };
    }
}
