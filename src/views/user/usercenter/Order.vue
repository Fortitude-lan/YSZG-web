<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleOrder">
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      >
        <!-- 动态渲染表头 -->
        <el-table
          :data="tableData"
          :row-key="(row) => row.id"
          ref="tableRef"
          style="width: 100%"
          class="table"
        >
          <!-- 动态渲染表头 -->
          <el-table-column
            v-for="(column, index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width || 'auto'"
          >
            <!-- 重写列内容 -->
            <template #default="scope">
              <div>
                <!-- 获取当前行数据（item） -->
                <span v-if="column.prop === 'num'">
                  {{
                    (pagination.currentPage - 1) * pagination.pageSize +
                    scope.$index +
                    1
                  }}
                  <!-- 显示当前列的值，并显示当前行号 -->
                </span>
                <span v-else-if="column.prop === 'picture'">
                  <img
                    :src="scope.row[column.prop]"
                    alt=""
                    style="width: 100px"
                  />
                  <!-- 显示当前列的值，并显示当前行号 -->
                </span>
                <!-- 其他列默认渲染 -->
                <span v-else>
                  {{ scope.row[column.prop] }}
                </span>
              </div>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作" min-width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="refund(scope.row)"
                v-if="activeName == '已支付'"
              >
                退款
              </el-button>
              <!-- <el-popconfirm title="确定要删除吗?">
                <template #reference>
                  <el-button link type="danger" size="small"> 删除 </el-button>
                </template>
                <template #actions="{ confirm, cancel }">
                  <el-button size="small" @click="cancel">否</el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="delConfirm(scope.row)"
                  >
                    是
                  </el-button>
                </template>
              </el-popconfirm> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="margin: 20px 0 0">
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
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";

import { fetchOrderList, fetchRefond } from "@/services/userServices";
import { ElMessage, ElMessageBox } from "element-plus";
// 存储 tab 数据
const tabs = [
  { label: "未支付", name: "未支付" },
  { label: "已支付", name: "已支付" },
  { label: "已发货", name: "已发货" },
  { label: "已完成", name: "已完成" },
  { label: "已退款", name: "已退款" },
  { label: "已取消", name: "已取消" },
];
const activeName = ref("未支付");

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 5, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "70" },
  { prop: "orderid", label: "订单编号", width: "130" },
  { prop: "picture", label: "图片", width: "120" },
  { prop: "goodname", label: "商品", width: "120" },
  { prop: "discountprice", label: "单格", width: "100" },
  { prop: "buynumber", label: "数量", width: "70" },
  { prop: "discounttotal", label: "总价", width: "100" },
  { prop: "address", label: "地址", width: "130" },
]);

const buildQueryParams = () => {
  const query = {};
  if (activeName.value) {
    query.status = `${activeName.value}`;
  }
  return query;
};

//获取数据
const fetchData = async () => {
  try {
    const query = buildQueryParams(); // 使用统一查询方法
    const { list, totalPage, currPage } = await fetchOrderList(
      query,
      pagination.currentPage,
      pagination.pageSize
    );
    // 获取科室信息，包含分页
    tableData.value = list;
    pagination.totalPage = totalPage || 0; // 更新总页数
    pagination.currentPage = currPage || 1; // 更新当前页码
  } catch (error) {
    console.error("Failed to fetch table columns:", error);
  }
};
const handleOrder = (name) => {
  console.log(name);
  activeName.value = name;
  fetchData();
};
const refund = async (itm) => {
  const msg = await fetchRefond(itm);
  console.log("退款款", msg);
  if (msg == 0) {
    ElMessage({
      message: "退款成功",
      type: "success",
    });
  }
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
// 在组件挂载时调用
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped></style>
