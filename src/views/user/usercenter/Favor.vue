<template>
  <div class="min300">
    <!-- 内容区域 -->
    <main class="container" v-if="favorList.length">
      <!-- 选择器 -->
      <el-form ref="formRef" :model="form" label-width="auto" class="form">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onSubmit(formRef)">查询</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 内容 -->
      <el-row :gutter="20">
        <!-- 设置卡片间距 -->
        <el-col
          v-for="item in favorList"
          :key="item.id"
          :xs="12"
          :sm="6"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <div class="nft">
            <div class="main">
              <img class="tokenImage" :src="item.picture" :alt="item.picture" />
              <h3 class="title">{{ item.name }}</h3>
              <hr />
              <div class="see">
                <a @click="goToDetail(item)"> 查看详情 </a>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>
    <main class="container" v-else>暂无收藏</main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchFavorList } from "@/services/userServices";
const route = useRoute();
const router = useRouter();

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 1000, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

// 响应式数据
const favorList = ref([]);

const formRef = ref();
const form = reactive({
  name: "",
});
// 构建查询参数
const buildQueryParams = () => {
  const query = {};
  if (form.name) {
    query.name = `%${form.name}%`;
  }
  return query;
};
const fetchData = async () => {
  const query = buildQueryParams(); // 使用统一查询方法
  const { list, totalPage, currPage } = await fetchFavorList(
    query,
    pagination.currentPage,
    pagination.pageSize
  );
  favorList.value = list;
  console.log(list);
  pagination.totalPage = totalPage || 0; // 更新总页数
  pagination.currentPage = currPage || 1; // 更新当前页码
};
//查找
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      pagination.currentPage = 1; // 查询时重置为第一页
      await fetchData();
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const goToDetail = (item) => {
  localStorage.setItem("artItemID", JSON.stringify(item.refid)); // 将 item 存储到 localStorage
  console.log(item);
  router.push({ name: "艺术品详情", params: { id: item.refid } });
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

.form {
  margin: 20px 0;
  width: 70vw;
  display: flex;
  :deep(.el-form-item) {
    padding-left: 10px;
  }
}
.form-btns {
  :deep(.el-form-item__content) {
    min-width: 150px;
    display: flex;
  }
}
.container {
  //   background: rgb(246, 246, 255);
  padding: 20px;
  //   height: 300px;
  max-width: 1200px;
  margin: 0 auto;
}
.breadcrumb {
  margin: 0 0 30px;
}

.nft {
  cursor: pointer;
  user-select: none;
  max-width: 300px;
  border: 1px solid #ffffff22;
  background-color: #979bc4;
  background: linear-gradient(
    0deg,
    rgb(50, 56, 68) 0%,
    rgba(54, 0, 102, 0.5) 100%
  );
  box-shadow: 0 7px 20px 5px #00000088;
  border-radius: 0.7rem;
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  overflow: hidden;
  transition: 0.5s all;
  margin-bottom: 25px;
  hr {
    width: 100%;
    border: none;
    border-bottom: 1px solid #88888855;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }
  .main {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem;
    .tokenImage {
      border-radius: 0.5rem;
      max-width: 100%;
      height: 180px;
      object-fit: cover;
    }
    .title {
      padding: 10px 0;
      color: #fff;
    }
    .price {
      color: #a89ec9;
    }
    .see {
      cursor: pointer;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 0.2rem;
      margin-bottom: -0.3rem;
      a {
        color: #a89ec9;
        text-decoration: none;
      }
      .wrapper {
        display: flex;
        align-items: center;
        border: 1px solid #ffffff22;
        padding: 0.3rem;
        margin: 0;
        margin-right: 0.5rem;
        border-radius: 100%;
        box-shadow: inset 0 0 0 4px #000000aa;
        img {
          border-radius: 100%;
          border: 1px solid #ffffff22;
          width: 2rem;
          height: 2rem;
          object-fit: cover;
          margin: 0;
        }
      }
    }
  }
  ::before {
    position: fixed;
    content: "";
    box-shadow: 0 0 100px 40px #ffffff08;
    top: -10%;
    left: -100%;
    transform: rotate(-45deg);
    height: 60rem;
    transition: 0.7s all;
  }
  &:hover {
    border: 1px solid #ffffff44;
    box-shadow: 0 7px 50px 10px #000000aa;
    transform: scale(1.015);
    filter: brightness(1.3);
    ::before {
      filter: brightness(0.5);
      top: -100%;
      left: 200%;
    }
  }
}
</style>
