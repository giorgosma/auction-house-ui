<template>
  <div id="app">
    <el-container>
      <Sidebar />
      <el-main>
        <el-row>
          <el-col :span="12">
            <Breadcrumb />
          </el-col>
          <el-col :offset="4" :span="8">
            <LoginRegister v-if="!global.loggedIn"/>
            <UserInfo v-else/>
          </el-col>
        </el-row>
        <el-row>
          <router-view/>
        </el-row>
      </el-main>
    </el-container>

    <p v-if="global.loggedIn"> logged in </p>
    <p v-else> logged out </p>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Login from "./components/Login.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import LoginRegister from "./components/LoginRegister.vue";
import UserInfo from "./components/UserInfo.vue";

export default {
  name: "app",
  components: {
    Login,
    Sidebar,
    Breadcrumb,
    LoginRegister,
    UserInfo,
  },
  data() {
    return {
      global: this.$store.state
    };
  },
  mounted() {
    this.makeCategories();
  },
  methods: {
    async makeCategories(){
      var url = this.global.apiurl
              + "categories/all"

      var response = await axios.get(url)
      //console.log(JSON.stringify(response.data))

      this.global.categories = response.data
      //console.log(JSON.stringify(this.global.categories))
    }
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
