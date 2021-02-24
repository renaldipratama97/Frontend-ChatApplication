import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/auth/Auth.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Main from '../views/main/Main.vue'
import Message from '../views/main/Message.vue'
import Default from '../views/main/Default.vue'
import Profile from '../views/profile/Profile.vue'
import Room from '../views/main/Room.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { requiresVisitor: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
        meta: { requiresVisitor: true }
      }
    ]
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'default',
        name: 'Default',
        component: Default,
        meta: { requiresAuth: true }
      },
      {
        path: 'message/:id',
        name: 'Message',
        component: Message,
        meta: { requiresAuth: true }
      },
      {
        path: 'room',
        name: 'Room',
        component: Room,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLogin) {
      next({
        path: '/auth/login'
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters.isLogin) {
      next({
        path: '/main/default'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
