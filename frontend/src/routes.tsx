// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register'; // 👈 加这一行
import ProtectedRoute from '@/components/common/ProtectedRoute'; // 新增导入
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import QuickCreate from '@/pages/QuickCreate';
import Bank from '@/pages/bank/[bankId]';
import Layout from '@/layouts/Layout';
import Chat from '@/pages/Chat';
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
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/quick-create" element={<QuickCreate />} />
                    <Route path="/bank/:bankId" element={<Bank />} /> {/* 动态 bank 页面 */}
                    <Route path="/chat" element={<Chat />} /> {/* 动态 bank 页面 */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}