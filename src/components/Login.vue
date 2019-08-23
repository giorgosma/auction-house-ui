<template>
  <div>
    Login.vue here
    <el-button @click="handleLogin">Click here to login</el-button>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      global: this.$store.state
    }
  },
  methods:{
    handleLogin(){
      this.global.loggedIn = true
    }
  }
}
</script>
