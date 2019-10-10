
<template>
<div id="app">
    <v-app>
        <Toolbar></Toolbar>
        <v-content>
            <v-container>
                <router-view transition="scale-transition" ></router-view>
            </v-container>
        </v-content>
    </v-app>
</div>
</template>

<script lang="ts">

import { Vue, Component } from "vue-property-decorator"

import { store } from '@/store';
Vue.$store = store;

import Home from '@/components/home.vue';
import Login  from '@/components/login.vue';
import MyDevices  from '@/components/mydevices.vue';
import MyLocations  from '@/components/mylocations.vue';
import MySensors from '@/components/mysensors.vue';
import Toolbar  from '@/components/toolbar.vue';


@Component( {components: {
        Toolbar,
        Home,
        Login,
        MyDevices,
        MyLocations,
        MySensors,
    }})
export default class App extends Vue {

    // TODO bestäm om det är läge att använda Vuex eller hur göra med "State"
  
}   
</script>

<style>

</style>