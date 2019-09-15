<template>

  <div>
    <div class="file-upload-form">
      Upload an image file:
      <input type="file" name="myFile" @change="previewImage" accept="image/*" />
    </div>
    <div class="image-preview" v-if="imageData.length > 0">
      <img class="preview" :src="imageData" />
    </div>
    <p>imageData --{{imageData}}--</p>
    <p>rawImage --{{rawImage}}--</p>
    <el-button @click="uploadImageRaw" :disabled='!imageLoaded'>Upload</el-button>
    <img v-if="rawImage != ''" class="preview" :src="rawImage">
    
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      global: this.$store.state,
      imageData: "",
      rawImage: "",
      imageLoaded: false,
    };
  },
  mounted() {
    this.updateBreadcrumb();
    this.getImageRaw(2)
  },
  watch: {
    imageData: 'imageDataLoaded'
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/about", name: "About" }
      ];
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
    async uploadImageRaw(){
      console.log('image loaded')
      var url = this.global.apiurl + "images/uploadImageRaw/2";
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
