import Vue from 'vue'
import App from './App'
import io from './components/weapp.socket.io.js';

Vue.config.productionTip = false
Vue.prototype.socket = io('http://localhost:8082')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
