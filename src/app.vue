<template>
<div id='app'>
    <v-app>
        <Toolbar></Toolbar>
        <v-content>
            <v-container fluid>
                <router-view transition='scale-transition' ></router-view>
            </v-container>
        </v-content>
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
import Admin from '@/components/admin.vue';
import MyDevices from '@/components/my-devices.vue';

import MySensors from '@/components/my-sensors.vue';
import Toolbar from '@/components/toolbar.vue';

// Features
import LocationView from '@/features/locations/location-view.vue';
import Register from '@/features/user/user-register.vue';
import Login from '@/features/user/user-login.vue';

@Component( {components: {
        Admin,
        Toolbar,
        Login,
        Register,
        MyDevices,
        LocationView,
    }})
export default class App extends Vue {

}
</script>

