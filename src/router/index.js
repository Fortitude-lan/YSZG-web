

import { createRouter, createWebHistory } from 'vue-router'
// import Home from '@/views/Home.vue'
import Index from '@/views/index.vue'
//首页
import Home from '@/views/user/Home.vue'
//展馆
import ArtworkGallery from '@/views/user/ArtworkGallery.vue'

// import Login from '@/views/login.vue'
import NotFound from '@/views/404.vue'
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


// 提取前端路由的函数
export const getFrontendRoutes = () => {
    const frontRoute = routes.find(route => route.path === '/front');
    return frontRoute ? frontRoute.children.filter(child => child.show === true) : [];
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
                meta: { icon: '', title: 'center' }
            },
            {
                path: 'artworkGallery',
                name: '艺术品展馆',
                show: true,
                component: ArtworkGallery
            }
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
    // {
    //     path: '/login',
    //     name: 'login',
    //     component: Login,
    //     meta: { icon: '', title: 'login' }
    // },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: register,
    //     meta: { icon: '', title: 'register' }
    // },
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

export default router
