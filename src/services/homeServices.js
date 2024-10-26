/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-19 17:14:48
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-26 13:15:56
 */
//轮播图接口

import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';

// 获取轮播图数据
export const fetchCarouselImages = async (page = 1, limit = 5) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.lunbotuAPI, { page, limit, t: timestamp });
        console.log(response.data.list)
        return response.data.list
            .filter(item => item.name.includes('picture') && item.value)
            .map(item => item.value);

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

// 获取咨询数据
export const fetchNewsList = async (page = 1, limit = 2 * 2, order = 'desc') => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.newsAPI, { page, limit, t: timestamp });
        // console.log(response.data.list)
        return response.data.list
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//商品推荐
export const fetchShangpinSortList = async (page = 1) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.spsortAPI, { page, t: timestamp });
        // console.log(response.data.list)
        return response.data.list.slice(0, 5)
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};