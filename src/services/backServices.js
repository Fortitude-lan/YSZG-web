
import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        console.log(params)
        const { role } = params
        let res;
        if (role == 'users')
            res = await post(`${role}/login?username=${params.username}&password=${params.password}`, { username: params.username, password: params.password });
        else
            res = await get(`${role}/login`, { username: params.username, password: params.password });

        if (res.code === 0) {
            localStorage.setItem('Token', res.token);
            localStorage.setItem('sessionTable', role);
            if (role == 'users') {
                localStorage.setItem('role', '管理员');
                localStorage.setItem('userTable', 'yonghu');
                // localStorage.setItem('loginTable', 'yonghu');
            } else if (role == 'yonghu') {
                localStorage.setItem('role', '用户');
                localStorage.setItem('userTable', 'yonghu');
            }
            getSession(role);
        }
        return res

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

//用户列表
export const fetchUserListPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.userListAPI, {
            ...params, page, limit, sort: 'id',
            heimd: 0
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户列表 黑名单
export const fetchUserBlackPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.userListAPI, {
            ...params, page, limit, sort: 'id',
            heimd: 1
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 add
export const fetchUserAdd = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.userAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 del
export const fetchUserDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.userDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 黑名单 add
export const fetchUserAddBlacklist = async (params) => {
    try {
        // console.log(params)
        const res = await get(API_ENDPOINTS.userHMDAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 黑名单 取消
export const fetchUserDelBlacklist = async (params) => {
    try {
        // console.log(params)
        const res = await get(API_ENDPOINTS.userOFFHMDAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 轮播图 list
export const fetchConfigListPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.configListAPI, {
            ...params, page, limit, sort: 'id',
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 轮播图 add
export const fetchConfigAdd = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.configAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 轮播图 update
export const fetchConfigUpdate = async (params) => {
    try {
        const response = await await post(API_ENDPOINTS.configUpdateAPI, params);
        return response.code
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// 轮播图  del
export const fetchConfigDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.configDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//  news list
export const fetchNewsListPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.newsListAPI, {
            ...params, page, limit, sort: 'id',
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// news add
export const fetchNewsAdd = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.newsAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// news update
export const fetchNewsUpdate = async (params) => {
    try {
        const response = await await post(API_ENDPOINTS.newsUpdateAPI, params);
        return response.code
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// news  del
export const fetchNewsDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.newsDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//  Category list
export const fetchCategoryListPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.goodsListAPI, {
            ...params, page, limit, sort: 'id',
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// Category update
export const fetchCategoryUpdate = async (params) => {
    try {
        const response = await await post(API_ENDPOINTS.categoryUpdateAPI, params);
        return response.code
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// Category  del
export const fetchCategoryDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.categoryDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// Category add
export const fetchCategoryAdd = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.categoryAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//  Goods list
export const fetchGoodsListPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.goodsListAPI, {
            ...params, page, limit, sort: 'id',
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// Goods add
export const fetchGoodsAdd = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.goodsAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// Goods update
export const fetchGoodsUpdate = async (params) => {
    try {
        const response = await await post(API_ENDPOINTS.goodsUpdateAPI, params);
        return response.code
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// Goods  del
export const fetchGoodsDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.goodsDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};