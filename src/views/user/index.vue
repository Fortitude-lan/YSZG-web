
<template>
  <div>
    <HeaderComponent />
    <!-- 页头 -->
    <main>
      <router-view />
      <!-- 子路由渲染区域 -->
    </main>
    <FooterComponent />
    <!-- 页脚 -->
  </div>
</template>

<script>
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
};
</script>

<style lang="scss" scoped></style>
