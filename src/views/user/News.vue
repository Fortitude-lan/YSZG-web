<template>
  <div class="pageM">
    <!-- title -->
    <div class="pheading">
      <h1>最新咨询</h1>
    </div>
    <!-- 内容 -->
    <el-row :gutter="20">
      <!-- 设置卡片间距 -->
      <!-- <el-col
        v-for="item in newsLIst"
        :key="item.id"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card class="custom-card">
          <template #header>
            <h3>{{ item.title }}</h3>
          </template>
          <div class="news">
            <img
              :src="`${item.picture}`"
              style="
                width: 150px;
                height: 150px;
                display: block;
                border-radius: 10px;
                padding: 5px;
                background-color: #fff;
                border: 1px solid #eee;
              "
              :alt="item.title"
            />
            <p style="color: #fff">
              {{ item.introduction }}
            </p>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
    <ul class="rklist">
      <li
        v-for="(item, index) in newsLIst"
        :key="index"
        @click="goToDetail(item)"
      >
        <div class="rkt">
          <div class="rkt-1">
            <el-avatar :size="50" :src="item.picture" />
            <span
              ><strong>{{ item.title }}</strong></span
            >
          </div>
          <div class="time">
            {{ item.addtime }}
          </div>
        </div>
        <div class="rk-content">
          <div v-html="truncateContent(item.content)"></div>
        </div>
      </li>
    </ul>
    <el-row style="padding: 30px 0">
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
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { fetchNewsList } from "@/services/homeServices";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 20, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
// 响应式数据
const newsLIst = ref({});

const formRef = ref();
const form = reactive({
  title: "",
});

// 异步获取数据
const fetchData = async () => {
  try {
    // 获取信息，包含分页
    const { list, totalPage, currPage } = await fetchNewsList(
      pagination.currentPage,
      pagination.pageSize
    );
    newsLIst.value = list;
    pagination.totalPage = totalPage || 0; // 更新总页数
    pagination.currentPage = currPage || 1; // 更新当前页码
  } catch (error) {
    console.error("Error fetching Home Page:", error);
  }
};
const truncateContent = (content) => {
  // 如果内容长度大于 20 字符，截取前 20 字符并加上 "..." 作为标记
  if (content && content.length > 20) {
    return content.substring(0, 20) + "...";
  }
  return content;
};

const goToDetail = (item) => {
  localStorage.setItem("newsdetail", JSON.stringify(item)); // 将 item 存储到 localStorage
  router.push({ name: "咨询详情", params: { id: item.id } });
};
// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.pageM {
  padding: 100px 5% 0;
  background: url(https://pic.616pic.com/bg_w1180/00/22/49/ls8Weuu5Sd.jpg!/fw/1120)
    no-repeat;
  background-size: cover;
  background-color: rgba(255, 255, 255, 0.527);
  background-blend-mode: overlay;
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
.custom-card {
  cursor: pointer;
  height: 250px; /* 固定卡片高度 */
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 使内容均匀分布 */
  background: rgba(0, 0, 0, 0.3);
  border: none;
  :deep(.el-card__header) {
    height: 45px;
    padding: 10px;
    border: none;
    h3 {
      padding: 0px 10px;
      box-shadow: rgb(221, 221, 221) 1px 1px 1px;
      margin: 4px 0px 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(51, 51, 51);
      border-radius: 8px;
      background: radial-gradient(
        circle,
        rgb(250, 250, 250) 0%,
        rgba(220, 230, 250, 0.5) 100%
      );
      line-height: 30px;
      font-size: 14px;
    }
  }

  :deep(.el-card__body) {
    height: 290px;
    padding: 10px;
  }
  .news {
    display: flex;
    justify-content: space-between;
    p {
      padding: 0 5px;
      margin: 0;
      font-size: 14px;
      height: 160px;
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 在超出文本末尾显示省略号 */
      display: -webkit-box; /* 使用弹性盒子模型 */
      -webkit-line-clamp: 7; /* 限制显示3行文本 */
      -webkit-box-orient: vertical; /* 设置盒子的方向为垂直 */
      white-space: normal; /* 允许文本换行 */
    }
  }
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.5s ease;
  }
}
.rklist {
  width: 97%;
  margin: 0 auto;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  border: 2px dashed #a38ffd;
  padding: 20px;
  li {
    padding: 5px 20px;
    border-bottom: 1px solid #cbc1ff;
    &:hover {
      cursor: pointer;
      background: rgb(246, 242, 255);
    }
  }
}
.rkt {
  display: flex;
  justify-content: space-between;
  .rkt-1 {
    display: flex;
    align-items: center;
  }
  .el-avatar {
    margin-right: 10px;
  }
  .time {
    color: #cbbfff;
  }
}
.rk-content {
  padding-left: 58px;
}
</style>
