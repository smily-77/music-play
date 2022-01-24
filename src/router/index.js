import { createRouter, createWebHashHistory } from 'vue-router'

const Login = () => import('@/views/login')
const Sign = () => import('@/views/sign')
const Recommend = () => import('@/views/recommend')
const Singer = () => import('@/views/singer')
const TopList = () => import('@/views/top-list')
const Search = () => import('@/views/search')



const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
      path:'/login',
      component:Login
  },
  {
    path:'/sign',
    component:Sign
},

  {
    path: '/recommend',
    component: Recommend,
  },
  {
    path: '/singer',
    component: Singer,
  },
  {
    path: '/top-list',
    component: TopList,
  },
  {
    path: '/search',
    component: Search,
  },

]

const routeHistory = createWebHashHistory();
const router = createRouter({
//   history: createWebHashHistory(process.env.BASE_URL),
    history: routeHistory,
    routes
})

export default router
