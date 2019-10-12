import Vue from 'vue';
import App from './App.vue';
import { router } from '@/helpers';
import store from './store';
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
Vue.use(Vuetify);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
