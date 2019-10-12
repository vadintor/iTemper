import { iTemperAPI } from '@/config';
import { Device} from '@/models/device';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import {ILoginService } from '@/services/login-service';

import axios, { AxiosInstance, Method } from 'axios';
export interface ILocationService {
        getDevices(): Promise<Device[]>;
        createDevice(name: string): Promise<Device>;
        renameDevice(name: string, device: Device): Promise<Device>;
        deleteDevice(device: Device): Promise<Device>;
}

export class LocationService implements ILocationService {

    private io: AxiosInstance;
    private headers = {
        'Content-Type': 'application/json',
    };
    private loginService: ILoginService;

    constructor(loginService: ILoginService) {
        this.loginService = loginService;
        this.io = axios.create({
                headers: {
                'Content-Type': 'application/json',
                },
        });
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
                if (!this.loginService.isLoggedIn) {
                        reject('DeviceService.request: user is not logged');
                }
                const Authorization = {Authorization: this.loginService.Authorization().value};
                this.io.request({url, method, headers: Authorization, data: body})
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
