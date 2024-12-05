
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
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
app.use(ElementPlus, { locale: zhCn })
app.use(Antd)
app.use(store);
app.use(router) // 注册路由
app.mount('#app')