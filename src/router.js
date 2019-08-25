import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import NewAuction from './views/NewAuction.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import ConfirmUser from './views/ConfirmUser.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/newAuction',
      name: 'newauction',
      component: NewAuction
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/confirmUser',
      name: 'confirmUser',
      component: ConfirmUser
    }
  ]
})
