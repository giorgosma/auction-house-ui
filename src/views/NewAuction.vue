<template>
  <div v-if="this.global.loggedIn">
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
          <el-form-item label="Categories" label-width="120px">
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
        <div>
          <div class="file-upload-form">
            Upload an image file:
            <input type="file" name="myFile" @change="previewImage" accept="image/*" />
          </div>
          <div class="image-preview" v-if="imageData.length > 0">
            <img class="preview" :src="imageData" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="9">
        <el-button :disabled='!imageLoaded' v-if="this.global.userInfo.is_confirmed" type="primary" @click="handleNewAuction">Create Auction</el-button>
        <el-button v-else disabled type="primary" @click="handleNewAuction">Create Auction</el-button>
      </el-col>
    </el-row>
  </div>
  <div v-else>
    You must be Logged In to make New Auctions
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
        end_time: null
      },

      item_category: {
        item_id: 0,
        category_id: 0
      },

      options: [
        // {
        //   value: null,
        //   label: null
        // },
      ],
      value: [],
      imageData: "",
      rawImage: "",
      imageLoaded: false,
    };
  },
  mounted() {
    this.updateBreadcrumb();
    // console.log("Categories data:");
    // console.log(JSON.stringify(this.global.categories));
    this.fillUpOptions();
  },
  watch: {
    imageData: 'imageDataLoaded'
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/newAuction", name: "New Auction" }
      ];
    },
    async handleNewAuction() {
      console.log("This is handle new auction");
      console.log(JSON.stringify(this.item));
      console.log(JSON.stringify(this.auction));

      var url = this.global.apiurl + "items/newItem";
      var body = this.item;
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, body, config);

      console.log(response.data);
      this.item_category.item_id = response.data.id;
      this.auction.item_id = response.data.id;
      this.auction.seller_id = this.global.userInfo.id;

      if (this.auction.buyout_price == 0) {
        delete this.auction.buyout_price;
      }

      console.log(JSON.stringify(this.auction));

      url = this.global.apiurl + "auctions/newAuction";
      body = this.auction;

      response = await axios.post(url, body, config);

      console.log(response.data);

      //
      this.uploadImageRaw(response.data.id)
      //

      console.log("categories: ");
      for (let i in this.value) {
        console.log(this.value[i]);
        this.item_category.category_id = this.value[i];
        url = this.global.apiurl + "item_categories/itemCategories";
        body = this.item_category;

        response = await axios.post(url, body, config);

        console.log(response.data);
      }
    },
    fillUpOptions() {
      for (let i in this.global.categories) {
        this.options.push({
          value: this.global.categories[i].id,
          label: this.global.categories[i].name
        });
      }
    },
    previewImage: function(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    async getImageRaw(id) {
      var url = this.global.apiurl + "images/getImageRaw/" + id;
      var response = await axios.get(url);
      this.rawImage = response.data
    },
    imageDataLoaded(){
      this.imageLoaded = true
    },
    async uploadImageRaw(newName) {
      console.log('image loaded')
      var url = this.global.apiurl + "images/uploadImageRaw/" + newName;
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, { imageData: this.imageData }, config);
      console.log(this.imageData.length)
      console.log(JSON.stringify(response.data));
    }
  }
};
</script>

<style>
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
}
</style>
