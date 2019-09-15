<template>
  <!-- <div>About.vue here</div> -->
  <div>
    <img class="preview" :src="dataUrl">
  </div>
<!-- <form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
   <input type="file" name="myFile" />
   <input type="submit" value="Upload a file"/>
</form> -->

  <!-- <div>
    <div class="file-upload-form">
      Upload an image file:
      <input type="file" name="myFile" @change="previewImage" accept="image/*" />
    </div>
    <div class="image-preview" v-if="imageData.length > 0">
      <img class="preview" :src="imageData" />
    </div>
  </div> -->
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      global: this.$store.state,
      imageData: "",
      thatImage: ""
    };
  },
  mounted() {
    this.updateBreadcrumb();
    this.getImage(36)
  },
  computed : {
    dataUrl(){
        return 'data:image/png;base64,' + btoa(
            new Uint8Array(this.thatImage)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    }
},
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/about", name: "About" }
      ];
    },
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
        this.saveImage(input.files[0])
        //this.getImage(1)

      }
    },
    async saveImage(myFile) {
      var url = this.global.apiurl + "images/uploadImage/1";
      let data = new FormData();
      //data.append('myFile', 'myFile');
      data.append('myFile', myFile); 
      var config = { headers: { "Content-Type": "application/json" } };

      var response = await axios.post(url, data, config);
      console.log(JSON.stringify(response.data));
    },
    async getImage(id) {
      var url = this.global.apiurl + "images/getImage/" + id;

      var response = await axios.get(url);
      console.log(response.data);
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