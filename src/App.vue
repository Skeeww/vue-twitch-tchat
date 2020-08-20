<template>
  <div id="app">
      <transition-group name="new" tag="p">
        <p v-for="msg in messages" :key="msg.id" class="msg" :class="{'sub': msg.user.subscriber, 'mod': msg.user.mod}">
          <b :style="{color: msg.user.color}">{{msg.user['display-name']}}: </b> <span v-html="msg.content"></span>
        </p>
      </transition-group>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      client: null,
      messages: [],
      emoteList: new Map(),
      channels_id: ["28575692"],
      channels_name: ["mistermv"]
    }
  },
  methods: {
    niceEmotes(msg) {
      let chunks = msg.split(' ')
      let finalMsg = chunks
      for(let i in chunks){
        if(this.emoteList.has(chunks[i])){
          finalMsg[i] = "<img class='emoticon' src='https://static-cdn.jtvnw.net/emoticons/v1/" + this.emoteList.get(chunks[i]) + "/1.0'/>"
        }
      }
      return finalMsg.join(' ')
    }
  },
  created() {
    for(let i in this.channels_id){
      this.$axios.get('https://api.twitchemotes.com/api/v4/channels/' + this.channels_id[i]).then((res) => {
        for(let e in res.data.emotes){
          this.emoteList.set(res.data.emotes[e].code, res.data.emotes[e].id)
        }
      })
    }
    this.$axios.get('https://api.twitchemotes.com/api/v4/channels/0').then((res) => {
      for(let e in res.data.emotes){
        this.emoteList.set(res.data.emotes[e].code, res.data.emotes[e].id)
      }
    })
  },
  mounted() {
    let i = 0
    this.$data.client = new this.$tmi.Client({
      connection: {
        reconnect: true,
        secure: true
      },
      channels: this.channels_name
    })
    this.$data.client.connect().catch(console.error)
    this.$data.client.on('message', (channel, tags, msg, self) => {
      if(self) return
      if(this.$data.messages.length > 24){
        this.$data.messages.shift()
      }
      this.$data.messages.push({content: this.niceEmotes(msg), user: tags, id: i})
      i++
    })
  },
  destroyed() {
    this.$data.client = null
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  position: absolute;
  bottom: 0;
  font-family: "Inter";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.msg{
  padding-left: 5px;
  color: #1A1A1A;
}
.sub{
  border-left: 5px solid blueviolet;
}
.mod{
  border-left: 5px solid green;
}
.new-enter-active, .new-leave-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.new-enter, .new-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.emoticon{
  width: 24px;
}
</style>
