/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-24 09:28:24
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-24 10:26:11
 */
import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        const timestamp = new Date().getTime();
        const res = await get(API_ENDPOINTS.loginAPI, { ...params, role: 'yonghu', t: timestamp });
        console.log(res)
        if (res.code === 0) {
            localStorage.setItem('Token', res.token);
            localStorage.setItem('role', '用户');
            localStorage.setItem('userTable', params.role);
            localStorage.setItem('sessionTable', params.role);
            localStorage.setItem('adminName', params.username);
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};