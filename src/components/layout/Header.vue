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
          <router-link :to="route.path"
            ><span :class="isActive(route.path) ? 'curNav' : 'nav-item'">
              <component :is="route.icon" />{{ route.name }}</span
            ></router-link
          >
        </li>
      </ul>
    </nav>
    <!-- 登录 -->
    <div>
      <div v-if="isLoggedIn">
        <el-dropdown placement="top-start">
          <div class="login-box">
            <el-avatar
              :icon="FaUserAstronaut"
              :size="35"
              :style="{ background: '#1e62b9' }"
            />
            <span :style="{ marginLeft: '10px', fontWeight: 'bold' }"
              >欢迎: {{ username }}</span
            >
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link :to="{ path: '/back' }">后台管理</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout"> 退出 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-button
        v-if="!isLoggedIn"
        class="login-btn"
        plain
        @click="dialogVisible = true"
        >登录/注册</el-button
      >
    </div>
  </header>
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="700"
    :style="{ background: 'transparent' }"
  >
    <template #default>
      <div class="sign-box">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div class="signin">
          <label for="chk" aria-hidden="true">登录</label>
          <el-form
            ref="formSigninRef"
            :model="signinValidateForm"
            class="form-layout"
          >
            <el-form-item label="用户名" class="form-item">
              <el-input
                v-model="signinValidateForm.username"
                placeholder="用户名"
                required
              />
            </el-form-item>
            <el-form-item label="密  码" class="form-item">
              <el-input
                type="password"
                v-model="signinValidateForm.password"
                placeholder="密码"
                required
              />
            </el-form-item>
            <button type="submit" @click.prevent="handleLogin(formSigninRef)">
              登录
            </button>
          </el-form>
        </div>
        <div class="signup">
          <el-form
            ref="formSignupRef"
            :model="signupValidateForm"
            class="form-layout"
          >
            <label for="chk" aria-hidden="true">注册</label>
            <el-form-item label="账号" class="form-item">
              <el-input
                v-model="signupValidateForm.yonghuming"
                placeholder="账号"
                required
              />
            </el-form-item>

            <el-form-item label="密码" class="form-item">
              <el-input
                type="password"
                v-model="signupValidateForm.mima"
                placeholder="密码"
                required
              />
            </el-form-item>
            <!-- <el-form-item label="确认密码" class="form-item">
              <el-input
                type="password"
                v-model="signupValidateForm.mima2"
                placeholder="确认密码"
                required
              />
            </el-form-item> -->
            <el-form-item label="姓名" class="form-item">
              <el-input
                v-model="signupValidateForm.xingming"
                placeholder="姓名"
                required
              />
            </el-form-item>
            <el-form-item label="电话号码" class="form-item">
              <el-input
                v-model="signupValidateForm.lianxidianhua"
                placeholder="电话"
                required
              />
            </el-form-item>
            <el-button
              type="primary"
              @click.prevent="handleSignUp(formSignupRef)"
              >注册</el-button
            >
          </el-form>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getFrontendRoutes } from "@/router/index";
import { useRoute } from "vue-router";
import { signUpService } from "@/services/backServices";
import { loginService } from "@/services/headerServices";
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted, computed } from "vue";
import { FaUserAstronaut } from "vue3-icons/fa";
import { CiStar } from "vue3-icons/ci";
import { useStore } from "vuex";
const store = useStore();
// 获取 isLoggedIn 状态
const isLoggedIn = computed(() => store.state.isLoggedIn);
const username = computed(() => store.state.username);

// 控制对话框显示状态
const dialogVisible = ref(false);

// 获取前端路由
const frontendRoutes = getFrontendRoutes();
const frontendMenuList = [
  { path: "/front", name: "首页", icon: CiStar }, // 补充第一个路由
  ...frontendRoutes.flatMap((child) => ({
    path: `/front/${child.path}`, // 使用绝对路径
    name: child.name,
    icon: child.icon,
  })),
];

const route = useRoute();
const isActive = (path) => {
  return route.path === path; // 判断当前路由是否与链接路径相同
};

//登陆注册

const formSignupRef = ref();
const signupValidateForm = reactive({
  xingming: "",
  yonghuming: "",
  mima: "",
  lianxidianhua: "",
});
const formSigninRef = ref();
const signinValidateForm = reactive({
  username: "",
  password: "",
});
// 登录处理
const handleLogin = (formEl) => {
  if (!formSigninRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      const params = {
        ...signinValidateForm,
      };
      console.log(params);
      const msg = await loginService(params);
      if (msg.code == 0) {
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        dialogVisible.value = false; // 关闭对话框
        // 更新 Vuex 的登录状态
        store.commit("SET_LOGIN", {
          isLoggedIn: true,
          username: params.username,
        });
      } else {
        ElMessage.error(msg.msg);
      }
    } else {
      console.log("error submit!");
    }
  });
};
// 注册处理
const handleSignUp = (formEl) => {
  if (!formSignupRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(signupValidateForm.username);
      const params = {
        ...signupValidateForm,
      };
      const res = await signUpService(params);
      if (res == 0) {
        ElMessage({
          message: `${signupValidateForm.yonghuming} 注册成功`,
          type: "success",
        });
        dialogVisible.value = false; // 关闭对话框
      } else {
        ElMessage({
          message: "注册失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!");
    }
  });
};
// 退出登录
const handleLogout = () => {
  // 退出登录逻辑
  localStorage.clear();
  // 更新 Vuex 的登录状态
  store.commit("SET_LOGIN", { isLoggedIn: false, username: "" });
  ElMessage({
    message: "退出成功",
    type: "success",
  });
};
// 检查登录状态
const checkLoginStatus = () => {
  const role = localStorage.getItem("role");
  if (role) {
    store.commit("SET_LOGIN", {
      isLoggedIn: true,
      username: localStorage.getItem("adminName"),
    });
  }
};

// 在组件挂载时调用
onMounted(() => {
  checkLoginStatus();
});
</script>

<style lang="scss" scoped>
/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgb(63 64 74);
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
  align-items: center;
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
    text-decoration: none;
  }
  span {
    display: flex;
    align-items: center;
  }
  span:hover {
    color: rgb(188, 172, 197) !important;
  }
}

.form-layout {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.form-item {
  flex: 1; /* 等宽 */
  width: 60%;
  margin: 15px auto;
  :global(.el-form-item__label) {
    text-align: right;
    width: 20%;
  }
}

.form-item:last-child {
  margin-right: 0; /* 最后一个不需要右边距 */
}

.sign-box {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);

  #chk {
    display: none;
  }

  label {
    color: #fff;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s ease-in-out;
  }
  input {
    width: 60%;
    height: 2rem;
    background: #e0dede;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 12px;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  button {
    width: 60%;
    height: 50px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #fff;
    background: #573b8a;
    font-size: 1em;
    font-weight: bold;
    margin-top: 30px;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: 0.2s ease-in;
    cursor: pointer;
  }
  button:hover {
    background: #6d44b8;
  }
  .signup {
    height: 450px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-260px);
    transition: 0.8s ease-in-out;
    label {
      color: #573b8a;
      transform: scale(0.8);
      margin-bottom: 20px;
    }
    :deep(.el-form-item__label) {
      width: 100px;
    }
    :deep(.el-input) {
      width: 90%;
    }
  }
  .signin {
    position: relative;
    width: 100%;
    height: 590px;
    .form-item {
      margin: 20px auto;
    }
    :deep(.el-form-item__label) {
      color: #fff !important;
    }

    :deep(.el-input),
    button {
      height: 3rem;
    }
    button {
      font-size: 1.2rem;
      text-align: center;
      letter-spacing: 0.5rem;
      margin-top: 45px;
    }
  }

  #chk:checked ~ .signup {
    transform: translateY(-580px);
  }
  #chk:checked ~ .signup label {
    transform: scale(1);
  }
  #chk:checked ~ .signin label {
    transform: scale(0.8);
  }

  :global(.el-dialog) {
    margin-top: 70px !important;
  }
  .upload-demo {
    width: 100px;
    height: 100px;
  }
}
.login-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 5px;
  padding: 2px 15px 2px 5px;
}
.curNav,
.nav-item:hover {
  border-radius: 0.25rem;
  text-transform: uppercase;
  font-style: normal;
  font-weight: 400;
  padding-left: 15px;
  padding-right: 15px;
  color: #fff;
  -webkit-clip-path: polygon(
    0 0,
    0 0,
    100% 0,
    100% 0,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    15px 100%,
    0 100%
  );
  clip-path: polygon(
    0 0,
    0 0,
    100% 0,
    100% 0,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    15px 100%,
    0 100%
  );
  height: 40px;
  font-size: 0.8rem;
  line-height: 14px;
  letter-spacing: 1.2px;
  transition: 0.2s 0.1s;
  background-image: linear-gradient(90deg, #28285a, #6220fb);
  border: 0 solid;
  overflow: hidden;
}
.curNav:hover {
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 600;
  color: #000;
  transition: all 0.1s ease-in;
  background-image: linear-gradient(90deg, #9472e1, #6220fb);
  // padding-right: 32px;
  // padding-left: 32px;
}
</style>
