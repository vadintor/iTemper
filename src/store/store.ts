import { Itemper } from '@/services/itemper';
import { Admin } from '@/store/admin';
import { Devices} from '@/store/devices';
import { Locations } from '@/features/locations';
import { Notice } from '@/store/notice';
import { Sensors } from '@/store/sensors';
import { Settings } from '@/store/settings';
import { User, Status } from '@/store/user';

import { Vue } from 'vue-property-decorator';
import { computed, reactive, ref } from '@vue/composition-api';
import { log } from '@/services/logger';


export interface IStore {
    itemper: Itemper;
    admin: Admin;
    devices: Devices;
    locations: Locations;
    notice: Notice;
    sensors: Sensors;
    settings: Settings;
    user: User;
}
export class Store implements IStore {
    public itemper: Itemper = new Itemper();
    public admin: Admin = new Admin(this.itemper.adminService);
    public devices: Devices = new Devices(this.itemper.deviceService);
    public locations: Locations  = new Locations(this.itemper.locationService);
    public notice: Notice = new Notice();
    public sensors: Sensors = new Sensors(this.itemper.sensorService);
    public settings: Settings = new Settings();
    public user: User  = new User(this.itemper.apiService);
}
export let store: Store = new Store();

export function init() {
    Vue.$store = store;
}
let timeout: NodeJS.Timeout;
let timeoutSet: boolean;
export function useState(moduleName: string) {
    log.info('store.useState: reactive store in ' + moduleName);
    const state = reactive(store);
    timeoutSet = false;
    const timer = ref(timeoutSet);
    const retrievingState = computed (() => timer.value);

    const sampleCount = 2;
    const startRetrieveState = () => {
        log.info('store.useState.startRetrieveState');

        // make sure we have some values from all sensors before loading locations
        retrieveState();
    };
    const retrieveState = () => {
        log.info('store.useState.retrieveState');
        state.sensors.getSensorsSamples(sampleCount);
        state.sensors.loadSensors(sampleCount)
        .then(() => {
            state.locations.getLocations();
            state.devices.getDevices();
            state.sensors.getSensorsLast24h();
            timeout = setInterval(() => retrieveState(),
                        1000 * state.settings.interval);
            timer.value = true;
        });
    };
    const stopRetrieveState = () => {
        if (timer.value) {
            log.info('store.useState.stopRetrieveState');
            clearInterval(timeout);
            timer.value = false;
        }
    };
    const resetState = () => {
        state.admin.reset();
        state.devices.reset();
        state.locations.reset();
        state.sensors.reset();
        state.user.reset();
    };

    return { state, startRetrieveState, stopRetrieveState, resetState, retrievingState };
}
export function reset() {
    Vue.$store.admin.reset();
    Vue.$store.devices.reset();
    Vue.$store.locations.reset();
    Vue.$store.sensors.reset();
    Vue.$store.user.reset();
}
