<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-container">
        <el-breadcrumb-item v-for="(page, index) in global.breadcrumbPath" :key="index" :to="{ path: page.path }">{{page.name}}</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  data() {
    return {
      global: this.$store.state
    }
  },
}
</script>
