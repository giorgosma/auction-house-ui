<template>
  <div>
    <el-row>
      <el-badge v-if="this.inbox == '0'" :value="this.inbox" class="item" hidden>
        <el-button @click="openInbox" size="large">Inbox</el-button>
      </el-badge>
      <el-badge v-else :value="this.inbox" class="item">
        <el-button @click="openInbox" size="large">Inbox</el-button>
      </el-badge>
      <el-badge v-if="this.outbox == '0'" :value="this.outbox" class="item" hidden>
        <el-button @click="openOutBox" size="large">OutBox</el-button>
      </el-badge>
      <el-badge v-else :value="this.outbox" class="item" hidden>
        <el-button @click="openOutBox" size="large">OutBox</el-button>
      </el-badge> 
      <el-badge :value="this.outbox" class="item" hidden>
        <el-button @click="openNewMessage" size="large">New Message</el-button>
      </el-badge> 
    </el-row>
    <el-row v-if="this.seeInbox == true">
      <el-card>
        <el-table
          :data="InMessages">
          <el-table-column
            :min-width="25"
            label="Sender"
            prop="user.username">
          </el-table-column>
          <el-table-column
            :min-width="25"
            label="Auction"
            prop="auction.item.name">
          </el-table-column>
          <el-table-column
            :min-width="25">
            <template slot-scope="scope">
              <el-button @click="openInMessage(scope.row)" v-if="scope.row.receiver_read" type="default" >Read Message</el-button>
              <el-button @click="openInMessage(scope.row)" v-else type="info" >Read Message</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="25">
            <template slot-scope="scope">
              <el-button @click="deleteMessage(scope.row)">Delete Message</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row v-else-if="this.seeOutbox == true">
      <el-card>
        <el-table
          :data="OutMessages">
          <el-table-column
            :min-width="25"
            label="Receiver"
            prop="user.username">
          </el-table-column>
          <el-table-column
            :min-width="25"
            label="Auction"
            prop="auction.item.name">
          </el-table-column>
          <el-table-column
            :min-width="25">
            <template slot-scope="scope">
              <el-button @click="openOutMessage(scope.row)" type="default" >Read Message</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="25">
            <template slot-scope="scope">
              <el-button @click="deleteMessage(scope.row)">Delete Message</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row v-else-if="this.seenewMessage == true">
      <el-card>
        <el-row v-for="index in this.currentAuctions" v-bind:key="index.id">
            <el-col>
              <el-button @click="typeNewMessage(index, index.bid.user)" type="default" >{{index.bid.user.username}} - {{index.item.name }}</el-button>
            </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row v-else></el-row>
  </div>
</template>

<script>
export default {
  name: "newauction",
  data() {
    return {
      global: this.$store.state,

      activeNames: ["0"],
      inbox: 0,
      outbox: 0,
      newMessage: 0,
      InEmpty: true,
      OutEmpty: true,
      InMessages: [0],
      OutMessages: [0],
      seeInbox: false,
      seeOutbox: false,
      seenewMessage: false,
      auctions: [0],
      currentAuctions: [],
      msg: {
        receiver_id: 0,
        auction_id: 0,
        message: ""
      }
    };
  },
  watch: {
    //inbox: "printChange"
  },
  mounted() {
    this.updateBreadcrumb();
    this.initMessageBox();
    this.checkingNewMessages();
    this.loadUserCompletedAuctions();
  },
  methods: {
    updateBreadcrumb() {
      this.global.breadcrumbPath = [
        { path: "/", name: "Home" },
        { path: "/myMessages", name: "My Messages" }
      ];
    },
    initMessageBox() {
      this.seeInbox = false;
      this.seeOutbox = false;
      this.seenewMessage = false;
    },
    async checkingNewMessages() {
      axios.defaults.headers.common["token"] = this.global.token;
      var url = this.global.apiurl + "messages/Inbox";

      var response = await axios.get(url);

      if (response.data.length > 0) {
        console.log("Not Empty " + response.data.length)
        this.InMessages = response.data;
        console.log("InMessages size " + this.InMessages.length)
        for (let i in this.InMessages) {
          if (this.InMessages[i].receiver_read == 0) {
            this.inbox++;
          }
        }
        this.InEmpty = false;
      } 
      else 
        this.InEmpty = true;

      axios.defaults.headers.common["token"] = this.global.token;
      url = this.global.apiurl + "messages/Outbox";

      response = await axios.get(url);
      this.OutMessages = response.data;
    },
    openInbox() {
      console.log("In Empty " +  this.InEmpty);
      this.seeOutbox = false;
      this.seenewMessage = false;
      if (! this.InEmpty) this.seeInbox = true;
    },
    openOutBox() {
      console.log("Out length " + this.OutMessages.length);
      this.seeInbox = false;
      this.seenewMessage = false;
      if (this.OutMessages.length > 0) this.seeOutbox = true;
    },
    openInMessage(index) {
      console.log("In ID " + index.id);
      this.$alert(
        index.message,
        index.user.username + " - " + index.auction.item.name,
        {
          confirmButtonText: "Reply",
          // showCancelButton: false,
          callback: action => {
            if (action == 'confirm')
              this.replyToMessage(index)
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        }
      );
      if (this.inbox > 0) 
        this.messageRead(index);
    },
    async messageRead(index) {
      var url = this.global.apiurl + "messages/messageRead/" + index.id;

      axios.defaults.headers.common["token"] = this.global.token;

      var response = await axios.patch(url);
      this.inbox = 0;
      this.checkingNewMessages()
    },
    openOutMessage(index) {
      console.log("Out ID " + index.id);
      this.$alert(
        index.message,
        index.user.username + " - " + index.auction.item.name,
        {
          // confirmButtonText: "OK",
          // showCancelButton: false,
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        }
      );
    },
    replyToMessage(index) {
      this.typeNewMessage(index.auction, index.user)
    },
    openNewMessage() {
      this.seeInbox = false;
      this.seeOutbox = false;
      this.seenewMessage = true;
    },
    typeNewMessage(index, receiver) {
      this.$prompt('Please type your message', receiver.username + " - " + index.item.name, {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: 'Invalid Email'
        }).then(({ value }) => {
          this.createNewMessage(value, index, receiver)
          this.$message({
            type: 'success',
            message: 'Your message sent!',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Input canceled'
          });       
        });
    },
    async createNewMessage(value, index, receiver) {
      console.log("Value: " + value)
      this.msg.receiver_id = receiver.id
      this.msg.auction_id = index.id
      this.msg.message = value
      console.log(this.msg.receiver_id + " " + this.msg.auction_id + " " + this.msg.message)

      var url = this.global.apiurl + "messages/sendMessage";
      var body = this.msg;
      var config = { headers: { "Content-Type": "application/json" } };
      axios.defaults.headers.common["token"] = this.global.token;

      var response = await axios.post(url, body, config);
      console.log(JSON.stringify(response.data))
    },
    async loadUserCompletedAuctions() {
      axios.defaults.headers.common["token"] = this.global.token;
      var url = this.global.apiurl + "auctions/MyAuctionBid";

      var response = await axios.get(url);
      console.log(response.data.length);
      this.auctions = response.data;
      var j = 0;
      for (let i in this.auctions) {
        if (this.auctions[i].active == '0' || (this.getRemainingTime(this.auctions[i].end_time) == "Expired" && this.auctions[i].highest_bid_id)) {
          console.log(JSON.stringify(this.auctions[i]))
          this.currentAuctions[j] = this.auctions[i]
          j++;
        }
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
    deleteMessage(row){
      console.log("delete message clicked")
      this.$confirm('Are you sure you want to delete this message?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then( async () => {
          console.log("Deleting: " + JSON.stringify(row))
          var response = {}
          var url = this.global.apiurl + "messages/deleteMessage/" + row.id;
          try{
            response = await axios.post(url)
          } catch(error){
            console.log(error);
            console.log(response.error);
            return
          }
          this.initMessageBox();
          this.checkingNewMessages();
          this.loadUserCompletedAuctions();
        })
    },

  }
};
</script>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
