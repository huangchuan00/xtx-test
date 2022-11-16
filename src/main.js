import { createApp } from 'vue'
import App from './App.vue'
// router store 两者均为插件
import router from './router'
import store from './store'

// 创建一个vue应用实例 挂载到#app中
createApp(App).use(store).use(router).mount('#app')
