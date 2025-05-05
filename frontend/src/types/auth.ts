// src/types/auth.ts

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user_id: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<User | null>;
}