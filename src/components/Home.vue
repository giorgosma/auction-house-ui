<template>
  <div>
    <el-row>
      <el-table>
        <el-table-column label="Column 1"></el-table-column>
        <el-table-column label="Column 2"></el-table-column>
        <el-table-column label="Column 3"></el-table-column>
      </el-table>
    </el-row>

    <el-row>
      <el-button-group class="button-container">
        <el-button type="primary" icon="el-icon-arrow-left"></el-button>
        <el-button type="primary" icon="el-icon-arrow-right"></el-button>
      </el-button-group>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      global: this.$store.state
    };
  }
};
</script>

<style>
</style>
