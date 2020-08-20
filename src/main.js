import Vue from 'vue'
import App from './App.vue'

let tmi = require('tmi.js')
let axios = require('axios').default

Vue.config.productionTip = false
Vue.prototype.$tmi = tmi
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
