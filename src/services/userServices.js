
import { API_ENDPOINTS } from '@/api/userAPI';
import { get, post } from '@/utils/util';

//用户信息更新
export const fetchSaveInfo = async (params) => {
    try {
        const timestamp = new Date().getTime();
        const param = {
            ...params,
            t: timestamp
        }
        const response = await await post(API_ENDPOINTS.userUpdateAPI, params);
        console.log(param)
        return 0
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};


// 获取地址
export const fetchAddressList = async (page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

        const response = await get(API_ENDPOINTS.addressAPI, {
            page,
            limit,
            t: timestamp,
            userid
        });
        // console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 获取地址 add

export const fetchAddressAdd = async (params) => {
    try {
        console.log(params)
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

        const res = await post(API_ENDPOINTS.addressAddAPI, { ...params, t: timestamp, userid });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//地址 update
export const fetchAddressUpd = async (params) => {
    try {
        console.log(params)
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

        const res = await post(API_ENDPOINTS.addressUpdAPI, { ...params, t: timestamp, userid });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 获取地址 del
export const fetchAddressDel = async (params) => {
    try {
        console.log(params)
        const res = await post(API_ENDPOINTS.addressDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};