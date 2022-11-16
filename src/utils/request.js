// 创建一个新的axios实例
// 请求拦截器，若果有token进行头部携带
// 响应拦截器：1.剥离无效数据 2.处理token失效
// 导出一个函数，调用当前的axios实例发请求，返回值promise
// (导出的函数是调用当前instance来发请求)

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// axios实例  instance：实例 interceptors:拦截器
const instance = axios.create({
  // axios的一些配置，baseURL timeout
  baseURL,
  timeout: 5000
})
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  // 1.获取用户信息对象
  const { profile } = store.state.user
  console.log(profile.token)
  // 2.判断是否有token
  if (profile.token) {
    // 3.设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  // 发生错误时传递错误对象
  return Promise.reject(err)
})
// 响应拦截器
// (剥离无效数据)res => res.data 取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
  // 401状态码，进入该函数
  if (err.response && err.response.status === 401) {
    // 401为用户无访问权利，需要进行身份验证
    // 1.清空无效用户信息
    store.commit('setUser', {})
    // 当前路由地址
    // 组件里头:`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
    // (详情看vue文档)js模块中:router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据,
    // 如果想要拿到其中的属性需要再加上value
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    // 2.跳转到登录页
    // 3.跳转到需要传参（当前路由地址）个登录页码
    // fullPath为完整路径，但拼接的时候需先转码，不然解析会错误
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})
// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
