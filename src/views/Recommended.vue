<template>
  <div v-if="this.global.loggedIn && this.global.userInfo.is_confirmed == 0">
    <el-row>Your Confirmation is pending!</el-row>
  </div>
  <div v-else-if="this.global.loggedIn && this.global.userInfo.id < 8">
    <el-row>Your Are Not Included on Datashet!</el-row>
  </div>
  <div v-else>
    <el-row>
      <el-col :span="4" v-for="(o, index) in auctionNumber" :key="o" :offset="index > 1 ? 1 : 1">
        <el-row v-if="auctions[index].visible">
          <el-card :body-style="{ padding: '4px' }">
            <img class="preview" :src="rawImage[index]" />
            <div style="padding: 14px;">
              <div style="text-align: center;">
                <span>{{ auctions[index].item.name }}</span>
              </div>
              <div class="bottom clearfix">
                <div style="text-align:left; padding:2px" End Time>
                  End Time:
                  <time class="time">{{ auctions[index].remaining }}</time>
                </div>
                <div style="text-align:left; padding:2px">
                  <span>Starting Bid: {{ auctions[index].starting_bid }}</span>
                </div>
                <div v-if="auctions[index].buyout_price" style="text-align:left; padding:2px">
                  <span>BuyOut Price: {{ auctions[index].buyout_price }}</span>
                </div>
                <div v-else style="text-align:left; padding:2px">
                  <span>No BuyOut Price</span>
                </div>
                <div v-if="auctions[index].highest_bid_id" style="text-align:left; padding:2px">
                  <span>Highest Bid: {{ auctions[index].bid.amount }}</span>
                </div>
                <div v-else style="text-align:left; padding:2px">
                  <span>No Bids Yet</span>
                </div>
                <div style="text-align:center;">
                  <router-link :to="'/auctions/' + auctions[index].id">View Auction</router-link>
                </div>
              </div>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      global: this.$store.state,
      auctions: [],
      auctionNumber: 0,
      rawImage: []
    };
  },
  mounted() {
    this.updateBreadcrumb();
    this.loadRecommendedAuctions();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/recommended", name: "Recommended" }
      ];
    },
    async loadRecommendedAuctions() {
        if (this.global.userInfo.id < 14)
            return;
        axios.defaults.headers.common["token"] = this.global.token;
        var url = this.global.apiurl + "auctions/recommended";

      var response = await axios.get(url);
      //console.log(JSON.stringify(response.data))
      console.log(response.data.length);
      console.log(response.data);
      this.auctionNumber = response.data.length;
      this.auctions = response.data;
      for (let i in this.auctions) {
        if (this.auctions[i].item != null) {
            this.auctions[i].remaining = this.getRemainingTime(
            this.auctions[i].end_time
            );
            if (this.auctions[i].remaining == "Expired")
            this.auctions[i].visible = false;
            else {
            if (this.global.loggedIn) {
                if (this.global.userInfo.id == this.auctions[i].seller_id) {
                this.auctions[i].visible = false;
                } else this.auctions[i].visible = true;
            } else this.auctions[i].visible = true;
            }
        }
      }
    //   this.global.auctions = this.auctions;
      this.getImageRaw()
    },
    getRemainingTime(end_time) {
      var seconds = (new Date(end_time) - this.calcTime(6)) / 1000;
      if (seconds < 0) return "Expired";

      var sec_num = parseInt(seconds);
      var days = Math.floor(sec_num / 86400);
      var hours = Math.floor((sec_num - days * 86400) / 3600);
      var minutes = Math.floor((sec_num - days * 86400 - hours * 3600) / 60);
      var seconds = sec_num - days * 86400 - hours * 3600 - minutes * 60;

      if (days < 10) {
        days = "0" + days;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return days + "d " + hours + "h " + minutes + "m";
    },
    calcTime(offset) {
      var d = new Date();
      var utc = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * offset);
    },
    async getImageRaw() {
      this.rawImage = [];
      for (let i in this.auctions){
        //console.log("Auction : " + this.auctions[i].id)
        if (this.auctions[i].id < 40) {
          //console.log("burger")
          this.rawImage.push(
            "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          );
        }
        else {
          //console.log("load")
          var url = this.global.apiurl + "images/getImageRaw/" + this.auctions[i].id;
          var response = await axios.get(url);
          this.rawImage.push(
           response.data);
        }
      }
    }
  }
};
</script>

<style>
</style>
