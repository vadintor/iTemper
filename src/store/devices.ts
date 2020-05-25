import { IDeviceService } from '@/services/device-service';
import { Device } from '../models/device';
import { log } from '@/services/logger';

export class Devices  {
    public mError: string = '';
    public mDevices: Device[] = [];
    private deviceService: IDeviceService;

    constructor(deviceService: IDeviceService) {
        this.deviceService = deviceService;
    }
    public reset(): void {
        this.mError = '';
        this.mDevices = [];
    }
    public get all(): Device[] {
        return this.mDevices;
    }
    public getDevices(): void {
        this.resetError();
        this.deviceService.getDevices()
        .then((response: Device[]) => {
            response.forEach((device) => {
                const deviceFound = this.mDevices.find((d) => d.deviceID === device.deviceID);
                if (!deviceFound) {
                    const newDevice = new Device(device.name, device.deviceID);
                    newDevice.key = device.key;
                    this.mDevices.push(newDevice);
                }
            });
        })
        .catch((e) => this.handleError(e));
    }
    public createDevice(name: string): Promise<Device> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.deviceService.createDevice(name)
            .then((device) => {
                const newDevice = new Device(device.name, device.deviceID);
                newDevice.key = device.key;
                this.mDevices.push(newDevice);
                resolve(device);
            })
            .catch((e) => reject(e));
        });
    }
    public renameDevice(name: string, device: Device): Promise<Device> {
        return new Promise((resolve, reject) => {
            this.resetError();
            this.deviceService.renameDevice(name, device)
            .then((received: Device) => {
                const thisDevice = this.mDevices.find((d) => d.deviceID === received.deviceID);
                if (!thisDevice) {
                    reject({status: 95, message: 'Device id not available'});
                } else {
                    thisDevice.name = received.name;
                    resolve(thisDevice);
                }
            } )
            .catch((e) => this.handleError(e));
        });
    }
    public deleteDevice(device: Device): void {
        this.resetError();
        this.deviceService.deleteDevice(device)
        .then((d: Device) => {
            const index = this.mDevices.indexOf(device);
            if (index >= 0 ) {
                const deleted = this.mDevices[index];
                this.mDevices.splice(index, 1);
            }
        })
        .catch((e) => this.handleError(e));
    }

    private resetError() {
        this.mError = '';
    }
    private handleError(e: any) {
        if (e.response) {
            this.mError = e.response.data;
        } else if (e.request) {
            this.mError = 'No response from server';
        } else {
            this.mError = e.message;
        }
        setTimeout(this.resetError, 1000 * 5);
    }
}

