import Vue from 'vue';
import Router from 'vue-router';
import Admin from '@/components/admin.vue';
import Home from '@/components/home.vue';
import Login from '@/components/login.vue';
import MyDevices from '@/components/my-devices.vue';
import LocationView from '@/features/locations/location-view.vue';
import MySensors from '@/components/my-sensors.vue';
import MySettings from '@/components/my-settings.vue';
import Register from '@/components/register.vue';

import {log} from '@/services/logger';

import {json} from '@/helpers';
import { Status } from '@/store/user';

Vue.use(Router);

const routes = [
  { path: '/', name: 'home', component: Home},
  { path: '/admin', name: 'admin', component: Admin},
  { path: '/login', name: 'login', component: Login},
  { path: '/register', name: 'register', component: Register},
  { path: '/locations', name: 'locations', component: LocationView},
  { path: '/devices', name: 'devices', component: MyDevices},
  { path: '/settings', name: 'settings', component: MySettings },
  { path: '/sensors', name: 'sensors', component: MySensors },
  { path: '*', redirect: '/' },
];

export const router = new Router({routes });

router.beforeEach((to, from, next) => {
  log.debug('router.beforeEach FROM path= ' + json(from.path) + ', name=' + json(from.name) +
                            ', TO path=' + json(to.path) + ', name' + json(to.name) );
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPaths: string[] = ['/', '/login', '/register'];

  const authRequired = !publicPaths.find( (path) => path === to.path);
  log.debug('router.beforeEach user.status=' +  Status[Vue.$store.user.status]);
  if (authRequired && Vue.$store.user.status !== Status.LOGGED_IN) {
    log.debug('router.beforeEach Log in required!!!');
    return next({
      path: '/login',
      query: { returnUrl: to.path },
    });
  }

  next();
});
