<template>
<div>
    <login-card @onLogin="login" @onRegister="swap"></login-card>
</div>
</template>

<script lang="ts">
// Store
import { init } from '@/store/store';
init();
import { Status } from '@/store/user';

// Vue
import { Component, Prop, Vue } from 'vue-property-decorator';
import vuetify from '@/plugins/vuetify';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
Vue.use(Vuetify);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);


import wrap from '@vue/web-component-wrapper';
import LoginCard from '@/features/user/user-login-card.vue';

// Features
import { DeviceData } from '@/features/devices';

// Services & helpers
import { log } from '@/services/logger';

const device: Partial<DeviceData> = {
    key: '123',
    color: '#ff0000',
    name: 'twilightSound',
};

@Component({
    vuetify,
    components: {
        LoginCard,
    },

})
export default class ItemperDeviceWc extends Vue {
    public store = Vue.$store.user;

    public login(status: Status) {
        log.debug('itemperDeviceWc.login: status=' + Status[status]);
        this.provisionDevice();
    }
    public provisionDevice() {
        log.debug('itemperDeviceWc.provisionDevice');
        window.parent.postMessage(device, 'http://precision.vading.lan');
    }
    public swap() {
        log.debug('itemperDeviceWc.swap');
    }
}

const itemperDeviceElement = wrap(Vue, ItemperDeviceWc);
window.customElements.define('itemper-device-wc', itemperDeviceElement);
</script>

<style>
</style>