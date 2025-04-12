
import Sidebar from '../components/layouts/Sidebar';
import MainContent from '../components/layouts/MainContent';

export default function Home() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <MainContent />
        </div>
    );
}
// import { useNavigate } from 'react-router-dom';
// export default function Login() {
//     const navigate = useNavigate();

//     const handleLogin = () => {
//         // 假设你验证成功
//         navigate('/');
//     };

//     return (
//         <div>
//             <h1>登录页面</h1>
//             <button onClick={handleLogin}>登录并跳转首页</button>
//         </div>
//     );
// }