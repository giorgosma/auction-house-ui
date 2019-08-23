<template>
  <div>
    Header.vue here
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
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
