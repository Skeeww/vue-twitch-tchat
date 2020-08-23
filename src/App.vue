<template>
  <div id="app">
      <transition-group name="new" tag="p">
        <p v-for="msg in messages" :key="msg.id" class="msg" :class="{'sub': msg.user.subscriber, 'mod': msg.user.mod, 'partner': isPartner(msg.user)}">
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
      tmi: null,
      messages: [],
      emoteList: new Map(),
      channels_name: ["12skew"]
    }
  },
  methods: {
    niceEmotes(msg, tags) {
      if(tags['emotes-raw'] === null) return msg
      let finalMessage = msg
      let chunks = new Map()
      for(let i in tags.emotes){
        let delimiter = tags.emotes[i][0].split("-")
        chunks.set(i, msg.substr(delimiter[0], (delimiter[1] - delimiter[0]) + 1))
      }
      chunks.forEach((v, k) => {
        finalMessage = finalMessage.split(v).join("<img src='https://static-cdn.jtvnw.net/emoticons/v1/" + k + "/1.0' class='emoticon'>")
      })
      return finalMessage
    },
    isPartner(user) {
      return user.badges && ('partner' in user.badges)
    }
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
      this.$data.messages.push({content: this.niceEmotes(msg, tags), user: tags, id: i})
      i++
    })
  },
  destroyed() {
    this.$data.close()
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
.dif{
  border-left: 5px solid crimson;
}
.sub{
  border-left: 5px solid blueviolet;
}
.mod{
  border-left: 5px solid green;
}
.partner{
  border-right: 1px solid blueviolet;
  border-bottom: 1px solid blueviolet;
  border-top: 1px solid blueviolet;
}
.new-enter-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.new-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.new-enter{
  opacity: 0;
  transform: translateX(100%);
}
.new-leave-to{
  opacity: 0;
  transform: translateY(0%);
}
.emoticon{
  width: 24px;
}
</style>
