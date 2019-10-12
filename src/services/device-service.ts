import { iTemperAPI } from '@/config';
import { Device} from '@/models/device';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

export interface IDeviceService {
        getDevices(): Promise<Device[]>;
        createDevice(name: string): Promise<Device>;
        renameDevice(name: string, device: Device): Promise<Device>;
        deleteDevice(device: Device): Promise<Device>;
}

export class DeviceService implements IDeviceService {

    private api: IApiService;

    constructor(apiService: IApiService) {
        this.api = apiService;
    }

    public getDevices(): Promise<Device[]> {
            const url = iTemperAPI + '/devices';
            const method: Method = 'get';
            return this.api.request(method, url);
    }
    public createDevice(name: string): Promise<Device> {
        const url = iTemperAPI + '/devices';
        const method: Method = 'post';
        return this.api.request(method, url, {name});
    }
    public renameDevice(name: string, device: Device): Promise<Device> {
        const url = iTemperAPI + '/devices/' + device.deviceID;
        const method: Method = 'put';
        return this.api.request(method, url, {name});
    }
    public deleteDevice(device: Device): Promise<Device> {
        const url = iTemperAPI + '/devices/' + device.deviceID;
        const method: Method = 'delete';
        return this.api.request(method, url);
    }
}
