import App from './app.vue'

import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
Vue.use(VueAxios, axios)
Vue.use(Vuetify)

new Vue ({
    el: '#app',
    render: h => h(App),
})