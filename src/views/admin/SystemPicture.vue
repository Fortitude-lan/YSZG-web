<template>
  <!-- 选择器 -->
  <el-form ref="formRef" :model="form" label-width="auto" class="form">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item class="form-btns">
      <el-button type="primary" @click="onSubmit(formRef)">查询</el-button>
      <el-button @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="noraml-btn">
    <button @click="openAdd()">新增</button>
    <button @click="delSubmit()">删除</button>
  </div>
  <!-- 动态渲染表头 -->
  <el-table
    :data="tableData"
    @selection-change="handleSelectionChange"
    :row-key="(row) => row.id"
    ref="tableRef"
    style="width: 100%"
    class="table"
  >
    <!-- 多选框 -->
    <el-table-column type="selection" width="55"></el-table-column>

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
          <span v-else-if="column.prop === 'value'">
            <img
              :src="scope.row[column.prop]"
              alt="图片"
              style="width: 50px; height: 50px; object-fit: cover"
            />
          </span>
          <!-- 其他列默认渲染 -->
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </div>
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="openUpdate(scope.row)"
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
  <!-- 抽屉 修改 -->
  <el-drawer v-model="drawerVisible" title="修改信息" size="80%">
    <el-form ref="infoformRef" :model="infoValidateForm" class="form-layout">
      <div class="form-row">
        <el-form-item label="名称" class="form-item" required prop="name">
          <el-input
            v-model="infoValidateForm.name"
            placeholder="名称"
            required
          />
        </el-form-item>
        <el-form-item label="照片" class="form-item">
          <el-upload
            class="upload-demo"
            drag
            :action="`${baseUrl}/file/upload`"
            :headers="headers"
            :show-file-list="false"
            :on-success="(res) => handleUpdateImage(res, 'update')"
          >
            <img
              :style="{
                border: '1px dashed #999',
                cursor: 'pointer',
                color: '#999',
                borderRadius: '6px',
                textAlign: 'center',
                background: '#f9f9f9',
                width: '150px',
                fontSize: '32px',
                lineHeight: '100px',
                height: 'auto',
              }"
              v-if="infoValidateForm.value"
              :src="infoValidateForm.value"
              class="avatar"
            />

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </div>
      <div class="tt">
        <el-button
          type="primary"
          @click.prevent="onUpdateSubmit(infoformRef)"
          class="edit-button"
          >提交</el-button
        >
      </div>
    </el-form>
  </el-drawer>
  <!-- 抽屉 add -->
  <el-drawer v-model="adddrawerVisible" title="添加" size="80%">
    <el-form ref="addformRef" :model="addValidateForm" class="form-layout">
      <div class="form-row">
        <el-form-item label="名称" class="form-item" required>
          <el-input
            v-model="addValidateForm.name"
            placeholder="名称"
            required
          />
        </el-form-item>
        <el-form-item label="照片" class="form-item">
          <el-upload
            class="upload-demo"
            drag
            :action="`${baseUrl}/file/upload`"
            :headers="headers"
            :show-file-list="false"
            :on-success="(res) => handleUpdateImage(res, 'add')"
          >
            <img
              :style="{
                border: '1px dashed #999',
                cursor: 'pointer',
                color: '#999',
                borderRadius: '6px',
                textAlign: 'center',
                background: '#f9f9f9',
                width: '150px',
                fontSize: '32px',
                lineHeight: '100px',
                height: 'auto',
              }"
              :src="addValidateForm.value"
              class="avatar"
            />

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </div>

      <div class="tt">
        <el-button
          type="primary"
          @click.prevent="onAddSubmit(addformRef)"
          class="edit-button"
          >提交</el-button
        >
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
import {
  fetchConfigListPage,
  fetchConfigDel,
  fetchConfigAdd,
  fetchConfigUpdate,
} from "@/services/backServices";
import { reactive, onMounted, ref } from "vue";
import { baseUrl } from "@/utils/util";
import { TiTick } from "vue3-icons/ti";
import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
import { fetchSaveInfo } from "@/services/userServices";
import { ElMessage, ElMessageBox } from "element-plus";
import { httpURL } from "@/utils/util";

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
// 控制 el-drawer 的显示状态
const drawerVisible = ref(false);
const adddrawerVisible = ref(false);
const selectRow = ref({});

const formRef = ref();
const form = reactive({
  name: "",
});
const infoformRef = ref();
const infoValidateForm = reactive({
  id: "",
  name: "",
  value: "",
});
const addformRef = ref();
const addValidateForm = reactive({
  name: "",
  value: "",
});
// 选中的行
const selectedRows = ref([]);
// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "name", label: "名称", width: "130" },
  { prop: "value", label: "值", width: "120" },
]);

// 构建查询参数
const buildQueryParams = () => {
  const query = {};
  if (form.name) {
    query.name = `%${form.name}%`;
  }
  return query;
};
//获取数据
const fetchData = async () => {
  try {
    const query = buildQueryParams(); // 使用统一查询方法
    const { list, totalPage, currPage } = await fetchConfigListPage(
      query,
      pagination.currentPage,
      pagination.pageSize
    );
    // 获取list信息
    tableData.value = list;
    pagination.totalPage = totalPage || 0; // 更新总页数
    pagination.currentPage = currPage || 1; // 更新当前页码
  } catch (error) {
    console.error("Failed to fetch table columns:", error);
  }
};
// 监听选中行变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
  console.log("当前选中的行:", selectedRows.value);
};

// 输出选中数据
const handleSelectedRows = () => {
  console.log("选中的行数据:", selectedRows.value);
};

//查找
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      pagination.currentPage = 1; // 查询时重置为第一页
      await fetchData();
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 控制密码显示/隐藏的状态
const isPasswordVisible = ref(false);
// 切换密码可见性
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
const openUpdate = async (row) => {
  // 回显数据到表单
  infoValidateForm.id = row.id || "";
  infoValidateForm.name = row.name || "";
  infoValidateForm.value = row.value || null;
  selectRow.value = row;
  drawerVisible.value = true;
};
//打开抽屉
const openAdd = async () => {
  adddrawerVisible.value = true;
};
// 上传图片成功后回调
const handleUpdateImage = (response, type) => {
  //图片的URL
  let imageUrl;
  if (type == "add") {
    imageUrl = `${httpURL}/upload/${response.file}`; // 修改为实际的返回路径字段
    console.log(imageUrl);

    addValidateForm.value = imageUrl; // 更新表单中的图片路径
  } else {
    imageUrl = `${httpURL}/upload/${response.file}`; // 修改为实际的返回路径字段
    console.log(imageUrl);

    infoValidateForm.value = imageUrl; // 更新表单中的图片路径
  }

  // 提示用户上传成功
  ElMessage({
    message: "图片上传成功",
    type: "success",
  });
};
const headers = ref({
  Token: localStorage.getItem("Token"),
});
const onAddSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        ...addValidateForm,
      };
      const msg = await fetchConfigAdd(params);
      if (msg === 0) {
        ElMessage({
          message: "添加成功",
          type: "success",
        });
        adddrawerVisible.value = false;
        formEl.resetFields();
        await fetchData();
      } else {
        ElMessage({
          message: "添加失败",
          type: "error",
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
const onUpdateSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        ...selectRow.value,
        ...infoValidateForm,
      };
      const msg = await fetchConfigUpdate(params);
      if (msg === 0) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        drawerVisible.value = false;
        await fetchData();
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
// del
const delSubmit = () => {
  console.log("del");
  if (selectedRows.value.length <= 0) {
    ElMessage({
      message: "至少选择一行",
      type: "warning",
    });
  } else {
    ElMessageBox.confirm("确认删除选中行?", "删除", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const ids = selectedRows.value.map((i) => i.id);
        console.log(ids);
        const msg = await fetchConfigDel([ids]);
        if (msg == 0) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          //刷新
          await fetchData();
        }
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "删除失败",
        });
      });
  }
};
//del row
const delConfirm = async (row) => {
  console.log(row);
  const msg = await fetchConfigDel([row.id]);
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
.table {
  height: 400px;
}
.form {
  margin: 10px 0;
  width: 70vw;
  display: flex;
  :deep(.el-form-item) {
    padding-left: 10px;
  }
}
.form-btns {
  :deep(.el-form-item__content) {
    min-width: 150px;
    display: flex;
  }
}
.noraml-btn button {
  margin-right: 10px;
}
.tt {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
