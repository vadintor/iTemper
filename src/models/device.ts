import {Storage } from './../services/storage-service';

export class Device {
    private mName: string = '';
    private mDeviceID: string = '';
    private mKey: string = '';
    private mLocation: Location;
    private keyStorage: Storage<string>;

    constructor(name: string, id: string) {
        this.mName = name;
        this.mDeviceID = id;
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

    public get location(): Location {
        return this.mLocation;
    }

    public set location(value: Location) {
        this.mLocation = value;
    }

}
