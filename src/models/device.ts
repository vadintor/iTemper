import {Storage } from './../services/storage-service';

export class Device {
    public mName: string = '';
    public mDeviceID: string = '';
    public mKey: string = '';
    public mColorID: number = 0;
    // public mLocation: Location;
    private keyStorage: Storage<string>;



    constructor(name: string, id: string) {
        this.mName = name;
        this.mDeviceID = id;
        this.mColorID = Math.floor(Math.random() * 6);
        this.keyStorage = new Storage<string>('itemper-' + id);
        const item =  this.keyStorage.getItem();
        if (item) {
            this.mKey = item;
        }
    }

    public get name(): string {
        return this.mName;
    }

    public set name(value: string) {
        this.mName = value;
    }
    public get deviceID(): string {
        return this.mDeviceID;
    }

    public set deviceID(value: string) {
        this.mDeviceID = value;
    }

    public get key(): string {
        return this.mKey;
    }

    public set key(value: string) {
        this.keyStorage.setItem(value);
        this.mKey = value;
    }

    public get colorID(): number {
        return this.mColorID;
    }

    public set colorID(value: number) {
        this.mColorID = value;
    }
}
