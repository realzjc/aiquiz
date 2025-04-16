// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL + '/api/v1',
//     timeout: 5000,
//     withCredentials: true, // ✅ 允许发送 cookie
// });

// let isRefreshing = false;

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // 避免无限循环请求 refresh
//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !isRefreshing
//         ) {
//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 // 尝试刷新 token
//                 await api.post('/auth/refresh');

//                 isRefreshing = false;
//                 // 重试原始请求
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 isRefreshing = false;

//                 // 如果 refresh 也失败（意味着登录无效）
//                 console.warn('Token refresh failed');
//                 // 不做 window.location.href，交由 AuthContext 处理
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;


import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// 扩展 AxiosRequestConfig，支持 _retry 字段
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/v1",
    timeout: 5000,
    withCredentials: true, // ✅ 发送 cookie
});

let isRefreshing = false;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshing
        ) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/auth/refresh");
                isRefreshing = false;
                return api(originalRequest); // 重试原请求
            } catch (refreshError) {
                isRefreshing = false;
                console.warn("Token refresh failed");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
