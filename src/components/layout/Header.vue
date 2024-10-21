<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-18 12:52:21
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-19 17:58:54
-->
<template>
  <header class="header">
    <div class="logo">LOGO</div>
    <nav class="menu">
      <ul class="menu-list">
        <li
          class="menu-item"
          v-for="(route, index) in frontendMenuList"
          :key="index"
        >
          <router-link :to="route.path">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>
    <div class="auth">
      <button class="login">登录</button>
      <button class="register">注册</button>
    </div>
  </header>
</template>

<script>
import { getFrontendRoutes } from "@/router/index";
export default {
  setup() {
    const frontendRoutes = getFrontendRoutes();
    const frontendMenuList = [
      { path: "/front", name: "首页" }, // 补充第一个路由
      ...frontendRoutes.flatMap((child) => ({
        path: `/front/${child.path}`, // 使用绝对路径
        name: child.name,
      })),
    ];
    console.log(frontendMenuList);
    return { frontendMenuList };
  },
};
</script>

<style lang="scss" scoped>
/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.menu {
  flex-grow: 1;
}

.menu-list {
  display: flex;
  justify-content: center; /* 使菜单居中 */
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0 15px;
  cursor: pointer;
  a {
    color: #fff;
  }
}

.auth {
  display: flex;
}

.login,
.register {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.login:hover,
.register:hover {
  background-color: #0056b3;
}
</style>
