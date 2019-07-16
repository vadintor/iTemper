
<template>
<div id="app">
    <v-app>
        <v-content>
            <v-container>
                <Toolbar></Toolbar>
                <router-view transition="scale-transition" ></router-view>
            </v-container>
        </v-content>
    </v-app>
</div>
</template>

<script lang="ts">

import { Vue, Component } from "vue-property-decorator"

import Login  from '@/components/login.vue';
import MyLocations  from '@/components/mylocations.vue';
import MySensors from '@/components/mysensors.vue';
import Toolbar  from '@/components/toolbar.vue';


@Component( {components: {
        MyLocations,
        Toolbar,
        MySensors,
        Login,
    }})
export default class App extends Vue {

    // TODO bestäm om det är läge att använda Vuex eller hur göra med "State"
  
}   
</script>

<style>

</style>