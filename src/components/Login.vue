<template>
  <div>
    Login
    <el-input v-model="username" placeholder="Username"></el-input>
    <el-input v-model="password" placeholder="Password"></el-input>
    <el-button @click="handleLogin">Click here to login</el-button>
    <p v-if="showWarning">Invalid username or password</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'login',
  data() {
    return {
      global: this.$store.state,

      username: "",
      password: "",

      showWarning: false,
    }
  },
  methods:{
    async handleLogin(){
      if(this.username == "" || this.password == ""){
        this.showWarning = true
        return
      }

      var url = this.global.apiurl
              + "users/login/"
              + this.username
              + "/"
              + this.password

      console.log(url)
      var response = await axios.post(url)

      console.log(JSON.stringify(response.data))

      if(response.data != "Not OK"){
        this.global.userInfo = response.data
        this.global.loggedIn = true
      }
      else{
        this.showWarning = true
      }

    }
  }
}
</script>
