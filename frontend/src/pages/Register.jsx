import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/auth'; // ⬅️ 加上这一行

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await registerUser(email, password);
            login(res.token); // 存到 context（自动登录）
            navigate('/home');
        } catch (err) {
            alert('Registration failed!');
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
            <h2 style={{ textAlign: 'center' }}>Create an Account</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            marginTop: '5px',
                        }}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            marginTop: '5px',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        marginTop: '20px',
                        backgroundColor: '#0f766e',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        border: 'none',
                    }}
                >
                    Register
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}
