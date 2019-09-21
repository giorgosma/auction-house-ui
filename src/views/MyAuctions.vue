<template>
  <div v-if="this.global.loggedIn">
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
          <el-card :body-style="{ padding: '0px' }">
            <img class="preview" :src="rawImage[index]"/>
            <div style="padding: 14px;">
              <div style="text-align: center;">
                <span>{{ auctions[index].item.name }}</span>
              </div>
              <div class="bottom clearfix">
                <div style="text-align:left; padding:2px" End Time>
                  End Time:
                  <time class="time">{{ auctions[index].end_time }}</time>
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
  <div v-else>You must be Logged In to view My Auctions</div>
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
      rawImage: []
    };
  },
  watch: {
    value: "loadViaCategory"
  },
  mounted() {
    this.updateBreadcrumb();
    this.loadCategories();
    this.loadMyAuctions();
    //this.getImageRaw();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [{ path: "/", name: "Home" }];
    },
    async loadMyAuctions() {
      axios.defaults.headers.common["token"] = this.global.token;
      var url = this.global.apiurl + "auctions/MyAuctions";

      var response = await axios.get(url);
      //console.log(JSON.stringify(response.data))
      console.log(response.data.length);
      this.auctionNumber = response.data.length;
      this.auctions = response.data;
      for (let i in this.auctions) {
        this.auctions[i].visible = true;
        // if (this.auctions[i].id > 39){
        //   console.log("call getImage " + this.auctions[i].id)
        //   this.getImageRaw(i)
        // }
      }
      this.getImageRaw();
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
    async getImageRaw() {

      for (let i in this.auctions){
        //console.log("Auction : " + this.auctions[i].id)
        // if (this.auctions[i].id < 40) {
        //   //console.log("burger")
        //   this.rawImage.push(
        //     "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        //   );
        // }
        // else {
          //console.log("load")
          var url = this.global.apiurl + "images/getImageRaw/" + this.auctions[i].id;
          var response = await axios.get(url);
          this.rawImage.push(
           response.data);
        //}
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

.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 20px;
}
img.preview {
  width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 5px;
}
</style>
