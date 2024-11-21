
import { API_ENDPOINTS } from '@/api/userAPI';
import { get, post } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        const timestamp = new Date().getTime();
        const res = await get(API_ENDPOINTS.loginAPI, { ...params, role: 'yonghu', t: timestamp });
        console.log(res)
        console.log(params)
        if (res.code === 0) {
            localStorage.setItem('Token', res.token);
            localStorage.setItem('role', '用户');
            localStorage.setItem('userTable', 'yonghu');
            localStorage.setItem('sessionTable', '用户');
            localStorage.setItem('adminName', params.username);
            getSession()
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//聊天
export const fetchChat = async () => {
    getSession();
    try {
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.chatAPI, {
            userid: userid,
            sort: "addtime",
            order: "asc",
            t: timestamp
        });
        console.log(response)
        if (response.code === 0) {
            return response.data.list
        } else {
            return []
        }
    } catch (error) {
        console.error("Error fetching chat:", error);
        throw error;
    }
};
export const fetchAddChat = async (ask) => {
    const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
    try {
        const timestamp = new Date().getTime();
        const params = {
            ask,
            userid,
            t: timestamp
        }
        const response = await await post(API_ENDPOINTS.chatAddAPI, params);
        console.log(response)
        return 1
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// 获取用户 Session 的方法
export const getSession = async () => {
    try {
        // 发起请求，直接在请求头中带上 token
        const response = await get(API_ENDPOINTS.userInfoAPI);
        console.log(response.code === 0, response.data)

        // 处理请求结果
        if (response.code === 0) {
            const sessionData = response.data;
            // 存储用户 session 信息到 localStorage
            localStorage.setItem("userid", sessionData.id);

            return response.data
        } else {
            console.error("Error fetching session data:", response.data.message);
        }
    } catch (error) {
        console.error("Error in getSession:", error);
    }
};