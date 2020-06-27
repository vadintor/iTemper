import Vue from 'vue';
import App from './app.vue';
import { router } from '@/helpers';
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
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
