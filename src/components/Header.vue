<template>
  <div>
    Header.vue here
    <el-button><router-link to="/">Home</router-link></el-button>
    <el-button><router-link to="/about">About</router-link></el-button>
  </div>
</template>

<script>
export default {
  name: 'myheader',
  data() {
    return {
      global: this.$store.state
    }
  },
}
</script>
