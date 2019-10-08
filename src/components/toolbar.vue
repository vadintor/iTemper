<template>
    <v-toolbar color="light-blue" dark >

        <v-menu v-if="loggedIn()"  transition="scale-transition" bottom nudge-left=16 nudge-top=5  >
            <v-btn icon slot="activator">
                <v-toolbar-side-icon></v-toolbar-side-icon>
            </v-btn>
            <v-subheader> </v-subheader>
            <v-list>
                <v-list-tile v-for="item in menuItems" :key="item.title" @click="menuItemClicked(item)">
                    <v-list-tile-action>
                        <v-icon :color="item.color">{{item.action}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>

        <v-toolbar-title>iTemper</v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-btn  v-if="!loggingIn" outline class="signlog" @click="signup">Sign up</v-btn>
        <v-btn  v-if="!loggingIn" transition="scale-transition" outline class="signlog" @click="login">Login</v-btn>
        <v-chip @click="logout()" ripple
            v-if="loggedIn()" 
            transition="scale-transition"  
            class="signlog" 
            close>
                <v-icon >mdi-account-circle</v-icon>
                {{user.mEmail}}
        </v-chip>

    </v-toolbar>
</template>



<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator"
import {router} from '@/helpers';

import {log} from '@/services/logger';
import {json} from '@/helpers';

import { Status } from '@/models/user';

import * as itemper from '@/services/itemper';

interface MenuItem {
    action: string,
    title: string,
    color: string,
    route: string
}
@Component({})
export default class Toolbar extends Vue {
    user = Vue.$store.user;
    loggingIn : boolean = false;

    menuItems = [
            { action: 'place', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'poll', title: 'Givare',  color: 'blue-grey darken-2', route: 'sensors' },
            { action: 'settings', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' },
            { action: 'logout', title: 'Logout', color: 'blue darken-2', route: 'login'}
      ];

    name() {
        log.debug('Toolbar.name()' );
        this.user.mEmail;
    }
    loggedIn () {
        log.debug('Toolbar.loggedOut()' + this.user.status);
        return this.user.status === Status.LOGGED_IN;
    }
    menuItemClicked(item: MenuItem) {
        log.debug('Toolbar.menuItemClicked()' );
        if (item.action === 'logout') {
            this.logout();
        } else {
            router.push({name: item.route})
        }

    }

    signup() {
    log.debug('Toolbar.signup()' );
    }
    login() {
        this.loggingIn = true;
        log.debug('Toolbar.login()' );
        router.push({name: 'login'})
    }


    logout() {
        log.debug('Toolbar.logout()' );
        itemper.loginService.logout();
        this.user.status = Status.LOGGED_OUT;
        router.push({name: 'home'})
        this.loggingIn = false;
    }

    created() {
        log.debug('Toolbar.created(), loggedIn=' + this.loggedIn())
    }


}   
</script>

<style scoped>
.signlog {
    background-color: rgb(37, 122, 233);
    color:snow;
}
</style>