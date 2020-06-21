import { Itemper } from '@/services/itemper';
import { Admin } from '@/store/admin';
import { Devices} from '@/store/devices';
import { Locations } from '@/features/locations';
import { Notice } from '@/store/notice';
import { Sensors } from '@/store/sensors';
import { Settings } from '@/store/settings';
import { User } from '@/store/user';

import { Vue } from 'vue-property-decorator';

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
export let store = new Store();

export function init() {
    Vue.$store = store;
}

export function reset() {
    Vue.$store.admin.reset();
    Vue.$store.devices.reset();
    Vue.$store.locations.reset();
    Vue.$store.sensors.reset();
    Vue.$store.user.reset();
}
