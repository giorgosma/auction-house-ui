<template>
  <div>
    <el-aside width="230px">
      <div class="logo-container">
        <h1>
          <svg width="40px" height="27px">
            <g transform="translate(-101.000000, -87.000000)" fill="#FFFFFF" fill-rule="nonzero">
              <g transform="translate(101.000000, 87.000000)">
                <path
                  d="M11.623 7.603l6.062 3.5c0.479 0.276 1.090 0.112 1.365-0.366 0.277-0.478 0.113-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365s-0.112 1.089 0.366 1.366zM17.186 11.969l-6.062-3.5-3.5 6.062 6.062 3.5 3.5-6.062zM6.123 17.129l6.062 3.5c0.478 0.276 1.090 0.112 1.365-0.366s0.112-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365-0.277 0.478-0.112 1.090 0.366 1.366zM27.012 19.951l-11.076-5.817-1 1.732 10.576 6.683c0.717 0.414 1.635 0.169 2.049-0.549s0.168-1.635-0.549-2.049zM16.033 25c0-0.553-0.448-1-1-1h-9c-0.553 0-1 0.447-1 1 0 0.552 0 1 0 1l-1.033-0.021 0.033 1.021h13l0.047-0.958-0.984-0.042c0 0-0.063-0.448-0.063-1z"
                  id="Shape-Copy"
                />
              </g>
            </g>
          </svg>AUCTION HOUSE
        </h1>
      </div>

      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#fff"
        :router="true"
      >
        <el-menu-item index="/">
          <i class="el-icon-menu"></i>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <i class="el-icon-menu"></i>
          <span>About</span>
        </el-menu-item>
        <el-menu-item index="/register">
          <i class="el-icon-document"></i>
          <span>Register New User</span>
        </el-menu-item>
        <el-menu-item index="/confirmUser">
          <i class="el-icon-setting"></i>
          <span>Confirm User</span>
        </el-menu-item>
        <el-menu-item index="/newAuction">
          <i class="el-icon-setting"></i>
          <span>New Auction</span>
        </el-menu-item>
        <el-menu-item index="/myAuctions">
          <i class="el-icon-setting"></i>
          <span>My Auctions</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      global: this.$store.state,
    };
  }
};
</script>

<style>
.logo-container {
  padding: 12px;
  background: #434a50;
  color: white;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.el-aside {
  background: #545c64;
  color: white;
  min-height: 100vh;
}
.el-menu {
  border-right: 0 !important;
}
</style>
