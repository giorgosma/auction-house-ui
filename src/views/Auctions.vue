<template>
  <div>
    <el-row>
      <!-- {{ this.auction_obj.id }}
      {{ this.auction_obj.item.id }}
      {{ this.auction_obj.item.categories[0].name }}-->
      <el-card class="box-card">
        <img
          width="250"
          height="350"
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <el-col class="column">
          <h2 style="text-align:center;">{{ this.auction_obj.item.name }}</h2>
          <el-collapse>
            <el-collapse-item title="Description">
              <div>{{this.auction_obj.item.description}}</div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col class="column" style="background-color:#f5fae9">
          <h3 style="text-align:left;">In Auction until: {{ this.auction_obj.end_time }}</h3>
        </el-col>
        <el-col class="column" style="background-color:#e0e0e0">
          <el-form>
            <el-form-item label="Starting Price" label-width="100px">
              <el-input-number
                v-model="bid.amount"
                :precision="2"
                :step="0.01"
                :min="this.starting_bid"
              ></el-input-number>
              <el-button v-if="this.auction_obj.active" type="primary" @click="makeNewBid" enabled >Confirm Bid</el-button>
              <el-button v-else type="primary" @click="makeNewBid" disabled>Confirm Bid</el-button>
            </el-form-item>
            <el-form-item label="Buy Now:" label-width="100px">
              <el-button v-if="this.auction_obj.active" type="danger" @click="buyOutNow" enabled>Checkout</el-button>
              <el-button v-else type="danger" @click="buyOutNow" disabled>Checkout</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-card>
    </el-row>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "auctions",
  data() {
    return {
      global: this.$store.state,
      auction_id: 0,
      auction_obj: {
        item: {
          categories: [0]
        },
        seller: {}
      },

      bid: {
        auction_id: 0,
        bidder_id: 0,
        time: 0,
        amount: 0
      },
      starting_bid: 0.0,
      newBid: 0,

      activeNames: []
    };
  },
  watch: {
    "$route.params.id": "updateData"
    // "$route.params.id": "loadAuction",
    // newBid: "minBid",
    // starting_bid: "minBid"
  },
  mounted() {
    this.updateData();
    this.updateBreadcrumb();
    this.loadAuction();
    // this.minBid();
  },
  // computed: {
  //   Auction: function() {
  //     for (let i in this.global.auctions) {
  //       if (this.global.auctions[i].id === this.auction_id) {
  //         this.auction_obj = this.global.auctions[i];
  //         return this.auction_obj
  //       }
  //     }
  //   },
  //   AuctionId: function() {
  //     return this.auction_obj.id
  //   },
  //   // item(){
  //   //   return this.auction.item
  //   // },
  //   Categories: function(){
  //     return this.categories[0].name
  //   }
  // },
  methods: {
    updateData() {
      this.auction_id = this.$route.params.id;
    },
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/Auctions", name: "Auctions/" + this.auction_id }
      ];
    },
    findAuctionFromGlobal() {
      for (let i in this.global.auctions) {
        if (this.global.auctions[i].id == this.auction_id) {
          this.auction_obj = this.global.auctions[i];
          this.item = this.global.auctions[i].item;
          for (let j in this.item.categories) {
            this.categories[j] = this.item.categories[j];
          }
          break;
        }
      }
    },
    async loadAuction() {
      var url = this.global.apiurl + "auctions/loadAuction/" + this.auction_id;

      var response = await axios.get(url);
      console.log(JSON.stringify(response.data));

      this.auction_obj = response.data[0];
      // console.log("SELLER " + response.data[0])
      //this.auction_obj.item = response.data[0].item
      // console.log(this.item.name)
      // for (let j in response.data[0].item.categories) {
      //   this.auction_obj.item.categories[j] = response.data[0].item.categories[j];
      //   console.log(this.categories[j].name)
      // }
      this.minBid();
    },
    async minBid() {
      if (this.auction_obj.highest_bid_id == null) {
        console.log("No bids " + this.auction_obj.starting_bid);
        this.starting_bid = this.auction_obj.starting_bid;
      } else {
        var url =
          this.global.apiurl + "bids/models/" + this.auction_obj.highest_bid_id;

        var response = await axios.get(url);

        console.log(JSON.stringify(response.data));
        // this.newBid = response.data;
        this.starting_bid = response.data[0].amount;
        // console.log("Bid " + this.starting_bid);
      }
    },
    calcTime(offset) {
      var d = new Date();
      var utc = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * offset);
    },
    makeNewBid() {
      this.bid.time = this.calcTime("+6");
      this.bid.bidder_id = this.global.userInfo.id;
      this.bid.auction_id = this.auction_obj.id;

      console.log(this.bid.time);
      console.log(this.bid.bidder_id);
      console.log(this.bid.auction_id);
      console.log(this.bid.amount);
      this.createNewBid();

      // url = this.global.apiurl
      //     + "auctions/newBid/"
      //     + this.auction_obj.id
      //     +"/"
      //     + this.newBid.id;

      // this.auction_obj.highest_bid_id = this.newBid.id

      // // console.log(url);
      // response = await axios.patch(url);

      // console.log(JSON.stringify(response.data));
      // this.minBid();
    },
    async createNewBid() {
      var url = this.global.apiurl + "bids/newBid";
      var body = this.bid;
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, body, config);

      console.log(JSON.stringify(response.data));
      this.newBid = response.data;
      console.log("New Bid " + this.newBid.id);

      url =
        this.global.apiurl +
        "auctions/newBid/" +
        this.auction_obj.id +
        "/" +
        this.newBid.id;

      this.auction_obj.highest_bid_id = this.newBid.id;

      // console.log(url);
      response = await axios.patch(url);

      console.log(JSON.stringify(response.data));
      this.minBid();
    },
    buyOutNow() {
      this.disableAuction()
    },
    async disableAuction() {
      var url =
        this.global.apiurl +
        "auctions/disableAuction/" +
        this.auction_obj.id 

      // console.log(url);
      var response = await axios.patch(url);

      console.log(JSON.stringify(response.data));
    }
  }
};
</script>

<style>
.image {
  width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 480px; */
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 0 auto; /* Added */
}

.bg-white {
  background: #e0e0e0;
}
</style>