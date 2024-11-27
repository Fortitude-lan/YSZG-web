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
          <h2>
            {{ artItem.shangpinmingcheng }}
            <el-tag type="primary">{{ artItem.biaoqian }}</el-tag>
          </h2>
          <p>
            <strong>价格：</strong>
            <span class="price"> ￥{{ artItem.price }}</span>
          </p>
          <p><strong>分类：</strong>{{ artItem.shangpinfenlei }}</p>

          <p><strong>品牌：</strong>{{ artItem.pinpai }}</p>
          <p><strong>点击数：</strong>{{ artItem.clicknum }}</p>
          <el-button
            :type="isfavor.status ? 'danger' : 'warning'"
            :icon="FaStar"
            round
            @click="handleFavor(isfavor.status)"
            >{{ isfavor.status ? "已收藏" : "点击收藏" }}</el-button
          >

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
            <!-- <button @click="addToFavorites" class="btn">收藏</button> -->
          </div>
        </div>
      </div>
      <!-- 详情 -->
      <div>
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="艺术品详情" name="detail">
            <div v-html="artItem.shangpinxiangqing"></div
          ></el-tab-pane>
          <el-tab-pane label="评论" name="remark">
            <!-- 评论 -->
            <!-- 选择器 -->
            <el-form
              ref="formRef"
              :model="form"
              label-width="auto"
              class="form"
            >
              <el-form-item label="" prop="content">
                <el-input
                  type="textarea"
                  minlengt="5"
                  maxlength="200"
                  placeholder="评论互动一下吧！"
                  show-word-limit
                  v-model="form.content"
                  rows="5"
                />
              </el-form-item>

              <el-form-item class="form-btns">
                <el-button type="primary" @click="onSubmit(formRef)"
                  >查询</el-button
                >
                <el-button @click="resetForm(formRef)">重置</el-button>
              </el-form-item>
            </el-form>
            <!-- remark List -->
            <ul class="rklist">
              <li v-for="(item, index) in rkList" :key="index">
                <div class="rkt">
                  <div class="rkt-1">
                    <el-avatar
                      :size="50"
                      src="https://pic1.zhimg.com/v2-7c3aa1bc7e87dd05b0083d8d7a85a268_r.jpg"
                    />
                    <span
                      ><strong>{{ item.userid }}</strong></span
                    >
                  </div>
                  <div class="time">
                    {{ item.addtime }}
                  </div>
                </div>
                <div class="rk-content">
                  {{ item.content }}
                </div>
              </li>
            </ul>
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { FaStar } from "vue3-icons/fa6";
import {
  fetchRemarkList,
  fetchRemarkSave,
  fetchIsFavor,
  fetchAddFavor,
  fetchDelFavor,
} from "@/services/homeServices";
import { ElMessage } from "element-plus";

const route = useRoute();
const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 6, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
// 响应式数据
const isfavor = ref({
  status: false,
  id: "",
});
const rkList = ref(null);
const artItem = ref({
  tupian: "", // 商品图片的 URL
  shangpinmingcheng: "", // 商品名称
  biaoqian: "", // 商品标签
  price: 0.0, // 商品价格
  shangpinfenlei: "", // 商品分类
  pinpai: "", // 商品品牌
  clicknum: 0, // 商品点击数
});

const formRef = ref();
const form = reactive({
  content: "",
});
const fetchData = async () => {
  //info
  const item = localStorage.getItem("artItem");
  artItem.value = item ? JSON.parse(item) : null;
  await fetchIsfavor();
  const { list, totalPage, currPage } = await fetchRemarkList(
    { refid: artItem.value.id },
    pagination.currentPage,
    pagination.pageSize
  );

  rkList.value = list;
  pagination.totalPage = totalPage || 0; // 更新总页数
  pagination.currentPage = currPage || 1; // 更新当前页码
};
//favor
const fetchIsfavor = async () => {
  const data = await fetchIsFavor({ userid, refid: artItem.value.id });
  if (data.code == 0) {
    isfavor.value = data;
  } else {
    console.log("error");
  }
};
const activeName = ref("detail");

const handleClick = (tab, event) => {
  console.log(tab, event);
};

const num = ref(1);

const handleFavor = async (state) => {
  console.log(state);
  if (state) {
    console.log("取消");
    console.log(isfavor.value);
    const msg = await fetchDelFavor([isfavor.value.id]);
    if (msg == 0) {
      await fetchIsfavor();
    } else {
      console.log("error");
    }
  } else {
    console.log("添加");
    const params = {
      name: artItem.value.shangpinmingcheng,
      picture: artItem.value.tupian,
      refid: artItem.value.id,
      userid,
      ...form,
    };
    const msg = await fetchAddFavor(params);
    if (msg == 0) {
      await fetchIsfavor();
    }
  }
};
// 加减
const handleChange = (value) => {
  console.log(value);
};
const addToCart = () => {
  alert("商品已加入购物车");
};

const buyNow = () => {
  alert("商品已加入购物车，准备结算");
};
//提交
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        refid: artItem.value.id,
        userid,
        ...form,
      };
      const msg = await fetchRemarkSave(params);
      if (msg == 0) {
        ElMessage({
          message: "成功",
          type: "success",
        });
        //刷新
        await fetchData();
        console.log("submit!");
      } else {
        ElMessage.error("error");
      }
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
onMounted(() => {
  fetchData();
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
  h2 {
    color: #a38ffd;
  }
  p {
    padding: 10px 0;
  }
  .price {
    color: #f56c6c;
    font-weight: bold;
  }
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
.rklist {
  li {
    border-bottom: 2px solid #a38ffd;
    padding: 0 0 10px;
    margin-bottom: 20px;
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
.form-btns {
  :deep(.el-form-item__content) {
    justify-content: center;
  }
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
