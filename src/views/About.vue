<template>
  <div>
    About.vue here
  </div>
</template>

<script>
export default {
  name: 'about',
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
        { path: "/about", name: "About" },
      ]
    }
  }
}
</script>
