<template>
  <a-layout class="layout">
    <!-- 侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">LOGO</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :open-keys="openKeys"
        theme="dark"
        mode="inline"
        class="menu-list"
      >
        <template v-for="route in backMenuList" :key="route.path">
          <template v-if="route.children && route.children.length">
            <a-sub-menu :key="route.path">
              <template #title>
                <span>
                  <component :is="route.icon" />
                  <span>{{ route.name }}</span>
                </span>
              </template>
              <a-menu-item
                v-for="child in route.children"
                :key="`${route.path}/${child.path}`"
                :path="`${route.path}/${child.path}`"
              >
                <router-link :to="`${route.path}/${child.path}`">
                  <span>{{ child.name }}</span></router-link
                >
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="route.path">
              <router-link :to="`${route.path}`">
                <component :is="route.icon" />
                <span>{{ route.name }}</span>
              </router-link>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- header -->
      <a-layout-header class="layout-header">
        <div style="padding: 0 5px">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        <div class="title">
          <span class="tt"> 数字时代的艺术品展馆交易平台后台管理系统 </span>
          <el-dropdown placement="top-start">
            <div class="down">
              <el-avatar
                :icon="FaUserAstronaut"
                :size="35"
                :style="{ background: '#7378f5', marginRight: '10px' }"
              />
              <span>欢迎：{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link :to="{ path: '/front' }">返回前台</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
          overflow: 'hidden',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getBackRoutesAdmin, getBackRoutesUser, getUrls } from "@/router/index";

import { ElMessage } from "element-plus";
import { CiStar } from "vue3-icons/ci";
import { FaUserAstronaut } from "vue3-icons/fa";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
const collapsed = ref(false);
const selectedKeys = ref([]);
const openKeys = ref(getUrls());
//路由
const router = useRouter();
const store = useStore();
const username = localStorage.getItem("adminName");

// 获取后台路由
const backRoutes =
  username == "admin" ? getBackRoutesAdmin() : getBackRoutesUser();
const backMenuList = [
  { path: "/back", name: "系统首页", icon: CiStar }, // 补充第一个路由
  ...backRoutes.flatMap((child) => ({
    path: `/back/${child.path}`, // 使用绝对路径
    name: child.name,
    children: child.children,
  })),
];

// 默认选中第一个可用的菜单项或子菜单项
const setDefaultSelectedKey = () => {
  const firstMenu = backMenuList[0];
  if (firstMenu) {
    selectedKeys.value = [firstMenu.path]; // 默认选中第一个菜单项
    if (firstMenu.children && firstMenu.children.length > 0) {
      selectedKeys.value = [firstMenu.children[0].path]; // 如果有子菜单，则选中第一个子菜单
    }
  }
};
const handleLogout = () => {
  // 退出登录逻辑
  localStorage.clear();
  // 更新 Vuex 的登录状态
  store.commit("SET_LOGIN", { isLoggedIn: false, username: "" });
  ElMessage({
    message: "退出成功",
    type: "success",
  });
  router.push({ path: "/login" });
};

// 页面刷新时保持选中状态
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedMenuKey");
  if (storedSelectedKey) {
    selectedKeys.value = [storedSelectedKey];
  } else {
    setDefaultSelectedKey(); // 设置默认选中项
  }
});

// 监控选中菜单项变化，保存到 localStorage
watch(selectedKeys, (newValue) => {
  localStorage.setItem("selectedMenuKey", newValue[0]);
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  /* 整体滚动条 */
  ::-webkit-scrollbar {
    width: 5px; /* 宽度 */
    height: 5px; /* 高度 */
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: #000000; /* 轨道背景色 */
    border-radius: 10px; /* 圆角 */
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: #222222; /* 滑块颜色 */
    border-radius: 10px; /* 圆角 */
  }

  /* 滑块在悬停时的样式 */
  ::-webkit-scrollbar-thumb:hover {
    background: #4758bb; /* 悬停时颜色 */
  }

  /* 适用于 Firefox 的滚动条样式 */
  .scrollable {
    scrollbar-width: thin; /* 细滚动条 */
    scrollbar-color: #858585 #f1f1f1; /* 滑块颜色和轨道颜色 */
  }
}
.logo {
  font-weight: bold;
  color: #fff;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
.layout-header {
  background: #fff;
  display: flex;
  padding: 0;
  .title {
    display: flex;
    width: 90%;
    align-items: center;
    justify-content: space-between;
    color: #000;
    .tt {
      font-weight: bold;
      font-size: 20px;
      padding-left: 50px;
      letter-spacing: 5px;
    }
    button {
      font-size: 14px;
      margin: 0 10px 0 30px;
      line-height: normal;
    }
  }
  .down {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}
.menu-list {
  height: calc(100vh - 60px);
  overflow-y: scroll;
  padding-bottom: 50px;
}
</style>
