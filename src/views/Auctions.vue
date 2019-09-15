<template>
  <div>
    <el-row>
      <!-- {{ this.auction_obj.id }}
      {{ this.auction_obj.item.id }}
      {{ this.auction_obj.item.categories[0].name }}-->
      <el-card class="box-card">
        <img v-if="this.auction_obj.id < 40"
          width="250"
          height="350"
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <img v-else class="preview" :src="rawImage" />
        <el-col class="column">
          <h2 style="text-align:center;">{{ this.auction_obj.item.name }}</h2>
          <el-collapse>
            <el-collapse-item title="Description">
              <div>{{this.auction_obj.item.description}}</div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col class="column" style="background-color:#daf1c3">
          <h3 style="text-align:left;">Seller: {{ this.auction_obj.user.username }}</h3>
          <h3 v-if="this.auction_obj.user.rating" style="text-align:left;">Rating: {{ this.auction_obj.user.rating }}</h3>
        </el-col>
        <el-col class="column" style="background-color:#f5fae9">
          <h3 style="text-align:left;">In Auction until: {{ this.auction_obj.end_time }}</h3>
          <h3 style="text-align:left;">Time remaining: {{ this.auction_obj.remaining }}</h3>
        </el-col>
        <el-col class="column" style="background-color:#e3ecc3">
          <h3 style="text-align:left;">Starting Bid: {{ this.auction_obj.starting_bid }}</h3>
          <h3 v-if="this.auction_obj.highest_bid_id" style="text-align:left;">Highest Bid: {{ this.auction_obj.bid.amount }}</h3>
          <h3 v-if="this.auction_obj.bid_count" style="text-align:left;">Number of Bids: {{ this.auction_obj.bid_count }}</h3>
        </el-col>
        <el-col class="column" style="background-color:#f0d955">
          <h3 v-if="this.auction_obj.buyout_price" style="text-align:left;">Buy Out Price: {{ this.auction_obj.buyout_price }}</h3>
        </el-col>
        <el-col v-if="myAuction" class="column" style="background-color:#e0e0e0">
          <el-form>
            <el-form-item label="Starting Price" label-width="100px">
              <el-input-number
                v-model="bid.amount"
                :precision="2"
                :step="0.01"
                :min="this.starting_bid"
              ></el-input-number>
              <el-button
                v-if="this.auction_obj.active && this.global.loggedIn"
                type="primary"
                @click="makeNewBid"
                enabled
              >Confirm Bid</el-button>
              <el-button v-else type="primary" @click="makeNewBid" disabled>Confirm Bid</el-button>
            </el-form-item>
            <el-form-item label="Buy Now:" label-width="100px">
              <el-button
                v-if="this.auction_obj.active && this.global.loggedIn"
                type="danger"
                @click="buyOutNow"
                enabled
              >Checkout</el-button>
              <el-button v-else type="danger" @click="buyOutNow" disabled>Checkout</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-else class="column" style="background-color:#e0e0e0">
          <el-collapse>
            <el-collapse-item title="Edit Starting Bid">
              <el-input-number
                v-model="bid.amount"
                :precision="2"
                :step="0.01"
                :min="this.starting_bid"
              ></el-input-number>
              <el-button
                v-if="testEdit"
                type="primary"
                @click="changeStartingBid"
                enabled
              >Confirm new Starting Bid</el-button>
              <el-button
                v-else
                type="primary"
                @click="changeStartingBid"
                disabled
              >Confirm new Starting Bid</el-button>
            </el-collapse-item>
          </el-collapse>
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
        user: ""
      },

      bid: {
        auction_id: 0,
        bidder_id: 0,
        time: 0,
        amount: 0
      },
      starting_bid: 0.0,
      newBid: 0,

      activeNames: [],
      rawImage: "",
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
    this.getImageRaw();
  },
  computed: {
    myAuction: function() {
      if (this.auction_obj.seller_id == this.global.userInfo.id) return false;
      else return true;
    },
    testEdit: function() {
      if (this.auction_obj.highest_bid_id == null) return true;
      else false;
    }
  },
  methods: {
    updateData() {
      this.auction_id = this.$route.params.id;
      this.bid.amount = this.starting_bid
    },
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/auctions/" + this.auction_id, name: "Auctions/" + this.auction_id }
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
      this.auction_obj.remaining = this.getRemainingTime(this.auction_obj.end_time)
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
        this.starting_bid = response.data[0].amount;
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
    },
    async createNewBid() {
      var url = this.global.apiurl + "bids/newBid";
      var body = this.bid;
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, body, config);

      console.log(JSON.stringify(response.data));
      this.newBid = response.data;
      console.log("New Bid " + this.newBid.id);
      this.auction_obj.bid_count++;

      url =
        this.global.apiurl +
        "auctions/newBid/" +
        this.auction_obj.id +
        "/" +
        this.newBid.id +
        "/" +
        this.auction_obj.bid_count;

      this.auction_obj.highest_bid_id = this.newBid.id;

      response = await axios.patch(url);

      console.log(JSON.stringify(response.data));
      this.minBid();
    },
    buyOutNow() {
      this.disableAuction();
    },
    async disableAuction() {
      var url =
        this.global.apiurl + "auctions/disableAuction/" + this.auction_obj.id;

      var response = await axios.patch(url);

      console.log(JSON.stringify(response.data));
    },
    changeStartingBid() {
      console.log(this.bid.amount);
      this.updateStartingBid()
    },
    async updateStartingBid() {
      var url =
        this.global.apiurl +
        "auctions/updateStartingBid/" +
        this.auction_obj.id +
        "/" +
        this.bid.amount;

      this.auction_obj.starting_bid = this.bid.amount;

      var response = await axios.patch(url);
      console.log(JSON.stringify(response.data));
      this.minBid();
    },
    getRemainingTime(end_time){
      var seconds = (new Date(end_time) - this.calcTime(6))/1000
      if(seconds < 0) return "Expired"

      var sec_num = parseInt(seconds)
      var days    = Math.floor(sec_num / 86400)
      var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
      var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
      var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

      if (days    < 10) {days    = "0"+days;}
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return days+'d '+hours+'h '+minutes+'m';
    },

    async getImageRaw() {
      var url = this.global.apiurl + "images/getImageRaw/" + this.auction_id;
      var response = await axios.get(url);
      this.rawImage = response.data
    },
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

.file-upload-form,
.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 20px;
}
img.preview {
  width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
