
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