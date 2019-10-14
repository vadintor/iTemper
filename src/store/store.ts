import { ApiService } from '@/services/api-service';
import { DeviceService } from '@/services/device-service';
import { SensorService } from '@/services/sensor-service';

import { Itemper } from '@/services/itemper';
import { Devices} from '@/store/devices';
import { Locations } from '@/store/locations';
import { Notice } from '@/store/notice';
import { Sensors } from '@/store/sensors';
import { Settings } from '@/store/settings';
import { User } from '@/store/user';

const apiService = new ApiService();
export const itemper = new Itemper({apiService,
    deviceService: new DeviceService(apiService),
    sensorService: new SensorService(apiService)});

export const devices = new Devices(itemper.deviceService);
export const locations = new Locations();
export const notice = new Notice();
export const sensors = new Sensors(itemper.sensorService);
export const settings = new Settings();
export const user = new User(itemper.apiService);

export interface Store {
    itemper: Itemper;
    devices: Devices;
    locations: Locations;
    notice: Notice;
    sensors: Sensors;
    settings: Settings;
    user: User;
}

export const initialStore: Store  = {
    itemper,
    devices,
    locations,
    notice,
    sensors,
    settings,
    user,
};

export const store: Store  = {
    itemper,
    devices,
    locations,
    notice,
    sensors,
    settings,
    user,
};
