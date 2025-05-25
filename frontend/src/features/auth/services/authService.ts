// src/features/auth/services/authService.ts
import api from '@/lib/api';
import { User, LoginResponse } from '@/types/auth';

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    // 使用x-www-form-urlencoded格式发送请求
    const params = new URLSearchParams();
    params.append('username', email);  // FastAPI OAuth2需要username字段
    params.append('password', password);

    const response = await api.post('/auth/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response.data;
}

export async function registerUser(email: string, password: string, name?: string): Promise<User> {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
}

export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await api.get('/users/me');
        console.log('User data from API:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export async function forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
}