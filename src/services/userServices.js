
import { API_ENDPOINTS } from '@/api/userAPI';
import { get, post } from '@/utils/util';
import { getSession } from "@/services/headerServices";
import { ElMessage, ElMessageBox } from "element-plus";

//用户信息更新
export const fetchSaveInfo = async (role, params) => {
    try {

        const timestamp = new Date().getTime();
        const param = {
            ...params,
            t: timestamp
        }
        const response = await await post(`${role}/update`, params);
        return response.code
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
//收藏列表
export const fetchFavorList = async (params, page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

        const response = await get(API_ENDPOINTS.favorListAPI, {
            ...params,
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

//购物车
export const fetchCartList = async (page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

        const response = await get(API_ENDPOINTS.cartListAPI, {
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

//购物车 数量
export const fetchCartUpdate = async (params) => {
    try {
        const response = await post(API_ENDPOINTS.cartUpdateAPI, params);
        // console.log(response.data)
        return response.code
    } catch (error) {
        console.error('Error fetching Cart Update:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//购物车 del 
export const fetchCartDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.cartDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//订单 list orderAPI
export const fetchOrderList = async (params, page, limit) => {
    try {
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const response = await get(API_ENDPOINTS.orderAPI, {
            ...params,
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

// 订单 update
export const fetchOrderUpdate = async (params) => {
    try {
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const timestamp = new Date().getTime();
        const res = await post(API_ENDPOINTS.orderUpdateAPI, { ...params, t: timestamp, userid });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//订单add 
export const fetchOrderAdd = async (params) => {
    try {
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const timestamp = new Date().getTime();
        const res = await post(API_ENDPOINTS.ordersAddAPI, { ...params, t: timestamp, userid });
        const userInfo = await getSession()
        if (userInfo.money < params.total) {
            ElMessage({
                message: "余额不足，请充值！",
                type: "warning",
            });
            return 1;
        } else {
            //更新余额
            const newuserInfo = {
                ...userInfo,
                money: userInfo.money - params.total
            }
            const sessionTable = localStorage.getItem("sessionTable"); //

            const resSaveUserinfo = await fetchSaveInfo(sessionTable,newuserInfo);
            console.log(resSaveUserinfo)
            if (resSaveUserinfo == 0) {
                console.log('更新金额')

                // 更新状态 已支付
                await fetchOrderList({
                    orderid: params.orderid,
                    page: 1,
                    limit: 1,
                }).then(async (res) => {
                    const t = new Date().getTime();
                    let order = { ...params, id: res.list[0].id, status: '已支付', t, userid }
                    const a = await fetchOrderUpdate(order)
                })

            }
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//退款接口
export const fetchRefond = async (itm) => {
    console.log('获取商品idd')
    let res = await post(API_ENDPOINTS.spInfo1API + '/' + itm.goodid, { t: new Date().getTime() })
    let data = res.data;
    let info = await getSession()
    // 如果该商品存在积分
    if (data.jifen) {
        info.jifen = Number(info.jifen) - Number(data.jifen * itm.buynumber);
    }
    info.money = Number(info.money) + Number(itm.total);
    // 更新用户余额
    const sessionTable = localStorage.getItem("sessionTable"); //
    const ressave = await fetchSaveInfo(sessionTable,info)
    if (ressave == 0) {
        console.log('更新金额')
        const response = await fetchOrderUpdate({ ...itm, status: '已退款' })
        console.log('response', response)
        return response
    }

}