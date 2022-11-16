import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
// 三个模块
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'
// 创建vuex仓库并导出
export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在localstorage
    createPersistedstate({
      // 本地存储名字
      key: 'eribbit-client-pc-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
