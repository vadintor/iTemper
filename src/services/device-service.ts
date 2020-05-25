import { iTemperAPI } from '@/config';
import { Device} from '@/features/devices/device-data';

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
    private path: string = '/devices';
    constructor(apiService: IApiService) {
        this.api = apiService;
    }

    public getDevices(): Promise<Device[]> {
        const method: Method = 'get';
        return this.api.request(method, this.path);
    }
    public createDevice(name: string): Promise<Device> {
        const method: Method = 'post';
        return this.api.request(method, this.path, {name});
    }
    public renameDevice(name: string, device: Device): Promise<Device> {
        const path = this.path + '/' + device.deviceID;
        const method: Method = 'put';
        return this.api.request(method, path, {name});
    }
    public deleteDevice(device: Device): Promise<Device> {
        const path = this.path + '/' + device.deviceID;
        const method: Method = 'delete';
        return this.api.request(method, path);
    }
}
