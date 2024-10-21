<!--
 * @Descripttion: 首页
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 14:13:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-19 18:42:20
-->

<template>
  <div class="block">
    <el-carousel height="100vh">
      <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
        <img
          :src="image"
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </el-carousel-item>
    </el-carousel>

    <!-- 响应式的父盒子 -->
    <div class="news-container">
      <div class="pheading">
        <h1>最新咨询</h1>
      </div>

      <div class="news-grid">
        <News
          v-for="(news, index) in newsList"
          :key="index"
          :imageUrl="news.picture"
          :title="news.title"
          :description="news.introduction"
          :price="news.price"
          :duration="news.addtime"
          :creatorImageUrl="news.creatorImageUrl"
          :creatorName="news.addtime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchCarouselImages, fetchNewsList } from "@/services/homeServices";
import News from "@/components/News.vue";

export default {
  components: {
    News,
  },
  data() {
    return {
      carouselImages: [], // 用于存放轮播图的数组
      newsList: [], // 用于存news的数组
    };
  },
  async mounted() {
    try {
      this.carouselImages = await fetchCarouselImages(); // 获取轮播图数据
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    }
    try {
      this.newsList = await fetchNewsList();
    } catch (error) {
      console.error("Error fetching news List:", error);
    }
  },
};
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.news-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.pheading h1 {
  position: relative;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: 160px;
  text-align: center;
  margin: 5rem auto;
  white-space: nowrap;
  padding-bottom: 13px;
}
.pheading h1:before {
  background-color: #a89ec9;
  content: "";
  display: block;
  height: 3px;
  width: 75px;
  margin-bottom: 5px;
}
.pheading h1:after {
  background-color: #a89ec9;
  content: "";
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 3px;
  width: 75px;
  margin-bottom: 0.25em;
}
</style>
