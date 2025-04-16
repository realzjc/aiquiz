// // ✅ Tailwind + shadcn/ui 重构版 Login.jsx
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { loginUser } from '../services/auth';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         try {
//             await loginUser(email, password);
//             login();
//             navigate('/home');
//         } catch (err) {
//             setError('登录失败: ' + (err.response?.data?.detail || '请检查您的凭据'));
//             console.error(err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
//             <Card className="w-full max-w-md shadow-md">
//                 <CardContent className="p-6">
//                     <h2 className="text-center text-2xl font-bold mb-6">Welcome Back</h2>

//                     {error && (
//                         <p className="text-red-500 text-sm text-center mb-4">{error}</p>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium mb-1">Email</label>
//                             <Input
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Password</label>
//                             <Input
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         <Button type="submit" className="w-full">
//                             Log In
//                         </Button>
//                     </form>

//                     <p className="text-center text-sm text-gray-600 mt-6">
//                         Don't have an account?{' '}
//                         <Link to="/register" className="text-blue-600 hover:underline">
//                             Register
//                         </Link>
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { loginUser } from '@/services/auth';
// import '../Login.css'; // 引入对应的CSS文件

// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         try {
//             await loginUser(email, password);
//             login();
//             navigate('/home');
//         } catch (err) {
//             setError('登录失败: ' + (err.response?.data?.detail || '请检查您的凭据'));
//             console.error(err);
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-card">
//                 <h2 className="login-title">Welcome Back</h2>

//                 {error && (
//                     <p className="login-error">{error}</p>
//                 )}

//                 <form onSubmit={handleSubmit} className="login-form">
//                     <div className="form-group">
//                         <label className="form-label">Email</label>
//                         <input
//                             className="form-input"
//                             type="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Password</label>
//                         <input
//                             className="form-input"
//                             type="password"
//                             placeholder="Enter your password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <button type="submit" className="login-button">
//                         Log In
//                     </button>
//                 </form>

//                 <p className="register-link">
//                     Don't have an account?{' '}
//                     <Link to="/register">
//                         Register
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function Login() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
                <LoginForm />
            </div>
        </div>
    )
}