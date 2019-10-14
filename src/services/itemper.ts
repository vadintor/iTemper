import { ApiService } from './api-service';
import { DeviceService } from './device-service';
import { SensorService } from './sensor-service';

export interface IiTemper {
    apiService: ApiService;
    deviceService: DeviceService;
    sensorService: SensorService;
}
export class Itemper implements IiTemper {
    public apiService: ApiService;
    public deviceService: DeviceService;
    public sensorService: SensorService;
    public constructor(itemper: IiTemper) {
        this.apiService = itemper.apiService;
        this.deviceService = itemper.deviceService;
        this.sensorService = itemper.sensorService;
    }

}
