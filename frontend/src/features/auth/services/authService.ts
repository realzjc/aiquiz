// src/features/auth/services/authService.ts
import api from '@/lib/api';
import { User, LoginResponse } from '@/types/auth';

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    // 使用FormData格式发送请求
    const formData = new FormData();
    formData.append('username', email);  // FastAPI需要username字段
    formData.append('password', password);

    const response = await api.post('/auth/login', formData);
    return response.data;
}

export async function registerUser(email: string, password: string, name?: string): Promise<User> {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
}