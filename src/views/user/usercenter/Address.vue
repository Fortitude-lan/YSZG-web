<template>
  <div>
    <div class="noraml-btn">
      <button @click="addFormVisible = true">+ 新增</button>
      <!--   <button @click="delSubmit()">删除</button> -->
    </div>
    <!-- 动态渲染表头 -->
    <el-table
      :data="tableData"
      :row-key="(row) => row.id"
      ref="tableRef"
      style="width: 100%"
      class="table"
    >
      <!-- 多选框 -->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->

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
            <span v-if="column.prop === 'isdefault'">
              <!-- 如果是 "是"，显示绿色的勾 -->
              <span v-if="scope.row[column.prop] === '是'">
                <TiTick size='25' color="#77f5ab" />
              </span>
              <!-- 如果是 "否"，显示红色的叉 -->
              <span v-else> 否 </span>
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
            @click="updRow(scope.row)"
          >
            修改
          </el-button>
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
    <!-- ADD -->
    <el-dialog v-model="addFormVisible" title="新增地址" width="500">
      <el-form ref="addformRef" :model="addform">
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="addform.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-form ref="addformRef" :model="addform">
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="addform.phone" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-form-item label="是否默认" :label-width="formLabelWidth" prop="role">
        <el-radio-group v-model="addform.isdefault">
          <el-radio value="是">是</el-radio>
          <el-radio value="否">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form ref="addformRef" :model="addform">
        <el-form-item label="联系地址" :label-width="formLabelWidth">
          <el-input v-model="addform.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddSubmit(addformRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- UPDATE -->
    <el-dialog v-model="updFormVisible" title="修改地址" width="500">
      <el-form ref="updformRef" :model="updform">
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="updform.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-form ref="updformRef" :model="updform">
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="updform.phone" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-form-item label="是否默认" class="form-item" prop="role">
        <el-radio-group v-model="updform.isdefault">
          <el-radio value="是">是</el-radio>
          <el-radio value="否">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form ref="updformRef" :model="updform">
        <el-form-item label="联系地址" :label-width="formLabelWidth">
          <el-input v-model="updform.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdSubmit(updformRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import {
  fetchAddressList,
  fetchAddressAdd,
  fetchAddressDel,
  fetchAddressUpd,
} from "@/services/userServices";
import { BsFillEmojiHeartEyesFill } from "vue3-icons/bs";
import { TiTick } from "vue3-icons/ti";
import { ElMessage, ElMessageBox } from "element-plus";
const formLabelWidth = "120";
// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 5, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

const addformRef = ref();
const addFormVisible = ref(false);
const addform = reactive({
  name: "",
  phone: "",
  isdefault: "否",
  address: "",
});
const updformRef = ref();
const updFormVisible = ref(false);
const updform = reactive({
  name: "",
  phone: "",
  isdefault: "否",
  address: "",
  id: "",
});
// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "name", label: "联系人", width: "180" },
  { prop: "address", label: "地址", width: "180" },
  { prop: "isdefault", label: "是否默认", width: "80" },
]);

//获取数据
const fetchData = async () => {
  try {
    const { list, totalPage, currPage } = await fetchAddressList(
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
//修改
const updRow = (row) => {
  console.log(row);
  updFormVisible.value = true;
  updform.name = row.name || "";
  updform.phone = row.phone || "";
  updform.isdefault = row.isdefault || "否";
  updform.address = row.address || "";
  updform.id = row.id || "";
};
// add
const onAddSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(addform);
      const msg = await fetchAddressAdd(addform);
      if (msg == 0) {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        //
        addFormVisible.value = false;
        //更新
        await fetchData();
      } else {
        ElMessage({
          message: "新增失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
//update
const onUpdSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(updform);
      const msg = await fetchAddressUpd(updform);
      if (msg == 0) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        //
        updFormVisible.value = false;
        //更新
        await fetchData();
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
//del raw
const delConfirm = async (row) => {
  console.log(row);
  const msg = await fetchAddressDel([row.id]);
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
// 生命周期钩子，获取表头数据
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.noraml-btn button {
  margin: 10px 10px 10px 0;
  background-color: rgb(137, 122, 223);
}
</style>
