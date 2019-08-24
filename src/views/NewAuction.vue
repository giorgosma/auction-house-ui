<template>
  <div>
    <el-row>
      <el-col class="column" :span="12">
        <el-form>
          <el-form-item label="Item Name" label-width="120px">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
          <el-form-item label="Description" label-width="120px">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="Item Description"
              v-model="item.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="Starting Price" label-width="120px">
            <el-input-number v-model="auction.starting_bid" :precision="2" :step="0.01" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="Buy Out Price" label-width="120px">
            <el-input-number v-model="auction.buyout_price" :precision="2" :step="0.01" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="End Time" label-width="120px">
            <el-date-picker
              type="date"
              placeholder="Pick a date"
              v-model="auction.end_time"
              style="width: 100%;"
            ></el-date-picker>
            <el-time-picker
              placeholder="Pick a time"
              v-model="auction.end_time"
              style="width: 100%;"
            ></el-time-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="9">
        <el-button type="primary" @click="handleNewAuction">Create Auction</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "newauction",
  data() {
    return {
      global: this.$store.state,

      item: {
        name: "",
        description: ""
      },

      auction: {
        starting_bid: 0,
        buyout_price: 0,
        end_time: null,
      }
    };
  },
  mounted() {
    this.updateBreadcrumb();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/newAuction", name: "New Auction" }
      ];
    },
    async handleNewAuction(){
      console.log("This is handle new auction")
      console.log(JSON.stringify(this.item))
      console.log(JSON.stringify(this.auction))

      var url = this.global.apiurl
              + "items/newItem"
      var body = this.item
      var config = { headers: { 'Content-Type': 'application/json' } }

      var response = await axios.post(url, body, config)

      console.log(response.data)

      this.auction.item_id = response.data.id
      this.auction.seller_id = this.global.userInfo.id

      if(this.auction.buyout_price == 0){
        delete this.auction.buyout_price
      }

      console.log(JSON.stringify(this.auction))

      url = this.global.apiurl
            + "auctions/newAuction"
      body = this.auction

      response = await axios.post(url, body, config)

      console.log(response.data)
    }
  }
};
</script>

<style>
</style>
