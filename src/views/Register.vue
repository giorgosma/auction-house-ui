<template>
  <div>
    <el-row>
      <el-col class="column" :span="13">
        <el-form>
          <el-form-item label="Email" label-width="140px">
            <el-input placeholder="name@email.com" v-model="user.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="Username" label-width="140px">
            <el-input placeholder="Please input username" v-model="user.username" clearable></el-input>
          </el-form-item>
          <el-form-item label="Password" label-width="140px">
            <el-input placeholder="Please input password" v-model="user.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="Confirm Password" label-width="140px">
            <el-input placeholder="Please input password" v-model="confirmedPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="First Name" label-width="140px">
            <el-input placeholder="Please input first name" v-model="user.first_name" clearable></el-input>
          </el-form-item>
          <el-form-item label="Last Name" label-width="140px">
            <el-input placeholder="Please input last name" v-model="user.last_name" clearable></el-input>
          </el-form-item>
          <el-form-item label="City" label-width="140px">
            <el-input placeholder="Please input city" v-model="user.city" clearable></el-input>
          </el-form-item>
          <el-form-item label="Country" label-width="140px">
            <el-input placeholder="Please input country" v-model="user.country" clearable></el-input>
          </el-form-item>
          <el-form-item label="Telephone" label-width="140px">
            <el-input placeholder="Please input telephone" v-model="user.telephone" clearable></el-input>
          </el-form-item>
          <el-form-item label="AFM" label-width="140px">
            <el-input placeholder="Please input afm" v-model="user.afm" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="column" :offset="1" :span="3">
        <div v-if="user.password">
          <p v-if="showWarning">
            <el-alert title="Password Validation" type="success" :closable="false" show-icon></el-alert>
          </p>
          <p v-else-if="!showWarning">
            <el-alert title="Error Password Validation" type="error" :closable="false" show-icon></el-alert>
          </p>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="10">
        <el-button type="primary" @click="handleNewRegistration">Confirm Registration</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      global: this.$store.state,

      user: {
        email: "",
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        city: "",
        country: "",
        telephone: "",
        afm: ""
      },

      confirmedPassword: "",
      userPassword: "",

      showWarning: false,
      typedPassword: false
    };
  },
  watch: {
    confirmedPassword: "checkingPassword",
    "user.password": "checkingPassword"
  },
  mounted() {
    this.updateBreadcrumb();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/register", name: "Register" }
      ];
    },
    checkingPassword() {
      console.log("checking passwords");
      if (this.confirmedPassword != "") {
        if (this.user.password == this.confirmedPassword) {
          this.showWarning = true;
        } else {
          this.showWarning = false;
        }
      }
    },
    emptyPassword() {
      console.log("empty passwords");
      if (this.user.password != "") {
        this.typedPassword = true;
      } else {
        this.typedPassword = false;
      }
    },
    async handleNewRegistration() {
      console.log("This is handle new Registration");
      console.log(JSON.stringify(this.user));

      var url = this.global.apiurl + "users/register";
      var body = this.user;
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, body, config);

      console.log(response.data);
    }
  }
};
</script>

<style>
</style>
