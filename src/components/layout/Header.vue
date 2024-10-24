<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-18 12:52:21
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-24 10:29:37
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
          <router-link :to="route.path"
            ><span
              :style="{
                color: isActive(route.path) ? '#fc2c2c' : '#ccc',
                fontWeight: isActive(route.path) ? 'bold' : '400',
                fontSize: isActive(route.path) ? '1.2rem' : '400',
              }"
              >{{ route.name }}</span
            ></router-link
          >
        </li>
      </ul>
    </nav>
    <el-button class="login-btn" plain @click="dialogVisible = true"
      >登录/注册</el-button
    >
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
                v-model="signupValidateForm.username"
                placeholder="账号"
                required
              />
            </el-form-item>

            <el-form-item label="密码" class="form-item">
              <el-input
                type="password"
                v-model="signupValidateForm.password"
                placeholder="密码"
                required
              />
            </el-form-item>
            <el-form-item label="确认密码" class="form-item">
              <el-input
                type="password"
                v-model="signupValidateForm.confirmPassword"
                placeholder="确认密码"
                required
              />
            </el-form-item>
            <el-form-item label="姓名" class="form-item">
              <el-input
                v-model="signupValidateForm.name"
                placeholder="姓名"
                required
              />
            </el-form-item>
            <el-form-item label="电话号码" class="form-item">
              <el-input
                v-model="signupValidateForm.phone"
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
import { loginService } from "@/services/headerServices";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

// 控制对话框显示状态
const dialogVisible = ref(false);

// 获取前端路由
const frontendRoutes = getFrontendRoutes();
const frontendMenuList = [
  { path: "/front", name: "首页" }, // 补充第一个路由
  ...frontendRoutes.flatMap((child) => ({
    path: `/front/${child.path}`, // 使用绝对路径
    name: child.name,
  })),
];
console.log(frontendMenuList);

const route = useRoute();
const isActive = (path) => {
  return route.path === path; // 判断当前路由是否与链接路径相同
};

//登陆注册

const formSignupRef = ref();
const signupValidateForm = reactive({
  username: "",
  phone: "",
  password: "",
  confirmPassword: "",
  name: "",
  cardNumber: "",
  gender: "",
  age: "",
  photo: null,
});
const formSigninRef = ref();
const signinValidateForm = reactive({
  username: "",
  password: "",
});
const handleLogin = (formEl) => {
  if (!formSigninRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      const params = {
        ...signinValidateForm,
      };
      console.log(params);
      const msg = await loginService(params);
      if (msg == 0) {
        ElMessage({
          message: "登陆成功",
          type: "success",
        });
        dialogVisible.value = false; // 关闭对话框
      } else {
        ElMessage.error("密码或账号错误");
      }
    } else {
      console.log("error submit!");
    }
  });
};
const handleSignUp = (formEl) => {
  if (!formSignupRef) return; // 处理注册逻辑
  formEl.validate((valid) => {
    if (valid) {
      console.log(signupValidateForm.username);
    } else {
      console.log("error submit!");
    }
  });
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
</style>
