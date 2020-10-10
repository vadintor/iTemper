<template>
<div id='app'>
    <v-app>
        <Toolbar></Toolbar>
        <v-main>
            <v-container fluid>
                <router-view transition='scale-transition'></router-view>
            </v-container>
        </v-main>
    </v-app>
</div>
</template>

<script lang='ts'>
// Vue
import { Vue, Component } from 'vue-property-decorator';

// Store
import { init } from '@/store/store';
init();

// Components

import SensorsPage from '@/components/sensors-page.vue';
import Toolbar from '@/components/toolbar.vue';

// Features
import AdminPage from '@/features/admin/admin-page.vue';
import DevicesPage from '@/features/devices/devices-page.vue';
import LocationPage from '@/features/locations/location-page.vue';
import LoginPage from '@/features/user/user-login-page.vue';
import RegisterPage from '@/features/user/user-register-page.vue';

@Component( {components: {
        AdminPage,
        DevicesPage,
        LocationPage,
        LoginPage,
        RegisterPage,
        Toolbar,
    }})
export default class App extends Vue {

}
</script>

