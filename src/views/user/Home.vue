<!--
 * @Descripttion: 首页
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 14:13:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-26 13:38:42
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

    <!-- 智能推荐 -->
    <div class="tuijian-box">
      <div class="pheading">
        <h1>智能推荐</h1>
      </div>
      <div class="tj">
        <ul class="main-nav">
          <li
            v-for="(item, index) in tuijianList"
            :key="index"
            :class="`item${index + 1}`"
          >
            <div class="bg">
              <img :src="`${item.tupian}`" mode="scaleToFill" />
              <div class="info">{{ item.shangpinmingcheng }}</div>
            </div>
          </li>
          <!-- <li class="item1">
            <div
              class="bg"
              :style="{background:`url(${tuijianList.value[0].tupian}`）}"
            ></div>
          </li>
          <li class="item2">
            <div class="bg"></div>
          </li>
          <li class="item3">
            <div class="bg"></div>
          </li>
          <li class="item4">
            <div class="bg"></div>
          </li>
          <li class="item5">
            <div class="bg"></div>
          </li> -->
        </ul>
        <button class="more">更多</button>
      </div>
    </div>
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
      <button class="more">更多</button>
    </div>
  </div>
</template>

<script setup>
import {
  fetchCarouselImages,
  fetchShangpinSortList,
  fetchNewsList,
} from "@/services/homeServices";
import News from "@/components/News.vue";
import { ref, onMounted } from "vue";

const carouselImages = ref({}); // 用于存放轮播图的数组
const newsList = ref({}); // 用于存news的数组
const tuijianList = ref({}); // 用于存news的数组

// 异步获取数据
const fetchData = async () => {
  try {
    carouselImages.value = await fetchCarouselImages(); // 获取轮播图数据
    tuijianList.value = await fetchShangpinSortList(); //推荐列表
  } catch (error) {
    console.error("Error fetching carousel images:", error);
  }
  try {
    newsList.value = await fetchNewsList();
  } catch (error) {
    console.error("Error fetching news List:", error);
  }
};

// 在组件挂载时调用 fetchData
onMounted(fetchData);
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
  position: relative;
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
  margin: 20px 0 80px;
}
.pheading {
  position: relative;
}
.pheading h1 {
  position: relative;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: 160px;
  text-align: center;
  margin: 2rem auto;
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

// 推荐
.tj {
  height: 500px;
  width: 100%;
  position: relative;
  background: rgb(56 62 117);
}
.main-nav {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  width: 50%;
  height: 150px;
}

.main-nav li {
  cursor: pointer;
  list-style: none;
  position: absolute;
  width: 200px;
  height: 200px;
  background: #000;
  transform: rotate(45deg);
  transition: 0.5s;
  margin: -100px;
  overflow: hidden;
  opacity: 0.8;
}

.main-nav li .bg {
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    // transform: rotate(-45deg);
  }
  .info {
    color: #fff;
    font-size: 14px;
    position: absolute;
    width: 100%;
    padding: 5px 10px;
    bottom: 0px;
    transition: 0.5s;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
  }
}
.main-nav li:hover {
  opacity: 1;
  box-shadow: 0px 0px 15px 0px #bdbdbd;
  transform: rotate(0deg) scale(1.2);
  z-index: 99;
  .bg .info {
    opacity: 1;
  }
}

.main-nav li.item1 {
  top: 0;
  left: 0;
}

.main-nav li.item2 {
  bottom: 0;
  left: 25%;
}

.main-nav li.item3 {
  top: 0;
  left: 50%;
}

.main-nav li.item4 {
  bottom: 0;
  left: 75%;
}

.main-nav li.item5 {
  top: 0;
  left: 100%;
}
.more {
  position: absolute;
  right: 20px;
  bottom: 25px;
  --😀: #644dff;
  --😀😀: #4836bb;
  --😀😀😀: #654dff63;
  cursor: pointer;
  width: 70px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 0.8em;
  font-weight: 800;
  letter-spacing: 2px;
  color: #fff;
  background: var(--😀);
  border: 2px solid var(--😀😀);
  border-radius: 0.75rem;
  box-shadow: 0 8px 0 var(--😀😀);
  transform: skew(-10deg);
  transition: all 0.1s ease;
  filter: drop-shadow(0 15px 20px var(--😀😀😀));
}

.more:active {
  letter-spacing: 0px;
  transform: skew(-10deg) translateY(8px);
  box-shadow: 0 0 0 var(--😀😀😀);
}
</style>
