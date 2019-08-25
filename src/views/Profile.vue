<template>
  <div>
    {{ this.global.userInfo }}
  </div>
</template>

<script>
export default {
  name: 'profile',
  data() {
    return {
      global: this.$store.state
    }
  },
  mounted(){
    this.updateBreadcrumb()
  },
  methods: {
    updateBreadcrumb(){
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/profile", name: "Profile" },
      ]
    }
  }
}
</script>
