/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-11-22 00:07:06
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-27 13:06:46
 */
import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        console.log(params)
        const { role } = params
        const res = await get(`${role}/login`, { username: params.username, password: params.password });
        if (res.code === 0) {
            localStorage.setItem('Token', res.token);
            localStorage.setItem('sessionTable', role);
            if (role == 'users') {
                localStorage.setItem('role', '管理员');
                localStorage.setItem('loginTable', 'yonghu');
            } else if (role == 'yonghu') {
                localStorage.setItem('role', '用户');
                localStorage.setItem('userTable', 'yonghu');
            }
            getSession(role);
        }
        return res.code

    } catch (error) {
        console.error('Error fetching :', error);
        return error
        // throw error; // 抛出错误以供调用者处理
    }
};
// 获取用户 Session 的方法
export const getSession = async (role) => {
    try {
        // 发起请求，直接在请求头中带上 token
        const response = await get(`${role}/session`);
        console.log(response.code === 0, response.data)
        // 处理请求结果
        if (response.code === 0) {
            const sessionData = response.data;
            // 存储用户 session 信息到 localStorage
            localStorage.setItem("userid", sessionData.id);
            // 
            if (role == 'users') {
                localStorage.setItem("adminName", sessionData.username);
            } else if (role == 'yonghu') {
                localStorage.setItem('adminName', sessionData.yonghuming);
            }

            if (sessionData.vip) {
                localStorage.setItem("vip", sessionData.vip);
            }

            // 判断头像字段并存储
            // const headportrait = sessionData.touxiang || sessionData.headportrait || "";
            // localStorage.setItem("headportrait", headportrait);

            return response.data
        } else {
            console.error("Error fetching session data:", response.data.message);
        }
    } catch (error) {
        console.error("Error in getSession:", error);
    }
};
//修改密码
export const updateYSService = async (params) => {
    try {
        const time = new Date().getTime()
        console.log(params)
        const res = await post(API_ENDPOINTS.ysUpdateAPI, { ...params, addtime: time });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//注册

export const signUpService = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.signUpYHAPI, {
            ...params,
            t: new Date().getTime(),
        });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

// 科室信息
export const fetchKeshiPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.keshixinxiPageAPI, {
            ...params, page, limit, sort: 'id',
            order: 'desc'
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};