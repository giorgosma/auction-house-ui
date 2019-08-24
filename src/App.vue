<template>
  <div v-if="!global.loggedIn" id="app">
    <Login />
  </div>
  <div v-else id="app">
    <el-container>
      <Sidebar />
      <el-main>
        <el-row>
          <Breadcrumb />
        </el-row>
        <el-row>
          <router-view/>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Login from "./components/Login.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

export default {
  name: "app",
  components: {
    Login,
    Sidebar,
    Breadcrumb,
  },
  data() {
    return {
      global: this.$store.state
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
.container {
  max-width: 1200px;
  margin: auto;
}
.el-main {
  background: #eef1f4;
}
.el-row {
  margin-bottom: 20px;
}
</style>
