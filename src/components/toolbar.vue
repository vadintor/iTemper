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
            <new-device-dialogue v-if="user.isLoggedIn() && showNewDeviceDialogue" @close="toggleDeviceDialogue"></new-device-dialogue>
            <new-location-dialogue v-if="user.isLoggedIn() && showNewLocationDialogue" @close="toggleLocationDialogue"></new-location-dialogue>
            <admin-node-env-label v-if="development"></admin-node-env-label>
            <v-spacer></v-spacer>
            <v-btn  v-if="user.isLoggedOut()" outlined class="signlog" @click="signup">Sign up</v-btn>
            <v-btn  v-if="user.isLoggedOut()" transition="scale-transition" outlined class="signlog" @click="login">Login</v-btn>
            <v-chip ripple
                v-if="user.isLoggedIn()" 
                transition="scale-transition"  
                color="#2591E9"
                class="signlog" 
                close
                 @click:close="logout">
                    <v-icon>fa-user</v-icon>
                    {{user.credentials.mEmail}}
            </v-chip>
        </v-app-bar>
    </div>
</template>
<script lang="ts">
import {config} from '@/config';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { router } from '@/helpers';
import { reset } from '@/store/store';
import { log } from '@/services/logger';
import { json } from '@/helpers';

import { Status } from '@/store/user';

import NewDeviceDialogue from '@/features/devices/new-device-dialogue.vue';
import NewLocationDialogue from '@/features/locations/new-location-dialogue.vue';
import AdminNodeEnvLabel from '@/features/admin/admin-node-env-label.vue';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

interface MenuItem {
    action: string;
    title: string;
    color: string;
    route: string;
}
@Component({components: {
        NewDeviceDialogue,
        NewLocationDialogue,
        AdminNodeEnvLabel,
    },
  })
export default class Toolbar extends Vue {
    public development = config.development;
    public user = Vue.$store.user;
    public drawer: boolean = false;

    public showNewDeviceDialogue: boolean = false;
    public showNewLocationDialogue: boolean = true;

    public menuItems = [
            { action: 'fa-home', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'fa-broadcast-tower', title: 'Enheter',  color: 'blue-grey darken-2', route: 'devices' },
            { action: 'fa-wifi', title: 'Givare',  color: 'blue-grey darken-2', route: 'sensors' },
            { action: 'fa-cog', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' },
            { action: 'fa-hammer', title: 'System', color: 'blue-grey darken-2', route: 'admin' },
            { action: 'fa-sign-out-alt', title: 'Logout', color: 'blue darken-2', route: 'login'},
      ];
    public name() {
        log.debug('Toolbar.name()' );
        return this.user.credentials.mEmail;
    }
    public menuItemClicked(item: MenuItem) {
        log.debug('Toolbar.menuItemClicked(): ' +  json(item));
        this.showNewDeviceDialogue = (item.route === 'devices') ? true : false;
        this.showNewLocationDialogue = (item.route === 'locations') ? true : false;
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
        this.showNewDeviceDialogue = false;
        this.user.logout().then(() => reset());
        router.push({name: 'home'});
    }
    public created() {
        log.debug('Toolbar.created(), user status=' + Status[this.user.status]);
    }
    public toggleDeviceDialogue() {
        this.showNewDeviceDialogue = !this.showNewDeviceDialogue;
        log.debug('toolbar.toggleLocationDialogue=' + this.showNewLocationDialogue);
    }
        public toggleLocationDialogue() {
        this.showNewLocationDialogue = !this.showNewLocationDialogue;
        log.debug('toolbar.toggleLocationDialogue=' + this.showNewLocationDialogue);
    }
}
</script>

<style scoped>
.signlog {
    background-color: rgb(37, 122, 233);
    color:snow;
}
</style>