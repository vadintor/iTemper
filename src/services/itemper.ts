import { ApiService } from './api-service';
import { DeviceService } from './device-service';
import { LocationService } from './location-service';
import { SensorService } from './sensor-service';

export interface IiTemper {
    apiService: ApiService;
    deviceService: DeviceService;
    locationService: LocationService;
    sensorService: SensorService;
}
export class Itemper implements IiTemper {
    public apiService: ApiService;
    public deviceService: DeviceService;
    public locationService: LocationService;
    public sensorService: SensorService;
    public constructor(itemper: IiTemper) {
        this.apiService = itemper.apiService;
        this.deviceService = itemper.deviceService;
        this.locationService = itemper.locationService;
        this.sensorService = itemper.sensorService;
    }

}
