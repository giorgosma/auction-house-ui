<template>
  <el-row v-if="this.global.loggedIn && this.global.userInfo.is_admin == '1'">
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column property="is_confirmed" label="Confirmed User">
        <template slot-scope="scope">
          <div v-if="scope.row.is_confirmed == '1'">
            <i class="el-icon-check"></i>
          </div>
          <div v-else>
            <i class="el-icon-minus"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="email" label="Email" show-overflow-tooltip></el-table-column>
      <el-table-column property="username" label="Username" show-overflow-tooltip></el-table-column>
      <el-table-column property="password" label="Password" show-overflow-tooltip></el-table-column>
      <el-table-column property="first_name" label="First_Name" show-overflow-tooltip></el-table-column>
      <el-table-column property="last_name" label="Last_Name" show-overflow-tooltip></el-table-column>
      <el-table-column property="rating" label="Rating" show-overflow-tooltip></el-table-column>
      <el-table-column property="city" label="City" show-overflow-tooltip></el-table-column>
      <el-table-column property="country" label="Country" show-overflow-tooltip></el-table-column>
      <el-table-column property="telephone" label="Telephone" show-overflow-tooltip></el-table-column>
      <el-table-column property="afm" label="AFM" show-overflow-tooltip></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection">Confirm Selected Users</el-button>
      <!-- <el-button @click="toggleSelection()">Clear selection</el-button> -->
    </div>
  </el-row>
  <el-row v-else>
    <h1>FORBIDDEN</h1>
  </el-row>
</template>

<script>
export default {
  name: "cofirmUser",
  data() {
    return {
      global: this.$store.state,

      tableData: [],
      multipleSelection: []
    };
  },
  mounted() {
    this.updateBreadcrumb();
    this.loadUsers();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/cofirmUser", name: "Cofirm User" }
      ];
    },
    async loadUsers() {
      var url = this.global.apiurl + "users/models/all/";

      console.log(url);
      var response = await axios.get(url);

      console.log(JSON.stringify(response.data));
      this.tableData = response.data;
    },
    async toggleSelection() {
      for (let i in this.multipleSelection) {
        var url =
          this.global.apiurl +
          "users/confirmUser/" +
          this.multipleSelection[i].id;

        console.log(url);
        var response = await axios.patch(url);

        console.log(JSON.stringify(response.data));
      }
      this.loadUsers();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(JSON.stringify(val));
    }
  }
};
</script>

