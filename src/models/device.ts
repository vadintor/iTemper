import * as Locations from './locations';
import * as Sensors from './sensors';

export type DeviceKey = string;

export interface Device {
    key: DeviceKey;
    model: string;
    ip: string;
    sensors: Sensors.Descriptor[];
    location: Locations.Location;
}
