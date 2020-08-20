import Vue from 'vue'
import App from './App.vue'

import tmi from 'tmi.js'

Vue.config.productionTip = false
Vue.prototype.$tmi = tmi

new Vue({
  render: h => h(App),
}).$mount('#app')
