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
          <el-table-column fixed="right" label="操作" min-width="120">
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
              <el-button
                link
                type="primary"
                size="small"
                @click="onEvaluate(scope.row)"
                v-else-if="activeName == '已完成'"
              >
                评价
              </el-button>
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
    <!-- 评价 修改 -->
    <el-drawer v-model="drawerVisible" title="评价" size="80%">
      <el-form
        ref="infoformRef"
        :rules="rules"
        :model="infoValidateForm"
        class="form-layout"
      >
        <div class="form-row">
          <el-form-item label="编号" class="form-item" required>
            <el-input
              v-model="infoValidateForm.dingdanbianhao"
              placeholder="编号"
              required
              disabled
            />
          </el-form-item>
          <el-form-item label="名称" class="form-item" required>
            <el-input
              v-model="infoValidateForm.shangpinmingcheng"
              placeholder="名称"
              required
              disabled
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item
            label="分类:"
            class="form-item"
            prop="shangpinfenlei"
            required
            disabled
          >
            <el-input
              v-model="infoValidateForm.shangpinfenlei"
              placeholder="分类"
              required
              disabled
            />
          </el-form-item>
          <el-form-item label="系列/作者" class="form-item" required>
            <el-input
              v-model="infoValidateForm.pinpai"
              placeholder="系列/作者"
              required
              disabled
            />
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="用户名" class="form-item" required>
            <el-input
              v-model="infoValidateForm.yonghuming"
              placeholder=""
              required
              disabled
            />
          </el-form-item>
          <el-form-item label="联系电话" class="form-item" required>
            <el-input
              v-model="infoValidateForm.lianxidianhua"
              placeholder=""
              required
              disabled
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="评分" class="form-item" required prop="pingfen">
            <el-rate v-model="infoValidateForm.pingfen" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="照片" class="form-item">
            <el-upload
              class="upload-demo"
              drag
              :action="`${baseUrl}/file/upload`"
              :headers="headers"
              :show-file-list="false"
              :on-success="(res) => handleUpdateImage(res)"
            >
              <img
                :style="{
                  border: '1px dashed #999',
                  cursor: 'pointer',
                  color: '#999',
                  borderRadius: '6px',
                  textAlign: 'center',
                  background: '#f9f9f9',
                  width: '200px',
                  fontSize: '32px',
                  lineHeight: '100px',
                  height: 'auto',
                }"
                :src="infoValidateForm.tianjiatupian"
                class="avatar"
              />

              <i class="el-icon-upload"></i>
              <div class="el-upload__text">点击上传</div>
            </el-upload>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item
            label="日期:"
            class="form-item"
            prop="pingjiariqi"
            required
          >
            <el-date-picker
              v-model="infoValidateForm.pingjiariqi"
              type="date"
              placeholder="选一个日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item
            label="内容"
            class="form-item"
            required
            prop="pingjianeirong"
          >
            <!-- <el-input
            v-model="infoValidateForm.pingjianeirong"
            type="textarea"
          /> -->
            <div class="no-flex">
              <QuillEditor
                theme="snow"
                v-model:content="infoValidateForm.pingjianeirong"
                contentType="html"
              />
            </div>
          </el-form-item>
        </div>
        <div class="tt">
          <el-button
            type="primary"
            @click.prevent="onSubmit(infoformRef)"
            class="edit-button"
            >提交</el-button
          >
          <el-button
            type="primary"
            plain
            @click="drawerVisible = false"
            class="edit-button"
            >取消</el-button
          >
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { fetchSPInfoList } from "@/services/homeServices";
import { getSession } from "@/services/headerServices";
import { fetchOrderList, fetchRefond } from "@/services/userServices";
import { ElMessage, ElMessageBox } from "element-plus";
import { baseUrl, httpURL } from "@/utils/util";

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
// 控制 el-drawer 的显示状态
const drawerVisible = ref(false);
const selectRow = ref({});
const goodsInfo = ref({});
const userInfo = ref({});
const headers = ref({
  Token: localStorage.getItem("Token"),
});
// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 5, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

//llist form
const infoformRef = ref();
const infoValidateForm = reactive({
  dingdanbianhao: "",
  shangpinmingcheng: "",
  shangpinfenlei: "",
  pinpai: "",
  pingfen: 0,
  tianjiatupian: "",
  pingjiariqi: "",
  shhf: "",
  lianxidianhua: "",
  yonghuming: "",
  pingjianeirong: "",
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
const rules = {
  pingfen: [
    {
      required: true,
      message: "评分不能为空",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error("评分不能为0"));
        } else {
          callback();
        }
      },
    },
  ],
};
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
const onEvaluate = async (row) => {
  // 回显数据到表单
  goodsInfo.value = await fetchSPInfoList(row.goodid);
  userInfo.value = await getSession();
  infoValidateForm.dingdanbianhao = row.orderid || "";
  infoValidateForm.shangpinmingcheng = row.goodname || "";
  infoValidateForm.shangpinfenlei = goodsInfo.value.shangpinfenlei || "";
  infoValidateForm.pinpai = goodsInfo.value.pinpai || "";
  infoValidateForm.lianxidianhua = userInfo.value.lianxidianhua || "";
  infoValidateForm.yonghuming = userInfo.value.yonghuming || "";
  selectRow.value = row;
  drawerVisible.value = true;
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
  await fetchData();
};
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        ...infoValidateForm,
        pingjiariqi: infoValidateForm.pingjiariqi,
      };
      console.log(params);
      // const msg = await fetchEvaluateUpdate(params);
      // if (msg === 0) {
      //   ElMessage({
      //     message: "修改成功",
      //     type: "success",
      //   });
      //   drawerVisible.value = false;
      //   dialogVisible.value = false;
      //   await fetchData();
      // } else {
      //   ElMessage({
      //     message: "修改失败",
      //     type: "error",
      //   });
      // }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 上传图片成功后回调
const handleUpdateImage = (response) => {
  //图片的URL
  let imageUrl;
  imageUrl = `${httpURL}/upload/${response.file}`; // 修改为实际的返回路径字段
  console.log(imageUrl);

  infoValidateForm.tianjiatupian = imageUrl; // 更新表单中的图片路径

  // 提示用户上传成功
  ElMessage({
    message: "图片上传成功",
    type: "success",
  });
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

<style lang="scss" scoped>
.form-item {
  flex: 1; /* 等宽 */
  margin-right: 20px; /* 控制项之间的间距 */
  :deep(.el-form-item__content) {
    align-items: flex-start;
  }
  :deep(.el-form-item__label) {
    width: 100px;
  }
  // :deep(.el-input) {
  //   width: 80%;
  // }
  .no-flex {
    :deep(.el-form-item__content) {
      display: block;
    }
  }
}
.form-row {
  display: flex;
  justify-content: space-between;
}
</style>
