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

import { Vue, Component } from 'vue-property-decorator';

import { init } from '@/store/store';
init();
import Admin from '@/components/admin.vue';
import Login from '@/components/login.vue';
import MyDevices from '@/components/mydevices.vue';
import MyLocations from '@/components/mylocations.vue';
import MySensors from '@/components/mysensors.vue';
import Register from '@/components/register.vue';
import Toolbar from '@/components/toolbar.vue';


@Component( {components: {
        Admin,
        Toolbar,
        Login,
        Register,
        MyDevices,
        MyLocations,
    }})
export default class App extends Vue {

    // TODO bestäm om det är läge att använda Vuex eller hur göra med 'State'

}
</script>

