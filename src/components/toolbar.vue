<template>
    <div>
        <v-navigation-drawer v-if="state.user.isLoggedIn()" transition="scale-transition" nudge-left=16 nudge-top=5 
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
            <v-app-bar-nav-icon v-if="state.user.isLoggedIn()" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>iTemper</v-toolbar-title>
            <new-dialogue v-if="state.user.isLoggedIn()"/>
            <admin-node-env-label v-if="development"/>
            <toolbar-label color="green">{{activeState}}</toolbar-label>
            <v-spacer></v-spacer>
            <v-btn  v-if="state.user.isLoggedOut()" outlined class="signlog" @click="signup">Sign up</v-btn>
            <v-btn  v-if="state.user.isLoggedOut()" transition="scale-transition" outlined class="signlog" @click="login">Login</v-btn>
            <v-chip ripple
                v-if="state.user.isLoggedIn()"
                transition="scale-transition"
                color="#2591E9"
                class="signlog"
                close
                 @click:close="logout">
                    <v-icon>fa-user</v-icon>
                    {{state.user.credentials.mEmail}}
            </v-chip>
        </v-app-bar>
    </div>
</template>
<script lang="ts">
import {config} from '@/config';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { router, isPublicPath } from '@/helpers';
import { log } from '@/services/logger';
import { json } from '@/helpers';

import { Status } from '@/store/user';
import { useState } from '@/store/store';

import NewDialogue from '@/components/new-dialogue.vue';
import ToolbarLabel from '@/components/toolbar-label.vue';
import AdminNodeEnvLabel from '@/features/admin/admin-node-env-label.vue';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

interface MenuItem {
    action: string;
    title: string;
    color: string;
    route: string;
}
export default defineComponent({
    name: 'Toolbar',
    components: {
            NewDialogue,
            AdminNodeEnvLabel,
            ToolbarLabel,
        },

    setup(props, context) {
        const { state, startRetrieveState, stopRetrieveState, retrievingState, resetState } = useState('toolbar');
        const development = config.development;
        const drawer = ref(false);
        const showNewDeviceDialogue = ref(false);
        const showNewLocationDialogue = ref(true);
        const  menuItems = [
            { action: 'fa-home', title: 'Platser',  color: 'blue-grey darken-2', route: 'locations' },
            { action: 'fa-broadcast-tower', title: 'Enheter',  color: 'blue-grey darken-2', route: 'devices' },
            { action: 'fa-wifi', title: 'Givare',  color: 'blue-grey darken-2', route: 'sensors' },
            { action: 'fa-cog', title: 'Inställningar', color: 'blue-grey darken-2', route: 'settings' },
            { action: 'fa-hammer', title: 'System', color: 'blue-grey darken-2', route: 'admin' },
            { action: 'fa-sign-out-alt', title: 'Logout', color: 'blue darken-2', route: 'login'},
        ];
        const name = computed(() => state.user.credentials.mEmail);
        const menuItemClicked = (item: MenuItem) => {
            showNewDeviceDialogue.value = (item.route === 'devices') ? true : false;
            showNewLocationDialogue.value = (item.route === 'locations') ? true : false;
            if (item.action === 'logout') {
                logout();
            } else {
                router.push({name: item.route});
            }
        };
        const status = computed(() => Status[state.user.status].replace('_', ' ').toLocaleLowerCase());
        const activeState = computed(() => retrievingState.value ? 'online' : 'stopped' );
        const signup = () => {
            state.user.status =  Status.LOGGING_IN;
            router.push({name: 'register'});
        };
        const login = () => {
            state.user.status =  Status.LOGGING_IN;
            router.push({name: 'login'});
        };
        const logout = () => {
            log.debug('Toolbar.logout()' );
            showNewDeviceDialogue.value = false;
            state.user.logout().then(() => {
                stopRetrieveState();
                resetState();
                });
            router.push({name: 'home'});
        };
        router.beforeEach((to, from, next) => {
            log.info('location-page: beforeEach' + context.root.$router.currentRoute.path);
            log.info('location-page: isPublicPath: ' + isPublicPath(to.path));
            log.info('location-page: retrievingState: ' + JSON.stringify(retrievingState.value));
            log.info('location-page: state.user.status: ' + Status[state.user.status]);

            if (state.user.status === Status.LOGGED_IN) {
                if (!retrievingState.value) {
                    startRetrieveState();
                } else if (isPublicPath(to.path)) {
                    stopRetrieveState();
                }
            }
            next();
        });

        return  {
                    activeState, development, drawer, login, logout, menuItemClicked, menuItems, name,
                    showNewDeviceDialogue, showNewLocationDialogue, state, status, signup,
                    retrievingState,
                };
    },
});
</script>
<style scoped>
.signlog {
    background-color: rgb(37, 122, 233);
    color:snow;
}
</style>
