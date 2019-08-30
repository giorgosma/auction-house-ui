import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiurl: "http://83.212.109.75:28992/",
    loggedIn: false,
    breadcrumbPath: [{ path: "/", name: "Home" }],
    userInfo: {},
    categories: [],
    auctions: [],
    token: "",
  },
  mutations: {

  },
  actions: {

  }
})
