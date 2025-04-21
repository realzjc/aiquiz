import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // 如果正在加载，显示加载状态
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // 如果未认证，重定向到登录页面
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 已认证，显示子组件
    return <>{children}</>;
}