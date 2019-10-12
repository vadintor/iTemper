import { iTemperAPI } from '@/config';
import { Device} from '@/models/device';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

export interface ILocationService {
        getDevices(): Promise<Device[]>;
        createDevice(name: string): Promise<Device>;
        renameDevice(name: string, device: Device): Promise<Device>;
        deleteDevice(device: Device): Promise<Device>;
}

export class LocationService implements ILocationService {

    private api: IApiService;

    constructor(apiService: IApiService) {
        this.api = apiService;
    }

    public getDevices(): Promise<Device[]> {
            const url = iTemperAPI + '/devices';
            const method: Method = 'get';
            return this.request(method, url);
    }
    public createDevice(name: string): Promise<Device> {
        const url = iTemperAPI + '/devices';
        const method: Method = 'post';
        return this.request(method, url, {name});
    }
    public renameDevice(name: string, device: Device): Promise<Device> {
        const url = iTemperAPI + '/devices/' + device.deviceID;
        const method: Method = 'put';
        return this.request(method, url, {name});
    }
    public deleteDevice(device: Device): Promise<Device> {
        const url = iTemperAPI + '/devices/' + device.deviceID;
        const method: Method = 'delete';
        return this.request(method, url);
    }

    private request(method: Method, url: string, body?: any): Promise<any> {
        log.debug('DeviceService.request: ' + method.toUpperCase() + ' ' + url);
        return new Promise<any> ((resolve, reject) => {
                if (!this.api.isLoggedIn) {
                        reject('DeviceService.request: user is not logged');
                }
                this.api.request(method, url, body)
                .then ((response) => {
                        const data = response.data.slice();
                        log.debug('DeviceService.getDevices:  axios - response sensors=' + json(data));
                        resolve(data);
                })
                .catch((error: any) => {
                        reject(error);
                });
        });
    }
}
