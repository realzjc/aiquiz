import axios from 'axios';
import API_BASE from './api'; // 例如 http://localhost:8000/api/v1

export async function loginUser(email, password) {
    const formData = new FormData();
    formData.append('username', email);  // FastAPI 的 OAuth2PasswordRequestForm 需要用 username 字段
    formData.append('password', password);

    const res = await axios.post(`${API_BASE}/auth/login`, formData);
    return res.data;
}

export async function registerUser(email, password) {
    const res = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
    });
    return res.data;
}
