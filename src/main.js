/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 13:34:11
 * @LastEditors: Hesin
 * @LastEditTime: 2024-12-01 17:52:07
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue';
import 'element-plus/dist/index.css'
import './assets/css/style.scss'
import './assets/css/ui.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import App from './App.vue'
import router from './router'
import store from './store';
const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.use(ElementPlus)
app.use(Antd)
app.use(store);
app.use(router) // 注册路由
app.mount('#app')