import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiurl: "http://localhost:28992/",
    loggedIn: false,
    breadcrumbPath: [{ path: "/", name: "Home" }],
    userInfo: {},
    categories: [],
<<<<<<< HEAD
    auctions: [],
    token: "",
=======
    auctions: []
>>>>>>> 2dacce440f03e1e226cd25e22c5c7e748149a915
  },
  mutations: {

  },
  actions: {

  }
})
