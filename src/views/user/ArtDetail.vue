<template>
  <div class="page">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/front/ucenter' }"
        >当前位置：艺术品详情</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: route.path }">{{
        route.name
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 艺术品详情 -->
    <div class="product">
      <!-- 基本info -->
      <div class="product-container">
        <!-- 左侧商品图片 -->
        <div class="product-img">
          <img :src="artItem.tupian" alt="商品图片" />
        </div>

        <!-- 右侧商品信息 -->
        <div class="product-info">
          <h2>{{ artItem.shangpinmingcheng }}  <el-tag type="primary">{{ artItem.biaoqian }}</el-tag></h2>
          <p><strong>价格：</strong>{{ artItem.price }}</p>
          <p><strong>分类：</strong>{{ artItem.shangpinfenlei }}</p>
        
          <p><strong>品牌：</strong>{{ artItem.pinpai }}</p>
          <p><strong>点击数：</strong>{{ artItem.clicknum }}</p>

          <!-- 操作按钮 -->
          <div class="button-group">
            <el-input-number
              v-model="num"
              :min="1"
              :max="100"
              @change="handleChange"
            />
            <el-button type="danger" @click="addToCart" class="btn"
              >加入购物车</el-button
            >
            <el-button type="primary" @click="buyNow" class="btn"
              >立即购买</el-button
            >
            <el-button type="Search" :icon="FaStar" circle />
            <!-- <button @click="addToFavorites" class="btn">收藏</button> -->
          </div>
        </div>
      </div>
      <!-- 详情 -->
      <div>
        <div v-html="artItem.shangpinxiangqing"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { FaStar } from "vue3-icons/fa6";
const route = useRoute();

const artItem = ref(null);
const item = localStorage.getItem("artItem");
artItem.value = item ? JSON.parse(item) : null;

console.log(artItem.value);

const num = ref(1);
// 加减
const handleChange = (value) => {
  console.log(value);
};
const addToCart = () => {
  alert('商品已加入购物车');
};

const buyNow = () => {
  alert('商品已加入购物车，准备结算');
};
onMounted(() => {
  console.log(artItem.value);
});
</script>
<style lang="scss" scoped>
.page {
  margin-top: 60px;
  min-height: 400px;
  width: 1000px;
  margin: 60px auto 20px;
}
.breadcrumb {
  padding: 20px;
}
.product {
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 20px;
}
.product-container {
  display: flex;
  justify-content: space-between;
}

.product-img {
  flex: 0 0 40%; /* 左侧图片部分占 40% */
  text-align: center;
}

.product-img img {
  max-width: 100%;
  height: auto;
}

.product-info {
  flex: 1; /* 右侧信息部分占 60% */
  padding-left: 20px;
}

.product-info h2 {
  font-size: 24px;
  font-weight: bold;
}

.product-info p {
  font-size: 16px;
  line-height: 1.5;
}

.button-group {
  margin-top: 20px;
}

// .button-group .btn {
//   //   padding: 10px 20px;
//   background-color: #9382ca;
//   margin-right: 10px;
//   border: none;
//   cursor: pointer;
//   font-size: 16px;
//   border-radius: 5px;
// }

// .button-group .btn:hover {
//   background: #a89ec9;
// }
</style>
