<template>
  <div class="page">
    <el-form
      v-if="role == '用户'"
      ref="formRef"
      :model="infoValidateForm"
      class="form-layout"
    >
      <div class="form-row">
        <el-form-item label="账号" class="form-item">
          <el-input
            v-model="infoValidateForm.yonghuming"
            placeholder="账号"
            required
            disabled
          />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="姓名" class="form-item">
          <el-input
            v-model="infoValidateForm.xingming"
            placeholder="姓名"
            required
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="infoValidateForm.xingbie"
            placeholder="选择性别"
            required
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="电话" class="form-item">
          <el-input
            v-model="infoValidateForm.lianxidianhua"
            placeholder="电话"
            required
          />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="照片" class="form-item">
          <el-upload
            class="upload-demo"
            drag
            :action="`${baseUrl}/file/upload`"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleUpdateImage"
          >
            <img
              :style="{
                border: '1px dashed #999',
                cursor: 'pointer',
                color: '#999',
                borderRadius: '6px',
                textAlign: 'center',
                background: '#f9f9f9',
                width: '150px',
                fontSize: '32px',
                lineHeight: '100px',
                height: 'auto',
              }"
              v-if="infoValidateForm.touxiang"
              :src="infoValidateForm.touxiang"
              class="avatar"
            />

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </div>
      <div class="tt">
        <el-button @click.prevent="onSubmit(formRef)" class="edit-button"
          >修改</el-button
        >
      </div>
    </el-form>
    <el-form v-else ref="formRef" :model="infoValidateForm" class="form-layout">
      <div class="form-row">
        <el-form-item label="用户名" class="form-item">
          <el-input
            v-model="infoValidateForm.yonghuming"
            placeholder="用户名"
            required
          />
        </el-form-item>
      </div>
      <div class="tt">
        <el-button @click.prevent="onSubmit(formRef)" class="edit-button"
          >修改</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
import { RiExchangeCnyFill } from "vue3-icons/ri";
import { getSession } from "@/services/backServices";
import { fetchSaveInfo } from "@/services/userServices";
import { ElMessage, ElMessageBox } from "element-plus";
import { baseUrl } from "@/utils/util";

const role = localStorage.getItem("role"); //
const sessionTable = localStorage.getItem("sessionTable"); //

// 响应式数据
const userInfo = ref({});
const formRef = ref();
const infoValidateForm = reactive({
  yonghuming: "",
  mima: "",
  xingming: "",
  xingbie: "",
  lianxidianhua: "",
  touxiang: null,
});

const czFormVisible = ref(false);
const czform = reactive({
  money: "",
});

const fetchDate = async () => {
  try {
    userInfo.value = await getSession(sessionTable);
    console.log(userInfo);
    // 回显数据到表单
    infoValidateForm.addtime = userInfo.value.addtime || "";
    infoValidateForm.yonghuming = userInfo.value.yonghuming || "";
    infoValidateForm.mima = userInfo.value.mima || "";
    infoValidateForm.xingming = userInfo.value.xingming || "";
    infoValidateForm.xingbie = userInfo.value.xingbie || "";
    infoValidateForm.lianxidianhua = userInfo.value.lianxidianhua || "";
    infoValidateForm.touxiang = userInfo.value.touxiang || null;
    console.log(infoValidateForm.touxiang.split("upload")[0]);

    // czform.money = Number(userInfo.value.money) || 0;
  } catch (error) {
    console.error("Error fetching:", error);
  }
};

//更新
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = {
        ...userInfo.value,
        ...infoValidateForm,
      };
      if (sessionTable == "users") {
        params = { ...userInfo.value, username: infoValidateForm.yonghuming };
      }

      const msg = await fetchSaveInfo(sessionTable, params);
      if (msg === 0) {
        ElMessage({
          message: "更新成功",
          type: "success",
        });
        userInfo.value = await getSession(sessionTable);
      } else {
        ElMessage({
          message: "更新失败",
          type: "error",
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const headers = ref({
  Token: localStorage.getItem("Token"),
});
// 上传图片成功后回调
const handleUpdateImage = (response) => {
  // 假设后端返回图片的URL
  const imageUrl = `${infoValidateForm.touxiang.split("upload")[0]}upload/${
    response.file
  }`; // 修改为实际的返回路径字段
  console.log(imageUrl);

  infoValidateForm.touxiang = imageUrl; // 更新表单中的图片路径

  // 提示用户上传成功
  ElMessage({
    message: "图片上传成功",
    type: "success",
  });
};
// 在组件挂载时调用
onMounted(() => {
  fetchDate();
});
</script>

<style lang="scss" scoped>
.page {
  width: 95%;
}
.form-layout {
  .tt {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 20px 20px 0;
  color: #4c51bf;
}

.profile-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-image-section {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-image {
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  border: 4px solid #4c51bf;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.profile-image:hover {
  transform: scale(1.05);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4c51bf;
  margin-top: 1rem;
}

.profile-title {
  color: #718096;
  margin-top: 0.5rem;
}

.edit-button {
  background-color: #4c51bf;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #434190;
}

.profile-description {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-chip {
  background-color: #e2e8f0;
  color: #4c51bf;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #4a5568;
}

.contact-item svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #4c51bf;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.chongzhi {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  &:hover {
    color: #bb85df;
    font-weight: 600;
  }
}

.image-options {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.image-label {
  display: flex;
  width: 120px;
  align-items: center;
  img {
    width: 100%;
  }
}
</style>
