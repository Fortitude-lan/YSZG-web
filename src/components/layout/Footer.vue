<template>
  <footer class="footer">
    <div class="footer-links">
      <a href="#" class="footer-link">隐私政策</a>
      <a href="#" class="footer-link">使用条款</a>
      <a href="#" class="footer-link">帮助中心</a>
      <a href="#" class="footer-link">联系我们</a>
    </div>
    <div class="footer-info">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
      <p>Contact: <a href="mailto:your-email@example.com">@your-email</a></p>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>

.footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.footer-links {
  margin-bottom: 10px;
}

.footer-link {
  margin: 0 15px;
  text-decoration: none;
  color: #007bff;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-info {
  font-size: 14px;
  color: #666;
}
</style>
