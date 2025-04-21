// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register'; // 👈 加这一行
import { ProtectedRoute } from '@/components/common/ProtectedRoute'; // 新增导入
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import QuickCreate from '@/pages/QuickCreate';
import Bank from '@/pages/bank/[bankId]';
import Layout from '@/layouts/Layout';
import Chat from '@/pages/Chat';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ForgotPassword from '@/pages/ForgotPassword';

// export default function AppRoutes() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<Navigate to="/login" />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route
//                     path="/home"
//                     element={
//                         <ProtectedRoute>
//                             <Home />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route path="/register" element={<Register />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }

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
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} /> {/* 动态 bank 页面 */}
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
        </BrowserRouter >
    );
}