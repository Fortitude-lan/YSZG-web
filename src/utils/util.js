import axios from 'axios';
export const baseUrl = '/YSZG'

// 创建 Axios 实例
const http = axios.create({
    baseURL: baseUrl, // 替换为你的 API 基础 URL
    timeout: 10000, // 请求超时设置
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        console.log('请求拦截')
        // 从 localStorage 获取 token
        const token = localStorage.getItem('Token'); // 假设 token 存储在 localStorage 中
        // console.log('token', token)

        // 如果 token 存在，添加 Authorization 头部
        if (token) {
            config.headers['Token'] = token; // 设置自定义 Token 头
            config.headers['x-requested-with'] = 'XMLHttpRequest';
        }
        // 可以在这里添加 Authorization 头或其他请求配置
        return config;
    },
    error => {
        console.log(error)
        return Promise.reject(error);
    }
);


// 响应拦截器
http.interceptors.response.use(
    response => {
        console.log('响应截器')

        if (response.data.code === 401) {
            console.error('未登录，跳转到登录页');
            // 清空本地存储
            localStorage.clear();
            window.location.href = '/login';
        }
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
/**
 * 生成订单
 */
export const genTradeNo = () => {
    var date = new Date();
    var tradeNo =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString() +
      date.getDate().toString() +
      date.getHours().toString() +
      date.getMinutes().toString() +
      date.getSeconds().toString() +
      date.getMilliseconds().toString();
    for (
      var i = 0;
      i < 5;
      i++ //5位随机数，用以加在时间戳后面。
    ) {
      tradeNo += Math.floor(Math.random() * 10);
    }
    return tradeNo;
  };
// 其他 HTTP 方法可以在这里添加