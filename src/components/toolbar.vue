<template>
    <div>
        <v-navigation-drawer v-if="loggedIn()" transition="scale-transition" bottom nudge-left=16 nudge-top=5 
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
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>iTemper</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn  v-if="!loggingIn" outlined class="signlog" @click="signup">Sign up</v-btn>
            <v-btn  v-if="!loggingIn" transition="scale-transition" outlined class="signlog" @click="login">Login</v-btn>
            <v-chip @click="logout()" ripple
                v-if="loggedIn()" 
                transition="scale-transition"  
                class="signlog" 
                close>
                    <v-icon >mdi-account-circle</v-icon>
                    {{user.mEmail}}
            </v-chip>
        </v-app-bar>

    </div>
</template>



<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {router} from '@/helpers';

import {log} from '@/services/logger';
import {json} from '@/helpers';

import { Status } from '@/models/user';

import * as itemper from '@/services/itemper';

interface MenuItem {
    action: string;
    title: string;
    color: string;
    route: string;
}
@Component({})
export default class Toolbar extends Vue {
    public user = Vue.$store.user;
    public loggingIn: boolean = false;
    public drawer: boolean = false;

    public menuItems = [
            { action: 'mdi-home', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'mdi-poll', title: 'Givare',  color: 'blue-grey darken-2', route: 'devices' },
            { action: 'mdi-settings', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' },
            { action: 'mdi-logout', title: 'Logout', color: 'blue darken-2', route: 'login'},
      ];

    public name() {
        log.debug('Toolbar.name()' );
        return this.user.mEmail;
    }
    public loggedIn() {
        log.debug('Toolbar.loggedOut()' + this.user.status);
        return this.user.status === Status.LOGGED_IN;
    }
    public menuItemClicked(item: MenuItem) {
        log.debug('Toolbar.menuItemClicked()' );
        if (item.action === 'logout') {
            this.logout();
        } else {
            router.push({name: item.route});
        }

    }

    public signup() {
        log.debug('Toolbar.signup()' );
    }
    public login() {
        this.loggingIn = true;
        log.debug('Toolbar.login()' );
        router.push({name: 'login'});
    }


    public logout() {
        log.debug('Toolbar.logout()' );
        itemper.loginService.logout();
        this.user.status = Status.LOGGED_OUT;
        router.push({name: 'home'});
        this.loggingIn = false;
    }

    public created() {
        log.debug('Toolbar.created(), loggedIn=' + this.loggedIn());
    }


}
</script>

<style scoped>
.signlog {
    background-color: rgb(37, 122, 233);
    color:snow;
}
</style>