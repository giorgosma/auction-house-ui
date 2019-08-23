<template>
  <div v-if="!loggedIn" id="app">
    <Login/>
  </div>
  <div v-else id="app">
    <el-container>
      <el-header><Header/></el-header>
      <el-container>
        <el-aside><Sidebar/></el-aside>
        <el-main><router-view/></el-main>
      </el-container>
      <el-footer><Footer/></el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Header,
    Sidebar,
    Footer,
    Login
  },
  data() {
    return {
      global: this.$store.state
    }
  },
  computed:{
    loggedIn(){
      return this.global.loggedIn
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
}

.el-aside {
  background-color: #D3DCE6;
}

.el-main {
  background-color: #E9EEF3;
}
</style>
