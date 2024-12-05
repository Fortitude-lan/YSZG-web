<template>
  <!-- 动态渲染表头 -->
  <el-table
    :data="tableData"
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
          <span v-else-if="column.prop === 'isreply'">
            <!-- 如果是 "是"，显示绿色的勾 -->
            <span v-if="scope.row[column.prop] === 0">
              <TiTick size="25" color="#77f5ab" />
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
    <el-table-column
      prop="isreply"
      label="状态"
      width="100"
      :filters="[
        { text: '已回复', value: 0 },
        { text: '未回复', value: 1 },
      ]"
      :filter-method="filterTag"
      filter-placement="bottom-end"
    >
      <template #default="scope">
        <el-tag
          :type="scope.row.isreply === 0 ? 'danger' : 'success'"
          disable-transitions
          >{{ scope.row.isreply === 0 ? "已回复" : "未回复" }}</el-tag
        >
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <el-button
          link
          type="success"
          size="small"
          @click="openReply(scope.row)"
        >
          回复
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
  <!-- 抽屉 修改 -->
  <el-drawer v-model="drawerVisible" title="回复" size="80%">
    <div class="dialog">
      <div class="chat-content" id="chat-content">
        <div v-bind:key="item.id" v-for="item in chatList">
          <div v-if="item.ask" class="left-content">
            <el-alert
              class="text-content"
              :title="item.ask"
              :closable="false"
              type="warning"
            ></el-alert>
          </div>
          <div v-else class="right-content">
            <el-alert
              class="text-content"
              :title="item.reply"
              :closable="false"
              type="success"
            ></el-alert>
          </div>
          <div class="clear-float"></div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-input
          v-model="form.reply"
          placeholder="请输入内容"
          style="width: calc(100% - 80px); float: left"
        >
        </el-input>
        <el-button type="primary" @click="onReplySubmit">回复</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import {
  fetchChatPage,
  fetchChat,
  fetchChatSave,
} from "@/services/backServices";
import { reactive, onMounted, ref } from "vue";
import { baseUrl } from "@/utils/util";
import { TiTick } from "vue3-icons/ti";
import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
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
// 获取聊天记录的异步函数
const chatList = ref([]); // 聊天记录列表

const formRef = ref();
const form = reactive({
  reply: "",
});

// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "ask", label: "新消息", width: "130" },
]);
const intervalId = ref(null);
//获取数据
const fetchData = async () => {
  try {
    const { list, totalPage, currPage } = await fetchChatPage(
      {},
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
const filterTag = (value, row) => {
  console.log(value, row);
  return row.isreply === value;
};
const selectedRow = ref({});
const openReply = async (row) => {
  // 回显数据到表单
  selectedRow.value = row;
  try {
    intervalId.value = setInterval(async () => {
      let uid = row.userid;
      console.log("first", uid);
      const res = await fetchChat({ userid: uid });
      chatList.value = res.list || [];
      const div = document.getElementById("chat-content")[0];
      setTimeout(() => {
        if (div) div.scrollTop = div.scrollHeight;
      }, 0);
    }, 2500);
  } catch (error) {
    console.error("Error fetching chat list:", error);
  }
  drawerVisible.value = true;
};

// 发送聊天内容的函数
const onReplySubmit = async () => {
  if (!form.reply) return; // 如果没有输入内容则不发送
  try {
    const params = {
      reply: form.reply,
      userid: selectedRow.value.userid,
    };
    console.log(params);
    const res = await fetchChatSave(params);
    if (res == 0) {
      ElMessage({
        type: "success",
        message: "回复成功",
      });
      drawerVisible.value = false;
      clearInterval(intervalId);
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
  }
};
// 切换页码
const handlePageChange = async (page) => {
  pagination.currentPage = page;
};

// 每页条数仍然由前端控制（可选）
const handleSizeChange = async (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1; // 重置为第一页
};

// 生命周期钩子，获取表头数据
onMounted(() => {
  intervalId.value = setInterval(() => {
    fetchData(); // 加载聊天记录
  }, 3000);
});
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value); // 清除定时器
    intervalId.value = null;
  }
});
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
  margin: 100px 0 20px;
}
.no-flex {
  :deep(.el-form-item__content) {
    display: block;
  }
}

.chat-content {
  padding-bottom: 20px;
  margin-bottom: 20px;
  max-height: 300px;
  height: 300px;
  overflow-y: scroll;
  border: 1px solid #eeeeee;
  background: url(https://wallpapercave.com/wp/wp10254485.jpg);

  .left-content {
    float: left;
    margin-bottom: 10px;
    padding: 10px;
    max-width: 80%;
    :deep(.el-alert) {
      background: rgba(188, 192, 247, 0.4);
      border: 1px dashed #63edff;
      color: rgb(255, 255, 255);
    }
  }

  .right-content {
    float: right;
    margin-bottom: 10px;
    padding: 10px;
    max-width: 80%;
    :deep(.el-alert) {
      background: rgba(194, 255, 219, 0.4);
      border: 1px dashed rgb(94, 255, 156);
      color: rgb(255, 255, 255);
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.clear-float {
  clear: both;
}
</style>
