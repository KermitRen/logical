import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PuzzlesView from '../views/PuzzlesView.vue'
import PuzzleView from '../views/PuzzleView.vue'
import LearnView from '../views/LearnView.vue'
import TechniqueView from '../views/TechniqueView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/puzzles',
    name: 'puzzles',
    component: PuzzlesView
  },
  {
    path: '/puzzles/:type',
    name: 'puzzle',
    component: PuzzleView,
    props: true
  },
  {
    path: '/learn',
    name: 'learn',
    component: LearnView
  },
  {
    path: '/learn/:type',
    name: 'technique',
    component: TechniqueView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
