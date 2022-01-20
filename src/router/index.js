import { createRouter, createWebHashHistory } from 'vue-router'

const Login = () => import('@/views/login'/* webpackChunkName: "search" */)
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)


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
