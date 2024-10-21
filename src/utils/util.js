import axios from 'axios';

// 创建 Axios 实例
const http = axios.create({
    baseURL: '/YSZG', // 替换为你的 API 基础 URL
    timeout: 10000, // 请求超时设置
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // 可以在这里添加 Authorization 头或其他请求配置
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        return response.data; // 返回响应数据
    },
    error => {
        return Promise.reject(error);
    }
);
export default http;

// 封装 GET 请求
export const get = async (url, params = {}) => {
    return await http.get(url, { params });
};

// 封装 POST 请求
export const post = async (url, data = {}) => {
    return await http.post(url, data);
};

// 其他 HTTP 方法可以在这里添加