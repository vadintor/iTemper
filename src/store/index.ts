
import { devices, Devices} from '@/store/devices';
import { locations, Locations } from '@/store/locations';
import { PersistentUser, user } from '@/store/persistent-user';
import { sensors, Sensors } from '@/store/sensors';
import { settings, Settings } from '@/store/settings';

export interface Store {
    devices: Devices;
    locations: Locations;
    sensors: Sensors;
    settings: Settings;
    user: PersistentUser;
}

export const initialStore: Store  = {
    devices,
    locations,
    sensors,
    settings,
    user,
};

export const store: Store  = {
    devices,
    locations,
    sensors,
    settings,
    user,
};
