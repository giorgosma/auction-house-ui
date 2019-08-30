<template>
  <div>
    <el-col :span="10"><el-input v-model="username" placeholder="Username" size="small"></el-input></el-col>
    <el-col :span="10"><el-input v-model="password" placeholder="Password" size="small"></el-input></el-col>
    <el-col :span="4"><el-button size="small" @click="handleLogin">Login</el-button></el-col>
    <el-col :span="14" v-if="showWarning">Invalid credentials</el-col>
    <el-col :span="10" v-if="showWarning"><router-link to="/register">Click here to register</router-link></el-col>
    <el-col :span="10" :offset="14" v-else><router-link to="/register">Click here to register</router-link></el-col>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'loginregister',
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

      if(response.data != "Not OK"){
        this.global.token = response.data.token
        axios.defaults.headers.common['token'] = this.global.token

        url = this.global.apiurl
              + "users/details"
        response = await axios.get(url)

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
