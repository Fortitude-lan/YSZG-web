<template>
  <div class="page">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/front/news' }"
        >当前位置：咨询列表</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: route.path }">{{
        route.name
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="newitem">
      <div class="tt">
        <h2>{{ newsItem.title }}</h2>
        <span>时间：{{ newsItem.addtime }}</span>
      </div>
      <div class="content">
        <div class="c1">
          <div v-html="newsItem.content"></div>
          <img
            :src="newsItem.picture"
            style="
              width: 150px;
              height: 150px;
              display: block;
              border-radius: 10px;
              padding: 5px;
              background-color: #fff;
              border: 1px solid #eee;
            "
          />
        </div>
        <div>
          <strong>本篇文章：{{ newsItem.title }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const newsItem = ref({
  id: "", // 商品图片的 URL
  title: "", // 商品价格
  introduction: "", // 商品名称
  picture: "", // 商品标签
  content: "", //
  addtime: "", //
});
const fetchData = async () => {
  //info
  const item = JSON.parse(localStorage.getItem("newsdetail"));
  newsItem.value = item;
};
// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>
<style lang="scss" scoped>
.page {
  min-height: 400px;
  width: 1000px;
  margin: 80px auto 20px;
}

.newitem {
  text-align: center;
  .tt {
    display: flex;
    flex-direction: column;
    justify-content: center;
    span {
      color: #aaa;
      margin: 20px 0 30px;
    }
    border-bottom: 3px solid #a38ffd;
  }

  .content {
    padding: 20px 0;
    text-align: left;
    text-indent: 2rem;
    .c1 {
      min-height: 300px;
    }
  }
}
</style>
