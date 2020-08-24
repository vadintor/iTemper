// Vue
import Vue from 'vue';
import Router from 'vue-router';

// Components
import Home from '@/components/home-page.vue';
import MySettings from '@/components/settings-page.vue';

// Pages
import DevicesPage from '@/features/devices/devices-page.vue';
// Features
import Admin from '@/features/admin/admin-page.vue';
import LocationView from '@/features/locations/location-page.vue';
import Login from '@/features/user/user-login-page.vue';
import Register from '@/features/user/user-register-page.vue';
import SensorPage from '@/features/sensors/sensors-page.vue';

// Store
import { Status } from '@/store/user';

// Services & helpers
import {log} from '@/services/logger';
import {json} from '@/helpers';

Vue.use(Router);

const routes = [
  { path: '/', name: 'home', component: Home},
  { path: '/admin', name: 'admin', component: Admin},
  { path: '/login', name: 'login', component: Login},
  { path: '/register', name: 'register', component: Register},
  { path: '/locations', name: 'locations', component: LocationView},
  { path: '/devices', name: 'devices', component: DevicesPage},
  { path: '/settings', name: 'settings', component: MySettings },
  { path: '/sensors', name: 'sensors', component: SensorPage },
  { path: '*', redirect: '/' },
];

export const router = new Router({ routes });

const publicPaths: string[] = ['/', '/login', '/register'];
export function isPublicPath(path: string) {
  return publicPaths.find( (item) => path === item);
}
export function loginRequired(path: string): boolean {
  return Vue.$store.user.status !== Status.LOGGED_IN && !isPublicPath(path);
}
router.beforeEach((to, from, next) => {
  if (loginRequired (to.path)) {
    log.debug('router.beforeEach Log in required!!!');
    return next({
      path: '/login',
      query: { returnUrl: to.path },
    });
  }
  next();
});
