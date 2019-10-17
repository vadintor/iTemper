<template>
    <div>
        <v-navigation-drawer v-if="user.isLoggedIn()" transition="scale-transition" nudge-left=16 nudge-top=5 
        v-model="drawer"
        app
        >
        <v-list dense nav>
            <v-list-item v-for="item in menuItems" :key="item.title" @click="menuItemClicked(item)">
                <v-list-item-action>
                    <v-icon :color="item.color">{{item.action}}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }} </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-navigation-drawer>
        <v-app-bar
        app
        color="indigo"
        dark
        >
            <v-app-bar-nav-icon v-if="user.isLoggedIn()" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>iTemper</v-toolbar-title>
            <new-device-dialogue v-if="showNewDeviceDialogue"></new-device-dialogue>
            <v-spacer></v-spacer>
            <v-btn  v-if="user.isLoggedOut()" outlined class="signlog" @click="signup">Sign up</v-btn>
            <v-btn  v-if="user.isLoggedOut()" transition="scale-transition" outlined class="signlog" @click="login">Login</v-btn>
            <v-chip @click="logout()" ripple
                v-if="user.isLoggedIn()" 
                transition="scale-transition"  
                color="#2591E9"
                class="signlog" 
                close>
                    <v-icon >mdi-account-circle</v-icon>
                    {{user.credentials.mEmail}}
            </v-chip>
        </v-app-bar>
    </div>
</template>




<script lang="ts">
import Notice from '@/components/notice.vue';
import {Vue, Component, Prop} from 'vue-property-decorator';
import {router} from '@/helpers';

import {log} from '@/services/logger';
import {json} from '@/helpers';

import { Status } from '@/store/user';

import * as itemper from '@/services/itemper';

import NewDeviceDialogue from './new-device-dialogue.vue';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

interface MenuItem {
    action: string;
    title: string;
    color: string;
    route: string;
}
@Component({components: {
        Notice,
        NewDeviceDialogue,
    },
  })
export default class Toolbar extends Vue {
    public user = Vue.$store.user;
    public drawer: boolean = false;

    public showNewDeviceDialogue: boolean = false;

    public menuItems = [
            { action: 'mdi-home', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'mdi-radio-tower', title: 'Enheter',  color: 'blue-grey darken-2', route: 'devices' },
            { action: 'mdi-settings', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' },
            { action: 'mdi-logout', title: 'Logout', color: 'blue darken-2', route: 'login'},
      ];


    public name() {
        log.debug('Toolbar.name()' );
        return this.user.credentials.mEmail;
    }
    public menuItemClicked(item: MenuItem) {
        log.debug('Toolbar.menuItemClicked(): ' +  json(item));
        item.route === 'devices' ? this.showNewDeviceDialogue = true : this.showNewDeviceDialogue = false;
        if (item.action === 'logout') {
            this.user.logout();
        } else {
            router.push({name: item.route});
        }
    }
    public signup() {
        log.debug('Toolbar.signup()' );
        this.user.status =  Status.LOGGING_IN;
        router.push({name: 'register'});
    }
    public login() {
        log.debug('Toolbar.login()' );
        this.user.status =  Status.LOGGING_IN;
        router.push({name: 'login'});
    }


    public logout() {
        log.debug('Toolbar.logout()' );
        this.user.logout();
        this.showNewDeviceDialogue = false;
        router.push({name: 'home'});
    }

    public created() {
        log.debug('Toolbar.created(), user status=' + this.user.status.toString());
    }


}
</script>

<style scoped>
.signlog {
    background-color: rgb(37, 122, 233);
    color:snow;
}
</style>