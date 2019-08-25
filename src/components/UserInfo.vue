<template>
  <div>
    <el-col :offset="12" :span="4">Welcome <router-link to="/profile">{{ this.global.userInfo.username }}</router-link>!</el-col>
    <el-col :offset="4" :span="4"><el-button size="small" @click="handleLogout">Logout</el-button></el-col>
  </div>
</template>

<script>
export default {
  name: 'userinfo',
  data() {
    return {
      global: this.$store.state
    }
  },
  mounted(){
  },
  methods: {
    handleLogout(){
      this.global.loggedIn = false
    }
  }
}
</script>
