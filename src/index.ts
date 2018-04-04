import App from './app.vue'

import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import { routes } from './routes'


Vue.use(Vuetify);
Vue.use(VueRouter);

Vue.use(VueAxios, axios);
import MyLocations  from './components/mylocations.vue'
import Settings  from './components/settings.vue'
import { RouteConfig } from 'vue-router'

const router = new VueRouter({
    routes
});
new Vue ({
    el: '#app',
    router,
    render: h => h(App),
})