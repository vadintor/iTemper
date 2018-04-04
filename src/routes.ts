import MyLocations  from './components/mylocations.vue'
import MySettings  from './components/mysettings.vue'
import { RouteConfig } from 'vue-router'
export const routes = [
 { path: '', name: 'locations', component: MyLocations},
   { path: '/settings', name: 'settings', component: MySettings },
];