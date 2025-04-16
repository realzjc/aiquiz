// // src/components/common/ProtectedRoute.tsx
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext'; // 注意路径

// export default function ProtectedRoute({ children }) {
//     const { isAuthenticated, loading } = useAuth();

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return isAuthenticated ? children : <Navigate to="/login" />;
// };

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
