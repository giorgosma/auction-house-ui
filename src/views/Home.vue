<template>
  <div v-if="this.global.loggedIn && this.global.userInfo.is_confirmed == 0">
    <el-row>
      Your Confirmation is pending!
    </el-row>
  </div>
  <div v-else>
    <el-row>
      <el-col :span="2">
        <el-select v-model="select" placeholder="Select">
          <el-option label="Category" value="Category"></el-option>
          <el-option label="Price" value="Price"></el-option>
          <el-option label="Text" value="Text"></el-option>
          <el-option label="Country" value="Country"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div v-if="select == 'Price'" :span="16">
          <el-row :span="6">
          <el-input-number placeholder="Please input min" :precision="2" :step="0.01" :min="0" v-model="min" class="input-with-select">
          </el-input-number>
          </el-row>
          <el-row :span="6">
          <el-input-number placeholder="Please input max" :precision="2" :step="0.01" :min="0" v-model="max" class="input-with-select">
          </el-input-number>
          </el-row> 
          <el-button @click="searchViaPrice" slot="append" icon="el-icon-search"></el-button>          
        </div>
        <div v-else>
          <el-input placeholder="Please input" v-model="input" class="input-with-select">
            <el-button @click="searchVia" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      Choose Categories
      <el-select
        v-model="value"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="Choose Item Categories"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-col :span="4" v-for="(o, index) in auctionNumber" :key="o" :offset="index > 1 ? 1 : 1">
        <el-row v-if="auctions[index].visible">
          <el-card :body-style="{ padding: '4px' }">
            <img class="preview" :src="rawImage[index]"/>
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
  name: "home",
  data() {
    return {
      global: this.$store.state,

      currentDate: new Date(),
      auctions: [],
      auctionNumber: 0,
      options: [],
      value: [],
      select: "",
      input: "",
      max: null,
      min: 0,
      rawImage: []
    };
  },
  watch: {
    value: "loadViaCategory",
    "global.loggedIn": "loadAllAuctions"
  },
  mounted() {
    this.updateBreadcrumb();
    this.loadCategories();
    this.loadAllAuctions();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [{ path: "/", name: "Home" }];
    },
    async loadAllAuctions() {
      var url = this.global.apiurl + "auctions/loadAuction";

      var response = await axios.get(url);
      //console.log(JSON.stringify(response.data))
      console.log(response.data.length);
      this.auctionNumber = response.data.length;
      this.auctions = response.data;
      for (let i in this.auctions) {
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
      this.global.auctions = this.auctions;
      this.getImageRaw()
    },
    loadViaCategory() {
      console.log("Changed value!");
      if (this.value.length == 0) {
        for (let i in this.auctions) {
          this.auctions[i].visible = true;
        }
        return;
      }

      var flag = false;
      for (let i in this.auctions) {
        this.auctions[i].visible = false;
        for (let j in this.value) {
          for (let k in this.auctions[i].item.categories) {
            if (this.auctions[i].item.categories[k].id == this.value[j]) {
              this.auctions[i].visible = true;
              flag = true;
              break;
            }
          }
          if (flag) {
            flag = false;
            break;
          }
        }
        if (this.auctions[i].visible == true) {
          console.log(JSON.stringify(this.auctions[i]));
        }
      }
    },
    async loadCategories() {
      var url = this.global.apiurl + "categories/all";

      var response = await axios.get(url);
      this.global.categories = response.data;
      for (let i in this.global.categories) {
        this.options.push({
          value: this.global.categories[i].id,
          label: this.global.categories[i].name
        });
      }
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
    searchViaPrice(){
      console.log(this.select)
      if (this.min == 0 && this.max == 0) {
        this.loadAllAuctions()
        return
      }
      this.callSearch("auctions/searchAuctionViaPrice/" + this.min + "/" + this.max)
    },
    searchVia(){
      console.log(this.select)
      if (this.input == ""){
        this.loadAllAuctions()
        return;
      }
      if(this.select == "Category"){
        this.callSearch("auctions/searchAuctionViaCategory/" + this.input)
      }
      else if(this.select == "Country"){
        this.callSearch("auctions/searchAuctionViaCountry/" + this.input)
      }
      else if(this.select == "Text") {
        this.callSearch("auctions/searchAuctionViaFreeText/" + this.input)
      }
    },
    async callSearch(param){
      console.log(param)

      var url = this.global.apiurl + param;

      var response = await axios.get(url);
      // console.log(JSON.stringify(response.data))
      // console.log(response.data.length);
      this.auctionNumber = response.data.length;
      this.auctions = response.data;

      for (let i in this.auctions) {
        this.auctions[i].visible = false;
        this.auctions[i].remaining = this.getRemainingTime(this.auctions[i].end_time);
        if (this.auctions[i].remaining == "Expired")
          this.auctions[i].visible = false;
        else {
          if (this.global.loggedIn) {
            if (this.global.userInfo.id == this.auctions[i].seller_id) {
              this.auctions[i].visible = false;
            } else this.auctions[i].visible = true;
          } 
          else this.auctions[i].visible = true;
          console.log(JSON.stringify(this.auctions[i]))
        }
      }
      this.global.auctions = this.auctions;
      this.getImageRaw()
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
      //console.log("RawImage Lenth: " + this.rawImage.length)
    },
  }
};
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 14px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: center;
}

.image {
  width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-select .el-input {
  width: 110px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 20px;
}
img.preview {
  width: 200px;
  height: 200px;
  background-color: white;
  border: 1px solid #ddd;
  /* padding: 5px; */
  display: block;
  /* margin-left: auto;
  margin-right: auto; */
}
</style>
