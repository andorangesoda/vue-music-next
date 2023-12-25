import { createRouter, createWebHashHistory } from 'vue-router'
// 懒加载
const Recommend = () => import('@/views/recommend')
const Singer = () => import('@/views/singer')
const TopList = () => import('@/views/top-list')
const Search = () => import('@/views/search')
const SingerDetail = () => import('@/views/singer-detail')
const Album = () => import('@/views/album')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList
  },
  {
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(),
  routes
})

export default router
