<template>
  <div>
    <el-row>Choose Categories
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
          <el-card :body-style="{ padding: '0px' }">
            <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
            />
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
      value: []
    };
  },
  watch: {
    value: "loadViaCategory"
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
        this.auctions[i].visible = true
        this.auctions[i].remaining = this.getRemainingTime(this.auctions[i].end_time)
      }
      this.global.auctions = this.auctions
      // var obj = response.data
      // console.log("theID: " + this.auctions[34].id)
    },
    loadViaCategory() {
      console.log("Changed value!")
      if (this.value.length == 0) {
        for (let i in this.auctions) {
          this.auctions[i].visible = true;
        }
        return;
      }

      var flag = false
      for (let i in this.auctions) {
        this.auctions[i].visible = false
        for (let j in this.value) {
          for (let k in this.auctions[i].item.categories) {
            if (this.auctions[i].item.categories[k].id == this.value[j]) {
              this.auctions[i].visible = true
              flag = true;
              break;
            }
          }
          if (flag) {
            flag = false
            break;
          }
        }
        if (this.auctions[i].visible == true) {
          console.log(JSON.stringify(this.auctions[i]))
        }
      }

    },
    async loadCategories(){
      var url = this.global.apiurl
              + "categories/all"

      var response = await axios.get(url)
      this.global.categories = response.data
      for (let i in this.global.categories) {
        this.options.push({
          value: this.global.categories[i].id,
          label: this.global.categories[i].name
        });
      }
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
    calcTime(offset) {
      var d = new Date();
      var utc = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * offset);
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
</style>
