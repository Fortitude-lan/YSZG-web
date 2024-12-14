<template>
  <div class="min300">
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
            <span v-else-if="column.prop === 'buynumber'">
              <el-input-number
                v-model="scope.row[column.prop]"
                :min="1"
                @change="
                  (currentValue, oldValue) =>
                    onAddSubmit(currentValue, oldValue, scope.row)
                "
              />
            </span>
            <span v-else-if="column.prop === 'picture'">
              <img :src="scope.row[column.prop]" alt="" style="width: 100px" />
            </span>
            <span v-else-if="column.prop === 'price'">
              ￥{{ scope.row[column.prop] }}
            </span>
            <!-- 其他列默认渲染 -->
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" min-width="80">
        <template #default="scope">
          <el-popconfirm title="确定要删除吗?">
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
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="btns">
      <span>总价：￥{{ totalPrice }}</span>
      <el-button type="danger" @click="onBuySubmit">
        <CiShoppingCart />点击购买</el-button
      >
    </div>

    <!-- 抽屉 -->
    <el-drawer v-model="drawerVisible" title="订单确认" size="80%">
      <el-tag
        type="primary"
        style="font-size: 16px; padding: 15px; margin: 10px 0"
        >地址</el-tag
      >
      <!-- 动态渲染表头 -->
      <el-table
        :data="tableData2"
        :row-key="(row) => row.id"
        ref="tableRef"
        style="width: 100%"
        class="table"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <!-- 动态渲染表头 -->
        <el-table-column
          v-for="(column, index) in columns2"
          :key="index"
          :label="column.label"
          :prop="column.prop"
          :width="column.width || 'auto'"
        >
          <!-- 重写列内容 -->
          <template #default="scope">
            <div>
              <span v-if="column.prop === 'num'">
                {{
                  (pagination.currentPage - 1) * pagination.pageSize +
                  scope.$index +
                  1
                }}
                <!-- 显示当前列的值，并显示当前行号 -->
              </span>
              <!-- 获取当前行数据（item） -->
              <span v-if="column.prop === 'num'">
                <!-- 显示当前列的值，并显示当前行号 -->
              </span>
              <!-- 其他列默认渲染 -->
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-tag
        type="primary"
        style="font-size: 16px; padding: 15px; margin: 10px 0"
        >清单</el-tag
      >
      <!-- 清单列表 -->
      <el-table
        :data="tableData"
        :row-key="(row) => row.id"
        ref="tableRef"
        style="width: 100%"
        class="table"
      >
        <!-- 动态渲染表头 -->
        <el-table-column
          v-for="(column, index) in columns3"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width || 'auto'"
        >
          <!-- 重写列内容 -->
          <template #default="scope">
            <div>
              <!-- 获取当前行数据（item） -->
              <span v-if="column.prop === 'picture'">
                <img :src="scope.row[column.prop]" alt="" style="width: 80px" />
              </span>
              <span v-else-if="column.prop === 'price'">
                ￥{{ scope.row[column.prop] }}
              </span>
              <span v-else-if="column.prop === 'totalPrice'">
                ￥{{
                  (
                    Number(scope.row["price"]) * Number(scope.row["buynumber"])
                  ).toFixed(2)
                }}
              </span>
              <!-- 其他列默认渲染 -->
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 支付 -->
      <div class="btns">
        <span>总价：￥{{ totalPrice }}</span>

        <el-button type="danger" style="margin: 20px 0" @click="onPaySubmit">
          <CiShoppingCart />确认支付</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  fetchCartList,
  fetchCartDel,
  fetchCartUpdate,
  fetchAddressList,
  fetchOrderAdd,
} from "@/services/userServices";
import { CiShoppingCart } from "vue3-icons/ci";
import { ElMessage, ElMessageBox } from "element-plus";
import { genTradeNo } from "@/utils/util";
const tableRef = ref();
const router = useRouter();

// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "picture", label: "商品图片", width: "180" },
  { prop: "goodname", label: "商品名称", width: "180" },
  { prop: "price", label: "价格", width: "120" },
  { prop: "buynumber", label: "数量", width: "200" },
]);
const columns3 = ref([
  { prop: "picture", label: "商品图片", width: "180" },
  { prop: "goodname", label: "商品名称", width: "180" },
  { prop: "price", label: "单格", width: "120" },
  { prop: "buynumber", label: "数量", width: "80" },
  { prop: "totalPrice", label: "总价", width: "200" },
]);
// 表头数据
const tableData2 = ref([]);
// 自定义表头
const columns2 = ref([
  { prop: "num", label: "选择", width: "60" },
  { prop: "name", label: "收件人", width: "200" },
  { prop: "phone", label: "联系方式", width: "200" },
  { prop: "address", label: "地址", width: "200" },
]);
// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10000, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
//totalPrice
const totalPrice = ref(0);
// 控制 el-drawer 的显示状态
const drawerVisible = ref(false);

//获取数据
const fetchData = async () => {
  try {
    const { list, totalPage, currPage } = await fetchCartList(
      pagination.currentPage,
      pagination.pageSize
    );

    tableData.value = list;
    pagination.currentPage = currPage || 1; // 更新当前页码
    pagination.totalPage = totalPage || 0; // 更新总页数

    updateTotalPrice(tableData.value);

    const resAddressList = await fetchAddressList(
      pagination.currentPage,
      pagination.pageSize
    );
    tableData2.value = resAddressList.list;
  } catch (error) {
    console.error("Failed to fetch table columns:", error);
  }
};
// 购物车 + -
const onAddSubmit = async (curVal, oldVal, item) => {
  const params = {
    ...item,
    buynumber: curVal,
  };
  const msg = await fetchCartUpdate(params);
  if (msg == 0) {
    //更新
    await fetchData();
  }
};
//del raw
const delConfirm = async (row) => {
  console.log(row);
  const msg = await fetchCartDel([row.id]);
  if (msg == 0) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //刷新
    await fetchData();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

// 计算总价
const updateTotalPrice = (list) => {
  const total = Array.from(list.values()).reduce((sum, row) => {
    const itemPrice = row.buynumber * row.price;
    return sum + itemPrice;
  }, 0);

  totalPrice.value = parseFloat(total.toFixed(2)); // 保留两位小数
};

//购买
const onBuySubmit = () => {
  drawerVisible.value = true;
};
//地址
const currentAddr = ref();
const handleCurrentChange = (val) => {
  currentAddr.value = val.address;
};
//支付
const onPaySubmit = async () => {
  if (!currentAddr.value) {
    ElMessage({
      message: "请选择一行收货地址",
      type: "warning",
    });
  } else {
    console.log(tableData);
    let msg = 1;
    for (let item of tableData.value) {
      console.log("订单", item);
      const orderid = genTradeNo();
      let order = {
        orderid,
        tablename: item.tablename,
        goodid: item.goodid,
        goodname: item.goodname,
        picture: item.picture,
        buynumber: Number(item.buynumber),
        discountprice: 0,
        price: item.price,
        discounttotal: Number(item.price) * Number(item.buynumber),
        type: 1,
        total: totalPrice.value,
        address: currentAddr.value,
        status: "未支付",
      };
      msg = await fetchOrderAdd(order);
      if (msg == 0) {
        //删除
        const delcart = await fetchCartDel([item.id]);
      }
    }
    console.log(msg);
    if (msg == 0) {
      ElMessage({
        message: "订单成功，请到个人中心查看",
        type: "success",
      });
      router.push({ path: "/front/ucenter/cart" });
    } else {
      ElMessage({
        message: "订单失败",
        type: "error",
      });
    }
    drawerVisible.value = false;
    await fetchData();
  }
};

// 生命周期钩子，获取表头数据
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.noraml-btn button {
  margin: 10px 10px 10px 0;
  background-color: rgb(137, 122, 223);
}
:deep(.el-table tr) {
  cursor: pointer;
}
.btns {
  padding: 20px 20px 0 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    padding: 0 20px;
    font-weight: bold;
    color: #f56c6c;
  }
}
</style>
