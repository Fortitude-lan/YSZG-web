
//轮播图接口

import { API_ENDPOINTS } from '@/api/userAPI';
import { get, post } from '@/utils/util';

// 获取轮播图数据
export const fetchCarouselImages = async (page = 1, limit = 5) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.lunbotuAPI, { page, limit, t: timestamp });
        // console.log(response.data.list)
        return response.data.list
            .filter(item => item.name.includes('picture') && item.value)
            .map(item => item.value);

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

// 获取咨询数据
export const fetchNewsList = async (page, limit, order = 'desc') => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.newsAPI, { page, limit, t: timestamp });
        // console.log(response.data)
        return response.data
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
// 商品列表
export const fetchShangpinList = async (params, page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.spListAPI, { ...params, page, limit, t: timestamp });
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//商品分类
export const fetchSPFL = async () => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.spfenleiAPI, { t: timestamp });
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//商品评论list
export const fetchRemarkList = async (params, page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.remarkListAPI, { ...params, page, limit, t: timestamp });
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//保存评论
export const fetchRemarkSave = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.remarkSaveAPI, {
            ...params,
            t: new Date().getTime(),
        });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//收藏 list

export const fetchFavorList = async (params, page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const response = await get(API_ENDPOINTS.favorListAPI, { ...params, page, limit, t: timestamp });
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//添加收藏
export const fetchAddFavor = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.favorSaveAPI, {
            ...params,
            t: new Date().getTime(),
            tablename: 'shangpinxinxi',
        });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//是否收藏
export const fetchIsFavor = async (params) => {
    try {
        const response = await get(API_ENDPOINTS.isfavorAPI, params);
        return response
    } catch (error) {
        console.error('Error fetching collected:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//取消收藏

export const fetchDelFavor = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.favorDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};