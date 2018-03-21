<template>
    <v-toolbar color="light-blue" dark >
        <v-menu transition="scale-transition" bottom nudge-left=16 nudge-top=5  >
            <v-btn icon slot="activator">
                <v-toolbar-side-icon></v-toolbar-side-icon>
            </v-btn>
            <v-subheader> </v-subheader>
            <v-list>
                <v-list-tile v-for="item in menuItems" :key="item.title" @click="onClick(item)">
                    <v-list-tile-action>
                        <v-icon :color="item.color">{{item.action}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-toolbar-title>iTemper</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>search</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>view_module</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator"
@Component
export default class Toolbar extends Vue {
    menuItems = [
            { action: 'home', title: 'Hem', color: 'blue darken-2'},
            { action: 'place', title: 'Platser',  color: 'blue-grey darken-2' },
            { action: 'poll', title: 'Givare',  color: 'blue-grey darken-2' },
            { action: 'settings', title: 'Inställningar', color: 'blue-grey darken-2' }
      ];

    onClick(item: Object) {
        console.log('onClick', JSON.stringify(item) )
        
    }

}   
</script>

<style>

</style>