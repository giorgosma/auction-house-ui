<template>
  <div>
    AUCTION_ID
    {{this.auction_id}}
    ROUTE
    {{this.$route.params.id}}
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'auctions',
  data() {
    return {
      global: this.$store.state,
      auction_id: null
    }
  },
  watch: {
    '$route.params.id': "updateData"
  },
  mounted() {
      this.updateData()
  },
  methods: {
      updateData(){
          this.auction_id = this.$route.params.id
      }
  }
}
</script>

<style>
</style>