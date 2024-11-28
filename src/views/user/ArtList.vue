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

      <!-- 选择器 -->
      <el-form ref="formRef" :model="form" label-width="auto" class="form">
        <el-form-item label="分类:" prop="keshifenlei">
          <el-select v-model="form.keshifenlei" :style="{ width: '180px' }">
            <el-option
              placeholder="请选择"
              v-for="item in ksflList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称:" prop="shangpinmingcheng">
          <el-input v-model="form.shangpinmingcheng" />
        </el-form-item>
        <el-form-item label="标签:" prop="biaoqian">
          <el-input v-model="form.biaoqian" />
        </el-form-item>
        <el-form-item label="品牌:" prop="pinpai">
          <el-input v-model="form.pinpai" />
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
          v-for="item in ksList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <!-- <el-card class="custom-card" @click="openDrawer(item)">
            <img
              :src="item.tupian"
              style="width: 100%; height: 80%; display: block"
              :alt="item.shangpinmingcheng"
            />
            <h5>{{ item.shangpinmingcheng }}</h5>
            <span style="color: red; padding-left: 15px;font-size: 14px;">{{
              item.price
            }} RMB</span>
          </el-card> -->
          <div class="nft">
            <div class="main">
              <img
                class="tokenImage"
                :src="item.tupian"
                :alt="item.shangpinmingcheng"
              />
              <h3 class="title">{{ item.shangpinmingcheng }}</h3>
              <p class="price">{{ item.price }} RMB</p>
              <hr />
              <div class="see">
                <a @click="goToDetail(item)">
                  <!-- <router-link
                    :to="{
                      name: '艺术品详情',
                      params: { id: item.id },
                    }"
                    >
                    </router-link > -->
                  查看详情
                </a>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row style="margin: 30px 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :page-count="pagination.totalPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </el-row>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getFrontendRoutes } from "@/router/index";
import { CiStar } from "vue3-icons/ci";
import {
  fetchCarouselImages,
  fetchSPFL,
  fetchShangpinList,
} from "@/services/homeServices";
const route = useRoute();
const router = useRouter();

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 20, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

const carouselImages = ref({}); // 用于存放轮播图的数组

// 响应式数据
const ksflList = ref({});
const ksList = ref({});

const formRef = ref();
const form = reactive({
  keshifenlei: "全部",
  shangpinmingcheng: "",
  biaoqian: "",
  pinpai: "",
});
// 构建查询参数
const buildQueryParams = () => {
  const query = {};
  if (form.keshifenlei && form.keshifenlei !== "全部") {
    query.keshifenlei = form.keshifenlei;
  }
  if (form.shangpinmingcheng) {
    query.shangpinmingcheng = `%${form.shangpinmingcheng}%`;
  }
  if (form.biaoqian) {
    query.biaoqian = `%${form.biaoqian}%`;
  }
  if (form.pinpai) {
    query.pinpai = `%${form.pinpai}%`;
  }
  return query;
};
const fetchData = async () => {
  // 获取轮播图数据
  carouselImages.value = await fetchCarouselImages();
  ksflList.value = await fetchSPFL();
  const query = buildQueryParams(); // 使用统一查询方法
  const { list, totalPage, currPage } = await fetchShangpinList(
    query,
    pagination.currentPage,
    pagination.pageSize
  );
  ksList.value = list;
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
// 切换页码
const handlePageChange = async (page) => {
  pagination.currentPage = page;
  await fetchData();
};

// 每页条数仍然由前端控制（可选）
const handleSizeChange = async (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1; // 重置为第一页
  await fetchData();
};

const goToDetail = (item) => {
  localStorage.setItem("artItemID", JSON.stringify(item.id)); // 将 item 存储到 localStorage
  router.push({ name: "艺术品详情", params: { id: item.id } });
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
      height: 250px;
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
