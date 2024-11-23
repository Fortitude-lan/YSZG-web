<template>
  <div class="page">
    <el-carousel height="250px">
      <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
        <img
          :src="image"
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </el-carousel-item>
    </el-carousel>
    <!-- 侧边栏 -->
    <nav class="menu">
      <ul class="menu-list">
        <li
          :class="
            isActive(route.path) ? 'menu-item curNav' : 'menu-item nav-item'
          "
          v-for="(route, index) in ucenterRoutList"
          :key="index"
        >
          <router-link :to="route.path">
            <span> <component :is="route.icon" />{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 内容区域 -->
    <main class="container">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/front/ucenter' }"
          >当前位置：个人中心</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: route.path }">{{
          route.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 子路由渲染区域 -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getFrontendRoutes } from "@/router/index";
import { CiStar } from "vue3-icons/ci";
import { fetchCarouselImages } from "@/services/homeServices";
const carouselImages = ref({}); // 用于存放轮播图的数组
const routList = getFrontendRoutes()
  .filter((i) => i.path == "ucenter")[0]
  .children.filter((child) => child.show === true);
console.log(routList);
const ucenterRoutList = [
  { path: "/front/ucenter", name: "个人信息", icon: CiStar }, // 补充第一个路由
  ...routList.flatMap((child) => ({
    path: `/front/ucenter/${child.path}`, // 使用绝对路径
    name: child.name,
    icon: child.icon,
  })),
];
const route = useRoute();
const isActive = (path) => {
  return route.path === path; // 判断当前路由是否与链接路径相同
};
const fetchData = async () => {
  //获取menu
  carouselImages.value = await fetchCarouselImages(); // 获取轮播图数据
};
// 在组件挂载时调用
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.page {
  margin-top: 59px;
}
.menu {
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 250px;
  left: 50px;
  transition: all 0.45s ease-in-out;
  width: 120px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 使菜单居中 */
  list-style: none;
  padding: 0;
  margin: 0;

  border: 1px solid #ccc; // gray-700
  width: 100%;
  background-color: #fff;
  border-radius: 1rem;
  //   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.5s ease-in-out;
}

.menu-item {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  height: 4rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  color: #000;
  &:hover {
    svg {
      transform: scale(1.25);
      fill: #8b7add; // blue-400
      color: #8b7add;
      transition: 0.2s 0.1s;
    }
    span {
      transform: scale(1.1);
      font-weight: bold;
      transition: 0.2s 0.1s;
      color: #8b7add;
    }
  }
  a {
    text-decoration: none;
  }
  span {
    display: flex;
    align-items: center;
  }
}

.curNav,
.nav-item:hover {
  border-radius: 20px;
  //   transform: scale(1.25);
  transition: 0.2s 0.1s;
  box-shadow: 0 7px 10px -5px #8d91df;
  svg {
    transform: scale(1.25);
    fill: #8b7add; // blue-400
    color: #8b7add;
    transition: 0.2s 0.1s;
  }
  span {
    transform: scale(1.1);
    font-weight: bold;
    transition: 0.2s 0.1s;
    color: #8b7add;
  }
}
.container {
  //   background: rgb(246, 246, 255);
  padding: 20px;
  //   height: 300px;
  max-width: 1000px;
  margin: 0 auto;
}
.breadcrumb {
  margin: 0 0 30px;
}
</style>
