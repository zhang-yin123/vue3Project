import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';


import App from './App.vue'
import router from './router';


const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(createPinia())
app.use(router)

app.mount('#app');

export default app;
