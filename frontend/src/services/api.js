// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// 使得代码在 本地/docker 都能运行
export default API_BASE;
