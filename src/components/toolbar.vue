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
        <v-btn  v-if="!loggingIn" outline class="signlog">Sign up</v-btn>
        <v-btn  v-if="!loggingIn" transition="scale-transition" outline class="signlog" @click="onLogin()">Login</v-btn>

    </v-toolbar>
</template>

<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator"
interface MenuItem {
    action: string,
    title: string,
    color: string,
    route: string
}

@Component({})
export default class Toolbar extends Vue {
    loggingIn: boolean = false;
    loggedInName: string;
    menuItems = [
            { action: 'login', title: 'Login', color: 'blue darken-2', route: 'login'},
            { action: 'place', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'poll', title: 'Givare',  color: 'blue-grey darken-2', route: 'sensors' },
            { action: 'settings', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' }
      ];

    onClick(item: MenuItem) {
        this.$router.push({name: item.route})
    }

    onLogin() {
        this.loggingIn = true;
        this.$router.push({name: 'login'})
    }
}   
</script>

<style scoped>
.signlog {
    background-color: rgb(200, 0, 227);
    color:snow;
}
</style>