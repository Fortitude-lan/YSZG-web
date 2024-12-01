export const API_ENDPOINTS = {
  lunbotuAPI: '/config/list', //轮播图接口
  newsAPI: '/news/list', //咨询接口
  loginAPI: '/yonghu/login', //登录接口
  spsortAPI: 'shangpinxinxi/autoSort',//商品推荐
  spListAPI: 'shangpinxinxi/list',//商品信息list
  spfenleiAPI: 'option/shangpinfenlei/shangpinfenlei',//商品信息分类list
  spInfoAPI: 'shangpinxinxi/detail',//商品信息
  spInfo1API: 'shangpinxinxi/info',//商品信息
  chatAPI: '/chat/list',//聊天客服
  chatAddAPI: '/chat/add',//聊天
  userInfoAPI: '/yonghu/session',//用户信息
  userUpdateAPI: '/yonghu/update',//用户 update
  signUpYHAPI: 'yonghu/register',//注册
  addressAPI: 'address/list',//我的地址
  addressAddAPI: 'address/add',//我的地址 add
  addressUpdAPI: 'address/update',//我的地址 add
  addressDelAPI: 'address/delete',//我的地址 delete

  // 个人中心接口
  cartListAPI: 'cart/list',//购物车 list
  cartSaveAPI: 'cart/save',//购物车添加
  cartUpdateAPI: 'cart/update',//购物车 update
  cartDelAPI: 'cart/delete',//购物车[ids] del
  remarkListAPI: 'discussshangpinxinxi/list',//商品评论列表
  remarkSaveAPI: 'discussshangpinxinxi/save',//商品评论save
  favorListAPI: 'storeup/list',//收藏list
  isfavorAPI: 'storeup/isCollected',//收藏list
  favorSaveAPI: 'storeup/save',//收藏
  favorDelAPI: 'storeup/delete',//收藏取消 [ids]
  orderAPI: 'orders/list',//订单
  ordersAddAPI: 'orders/add',//订单 add
  orderUpdateAPI: 'orders/update',//订单 update


  //后端接口
  userListAPI: 'yonghu/page',//用户列表
  userAddAPI: 'yonghu/save',//用户add
  userDelAPI: 'yonghu/delete',//用户 删除
  userHMDAPI: 'yonghu/jiaru',//用户 黑名单
  userOFFHMDAPI: 'yonghu/quxiao',//用户 取消黑名单
  configListAPI: 'config/page',//系统 轮播图
  configAddAPI: 'config/save',//系统 轮播图
  configUpdateAPI: 'config/update',//系统 轮播图
  configDelAPI: 'config/delete',//系统 轮播图
  newsListAPI: 'news/page',//咨询 list
  newsAddAPI: 'news/save',//咨询 add
  newsUpdateAPI: 'news/update',//咨询 ip
  newsDelAPI: 'news/delete',//咨询 del
  categoryListAPI: 'shangpinfenlei/page',//分类 list
  categoryAddAPI: 'shangpinfenlei/save',//分类 add
  categoryUpdateAPI: 'shangpinfenlei/update',//分类 ip
  categoryDelAPI: 'shangpinfenlei/delete',//分类 del
  goodsListAPI: 'shangpinxinxi/page',//商品 list
  goodsAddAPI: 'shangpinxinxi/save',//商品 add
  goodsUpdateAPI: 'shangpinxinxi/update',//商品 ip
  goodsDelAPI: 'shangpinxinxi/delete',//商品 del
};