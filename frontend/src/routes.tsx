// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register'; // 👈 加这一行
import ProtectedRoute from '@/components/common/ProtectedRoute'; // 新增导入
import Home from '@/pages/Home';;

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
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}