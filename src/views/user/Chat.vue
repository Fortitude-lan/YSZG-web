<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 14:13:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-22 22:46:16
-->

<template>
  <div class="pageM">
    <!-- title -->
    <div
      :style="{
        width: '100%',
        textAlign: 'center',
      }"
    >
      <div class="pheading">
        <h1>智能客服</h1>
      </div>
      <div class="dialog">
        <div class="chat-content" id="chat-content">
          <div v-bind:key="item.id" v-for="item in chatList">
            <div v-if="item.ask" class="right-content">
              <el-alert
                class="text-content"
                :title="item.ask"
                :closable="false"
                type="warning"
              ></el-alert>
            </div>
            <div v-else class="left-content">
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
            v-model="form.ask"
            placeholder="请输入内容"
            style="width: calc(100% - 80px); float: left"
          >
          </el-input>
          <el-button type="primary" @click="addChat">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { fetchChat, fetchAddChat } from "@/services/headerServices";
// 反应式数据
const form = reactive({
  ask: "", // 用于用户输入的问题
});
const chatList = ref([]); // 聊天记录列表
// 获取聊天记录的异步函数
const getChatList = async () => {
  try {
    const res = await fetchChat();
    chatList.value = res || [];
    const div = document.getElementById("chat-content")[0];
    setTimeout(() => {
      if (div) div.scrollTop = div.scrollHeight;
    }, 0);
  } catch (error) {
    console.error("Error fetching chat list:", error);
  }
};
// 发送聊天内容的函数
const addChat = async () => {
  if (!form.ask) return; // 如果没有输入内容则不发送

  try {
    const response = await fetchAddChat(form.ask);

    if (response === 1) {
      form.ask = ""; // 清空输入框
      await getChatList(); // 重新加载聊天记录
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
  }
};
// 页面加载时获取聊天记录
onMounted(async () => {
  await getChatList(); // 加载聊天记录
});
</script>

<style lang="scss" scoped>
.pageM {
  padding: 100px 5%;
  min-height: 80vh;
}
.dialog {
  width: 80%;
  margin: 0 auto;
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
