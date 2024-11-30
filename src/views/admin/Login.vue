<template>
  <div class="page-box">
    <div class="sign-box">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <div class="signin">
        <el-form
          ref="formSigninRef"
          :model="signinValidateForm"
          class="form-layout"
          status-icon
          :rules="rules"
        >
          <label for="chk" aria-hidden="true">登录</label>
          <el-form-item label="账  号" class="form-item" prop="username">
            <el-input
              v-model="signinValidateForm.username"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item label="密  码" class="form-item" prop="password">
            <el-input
              type="password"
              v-model="signinValidateForm.password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item label="角  色" class="form-item" prop="role">
            <el-radio-group v-model="signinValidateForm.role">
              <el-radio value="users">管理员</el-radio>
              <el-radio value="yonghu">用户</el-radio>
            </el-radio-group>
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
          <el-button type="primary" @click.prevent="handleSignUp(formSignupRef)"
            >注册</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { ElMessage } from "element-plus";

import { loginService, signUpService } from "@/services/backServices";
import { reactive, ref, onMounted, computed } from "vue";
// 获取路由
const store = useStore();
const router = useRouter();
// 上传文件列表
const imgUrl = ref([]);

// 注册
const formSignupRef = ref();
const signupValidateForm = reactive({
  xingming: "",
  yonghuming: "",
  mima: "",
  lianxidianhua: "",
});
// 登录
const formSigninRef = ref();
const signinValidateForm = reactive({
  username: "",
  password: "",
  role: "",
});
const rules = reactive({
  username: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入账号"));
        } else {
          // 防止递归调用 validateField
          if (
            signinValidateForm.username !== "" &&
            !formSigninRef.value._isValidating
          ) {
            if (!formSigninRef.value) return;
            // 设置标志防止重复验证
            formSigninRef.value._isValidating = true;
            formSigninRef.value.validateField("username", () => {
              formSigninRef.value._isValidating = false; // 完成验证后清除标志
            });
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (signinValidateForm.password !== "") {
            if (!formSigninRef.value) return;
            formSigninRef.value.validateField("password");
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  role: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请选择角色"));
        } else {
          if (signinValidateForm.role !== "") {
            if (!formSigninRef.value) return;
            formSigninRef.value.validateField("role");
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
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
      if (msg == 0) {
        ElMessage({
          message: "登陆成功",
          type: "success",
        });
        //get UIID
        // getSession(params.role);
        // 更新 Vuex 的登录状态
        store.commit("SET_LOGIN", {
          isLoggedIn: true,
          username: params.username,
        });
        // 等待 Vuex 状态更新后再跳转
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
            console.log("跳转1s");
            // 跳转到 /back 页面
            router.push({ path: "/back" });
          }, 1000); // 适当延迟，例如100毫秒
        });
      } else {
        ElMessage.error("密码或账号错误");
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
      const params = {
        ...signupValidateForm,
      };
      const res = await signUpService(params);
      if (res == 0) {
        ElMessage({
          message: `${signupValidateForm.yonghuming} 注册成功`,
          type: "success",
        });
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
.page-box {
  width: 100%;
  height: 100vh;
  padding: 100px 0;
  background: url(https://th.bing.com/th/id/R.ebf1fcee86a59b2527ed4e2ef09ca53e?rik=PPh5PHDmg2BUcw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn12%2f600%2fw1920h1080%2f20180719%2f47d3-hfnsvza6867087.jpg&ehk=OAEkBr3bESkdOFBy3P9RiUE1MF0I%2frjCzi4nb43PVr8%3d&risl=&pid=ImgRaw&r=0);
}

.form-layout {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.form-item {
  flex: 1; /* 等宽 */
  margin-right: 20px; /* 控制项之间的间距 */
  :deep(.el-radio) {
    margin: 0;
    padding-right: 20px;
  }
}

.form-item:last-child {
  margin-right: 0; /* 最后一个不需要右边距 */
}

.sign-box {
  width: 450px;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
  background: linear-gradient(to bottom, #0f0c29, #302b6369, #24243e);
  :deep(.el-form-item__label) {
    width: 48px;
  }
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
    width: 75%;
    height: 50px;
    margin: 0 auto;
    justify-content: center;
    display: block;
    color: #fff;
    background: #573b8a;
    font-size: 1em;
    font-weight: bold;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: 0.2s ease-in;
    cursor: pointer;
    span {
      letter-spacing: 15px;
      font-size: 18px;
    }
  }
  button:hover {
    background: #6d44b8;
  }
  .signup {
    height: 450px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-250px);
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
      letter-spacing: 5px;
      margin-top: 40px;
      width: 50%;
    }
  }

  #chk:checked ~ .signup {
    transform: translateY(-580px);
  }
  #chk:checked ~ .signup label {
    transform: scale(0.9);
  }
  #chk:checked ~ .signin label {
    transform: scale(0.7);
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
