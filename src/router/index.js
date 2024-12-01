

import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'; // 引入 Vuex store



// import Home from '@/views/Home.vue'
// 布局
import Index from '@/views/user/index.vue'
import BackIndex from '@/views/admin/index.vue'

/* ***********前台 start************ */

//首页
import Home from '@/views/user/Home.vue'
//展馆
import ArtworkGallery from '@/views/user/ArtworkGallery.vue'
//咨询
import News from '@/views/user/News.vue'
import NewsDetail from '@/views/user/NewsDetail.vue'
//客服
import Chat from '@/views/user/Chat.vue'
//商品信息
import ArtList from '@/views/user/ArtList.vue';
import ArtDetail from '@/views/user/ArtDetail.vue';

//个人中心
import UserCen from '@/views/user/UserCen.vue';
import UInfo from '@/views/user/usercenter/UInfo.vue';
import Order from '@/views/user/usercenter/Order.vue';
import Address from '@/views/user/usercenter/Address.vue';
import Favor from '@/views/user/usercenter/Favor.vue';
import Cart from '@/views/user/usercenter/Cart.vue';

/* ***********前台 end************ */


/* ***********后台 start************ */
import Login from '@/views/admin/Login.vue'
//首页
import HomeBack from '@/views/admin/Home.vue'
//账号管理--密码
import UserCenter from '@/views/admin/UserCenter.vue'
//账号管理--个人信息
import UserInfo from '@/views/admin/UserInfo.vue'

//用户管理--用户
import UserManag from '@/views/admin/UserManag.vue'
//用户管理--黑名单
import UserManagBlack from '@/views/admin/UserManagBlack.vue'
//系统管理--轮播图
import SystemPicture from '@/views/admin/SystemPicture.vue'


/* ***********后台 end************ */

import NotFound from '@/views/404.vue'
// import Login from '@/views/login.vue'
// import UpdatePassword from '@/views/update-password.vue'
// import pay from '@/views/pay.vue'
// import register from '@/views/register.vue'
// import center from '@/views/center.vue'
// import news from '@/views/modules/news/list.vue'
// import shangpinpingjia from '@/views/modules/shangpinpingjia/list.vue'
// import yonghu from '@/views/modules/yonghu/list.vue'
// import shangpinfenlei from '@/views/modules/shangpinfenlei/list.vue'
// import chat from '@/views/modules/chat/list.vue'
// import discussshangpinxinxi from '@/views/modules/discussshangpinxinxi/list.vue'
// import shangpinxinxi from '@/views/modules/shangpinxinxi/list.vue'
// import orders from '@/views/modules/orders/list.vue'
// import storeup from '@/views/modules/storeup/list.vue'
// import config from '@/views/modules/config/list.vue'
// import heimingdan from '@/views/modules/heimingdan/list.vue'


//图标
import { IoFileTray } from "vue3-icons/io5";
import { RiCustomerService2Line } from "vue3-icons/ri";
import { CiStar } from "vue3-icons/ci";
import { LiaAddressBook } from "vue3-icons/lia";
import { CiShoppingCart } from "vue3-icons/ci";
// 提取前端路由的函数
export const getFrontendRoutes = () => {
    const frontRoute = routes.find(route => route.path === '/front');
    return frontRoute ? frontRoute.children.filter(child => child.show === true) : [];
};
export const getBackRoutes = () => {
    const backRoute = routes.find(route => route.path === '/back');
    return backRoute ? backRoute.children.filter(child => child.show === true) : [];
};

//2.配置路由  

const routes = [
    {
        path: '/front',
        name: '首页',
        component: Index,
        children: [
            {
                // 这里不设置值，是把main作为默认页面
                path: '',
                name: '首页',
                component: Home,
                icon: IoFileTray
            },
            {
                path: 'artworkGallery',
                name: '艺术品展馆',
                show: true,
                component: ArtworkGallery,
                icon: IoFileTray
            },

            {
                path: 'artlist',
                name: '艺术品列表',
                show: true,
                component: ArtList,
            },
            {
                path: 'artdetail/:id', // 动态路由参数 :id
                name: '艺术品详情', // 详情
                component: ArtDetail,
                props: true // 将动态路由参数传递给组件
            },
            {
                path: 'news',
                name: '最新咨询',
                show: true,
                component: News,
                icon: IoFileTray
            },
            {
                path: 'newsdetail/:id', // 动态路由参数 :id
                name: '咨询详情', // 详情
                component: NewsDetail,
                props: true // 将动态路由参数传递给组件
            },
            {
                path: 'chat',
                name: '智能客服',
                meta: { requiresAuth: true },
                show: true,
                component: Chat,
                icon: RiCustomerService2Line
            },
            {
                path: 'ucenter',
                name: '个人中心',
                show: true,
                meta: { requiresAuth: true },
                component: UserCen,
                icon: IoFileTray,
                children: [
                    {
                        // 这里不设置值，是把main作为默认页面
                        path: '',
                        name: '个人详情',
                        component: UInfo,
                        icon: CiStar
                    },
                    {
                        path: 'cart',
                        name: '购物车车',
                        show: true,
                        component: Cart,
                        icon: CiShoppingCart
                    },
                    {
                        path: 'favor',
                        name: '我的收藏',
                        show: true,
                        component: Favor,
                        icon: CiStar
                    },
                    {
                        path: 'order',
                        name: '个人订单',
                        show: true,
                        component: Order,
                        icon: IoFileTray
                    },
                    {
                        path: 'address',
                        name: '地址管理',
                        show: true,
                        component: Address,
                        icon: LiaAddressBook
                    },
                ]
            },

            // {
            //     path: '/updatePassword',
            //     name: '修改密码',
            //     component: UpdatePassword,
            //     meta: { icon: '', title: 'updatePassword' }
            // }, {
            //     path: '/pay',
            //     name: '支付',
            //     component: pay,
            //     meta: { icon: '', title: 'pay' }
            // }, {
            //     path: '/center',
            //     name: '个人信息',
            //     component: center,
            //     meta: { icon: '', title: 'center' }
            // }
            //     , {
            //     path: '/heimingdan',
            //     name: '黑名单',
            //     component: heimingdan
            // }
            //     , {
            //     path: '/news',
            //     name: '商品资讯',
            //     component: news
            // }
            //     , {
            //     path: '/shangpinpingjia',
            //     name: '商品评价',
            //     component: shangpinpingjia
            // }
            //     , {
            //     path: '/yonghu',
            //     name: '用户',
            //     component: yonghu
            // }
            //     , {
            //     path: '/shangpinfenlei',
            //     name: '商品分类',
            //     component: shangpinfenlei
            // }
            //     , {
            //     path: '/chat',
            //     name: '客服管理',
            //     component: chat
            // }
            //     , {
            //     path: '/discussshangpinxinxi',
            //     name: '商品信息评论',
            //     component: discussshangpinxinxi
            // }
            //     , {
            //     path: '/shangpinxinxi',
            //     name: '商品信息',
            //     component: shangpinxinxi
            // }
            //     , {
            //     path: '/orders/:status',
            //     name: '订单管理',
            //     component: orders
            // }
            //     , {
            //     path: '/storeup',
            //     name: '心愿单管理',
            //     component: storeup
            // }
            //     , {
            //     path: '/config',
            //     name: '轮播图管理',
            //     component: config
            // }
        ]
    },
    {
        path: '/back',
        name: '后台',
        component: BackIndex,
        meta: { requiresAuth: true },
        children: [{
            // 这里不设置值，是把main作为默认页面
            path: '',
            name: '系统首页',
            component: HomeBack,
            icon: ''
        },
        {
            path: 'systemanagement',
            name: '系统管理',
            show: true,
            icon: IoFileTray,
            children: [{
                path: 'index',
                name: '轮播图管理',
                component: SystemPicture,
                icon: ''
            },
            {
                path: 'newsmanag',
                name: '咨询管理',
                component: UserInfo,
                icon: ''
            },
            {
                path: 'newsmanag',
                name: '客服管理',
                component: UserInfo,
                icon: ''
            }]
        },
        {
            path: 'usercenter',
            name: '账号管理',
            show: true,
            icon: IoFileTray,
            children: [{
                path: 'index',
                name: '修改密码',
                component: UserCenter,
                icon: ''
            },
            {
                path: 'userinfo',
                name: '个人信息',
                component: UserInfo,
                icon: ''
            }]
        },
        {
            path: 'usermanagement',
            name: '用户管理',
            show: true,
            icon: IoFileTray,
            children: [{
                path: 'index',
                name: '用 户',
                component: UserManag,
                icon: ''
            },
            {
                path: 'userblacklist',
                name: '黑名单',
                component: UserManagBlack,
                icon: ''
            }]
        }]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        show: true,
        icon: IoFileTray,
    },
    {
        path: '/',
        redirect: '/front', // 默认跳转到 /index
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
import { ElMessage } from "element-plus";

// 路由守卫
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem("adminName"); // 直接从 localStorage 获取角色信息
    const isLoggedIn = !!role; // 判断用户是否登录
    store.commit('setLoginState', { isLoggedIn, username: isLoggedIn ? role : '' }); // 

    console.log('s守卫', to.meta.requiresAuth && !isLoggedIn)
    // console.log(' to.meta.requiresAuth', to)
    // console.log(' to.meta.requiresAuth', to.meta.requiresAuth)
    // console.log('!isLoggedIn', !isLoggedIn)
    if (to.meta.requiresAuth && !isLoggedIn) {
        ElMessage({
            message: "无权访问,请登录!",
            type: "error",
        });
        next({ path: '/front' }); // 如果需要认证且未登录，重定向到登录页
    } else {
        next(); // 否则正常导航
    }
});
export default router
// console.log(router.getRoutes());

