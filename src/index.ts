import { router } from '@/helpers';

import App from './app.vue';

import axios from 'axios';

import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
Vue.use(VueRouter);

Vue.use(VueAxios, axios);

const app = new Vue ({
    el: '#app',
    router,
    render: h => h(App),
});
