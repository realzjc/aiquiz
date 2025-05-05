// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register'; // 👈 加这一行
import { ProtectedRoute } from '@/components/common/ProtectedRoute'; // 新增导入
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import QuickCreate from '@/features/chat/pages/QuickCreate';
import Bank from '@/features/bank/pages/bank/[bankId]';
import Layout from '@/layouts/Layout';
import TermsOfService from '@/features/auth/pages/TermsOfService';
import PrivacyPolicy from '@/features/auth/pages/PrivacyPolicy';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<Layout />}>
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/quick-create" element={<ProtectedRoute><QuickCreate /></ProtectedRoute>} />
                    <Route path="/bank/:bankId" element={<ProtectedRoute><Bank /></ProtectedRoute>} /> {/* 动态 bank 页面 */}
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
        </BrowserRouter >
    );
}