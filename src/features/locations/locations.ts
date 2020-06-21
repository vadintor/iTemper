import { Location } from '@/features/locations';
import { Sensor } from '@/models/sensor';
import { SensorProxy } from '@/models/sensor-proxy';
import { store } from '@/store/store';
import { ILocationData, ILocationService, LocationService } from '@/features/locations/';

import { Vue  } from 'vue-property-decorator';

import { log } from '@/services/logger';
import { LogLevel } from '@/models/admin';
export class Locations {
    private mLocations: Location[] = [];
    private mError: string = '';

    private locationService: ILocationService;

    constructor(loginService: ILocationService) {
        this.locationService = loginService;
    }
    public reset(): void {
        this.mError = '';
        this.mLocations = [];
    }
    public get all(): Location[] {
        return this.mLocations;
    }
    public set all(value: Location[]) {
       Vue.set(this, 'mLocations', value);
    }
    public get error(): string {
        return this.mError;
    }
    public set error(value: string) {
       Vue.set(this, 'mError', value);
    }
    public getLocations(): void {
        log.debug('Locations.getLocations');
        this.resetError();
        this.locationService.getLocations()
        .then((received: ILocationData[]) => {
            log.debug('getLocations.received=' + JSON.stringify(received));
            received.forEach((locationData) => {
                const found = this.all.find((l) => l._id === locationData._id);
                if (found) {
                    this.mapSensorDesc(found, locationData);
                } else {
                    const newLocation = LocationService.newLocation(locationData);
                    this.mapSensorDesc(newLocation, locationData);
                    this.all.push(newLocation);
                }
            });
        })
        .catch((e) => {
            log.debug('ERROR getLocations.catch error=' + e);
            this.handleError(e);
        });
    }
    public createLocation(form: FormData): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.createLocation(form)
            .then((received: ILocationData) => {
                const newLocation = LocationService.newLocation(received);
                this.mLocations.push(newLocation);
                log.debug('locations.createLocation=' + JSON.stringify(newLocation));
                resolve(newLocation);
            })
            .catch((e) => reject(e));
        });
    }

    public deleteLocation(location: Location): Promise<Location | undefined> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.deleteLocation(location)
            .then((received: ILocationData) => {
                const index = this.mLocations.findIndex((l) => l.mId === received._id);
                if (index >= 0 ) {
                    const deleted = this.mLocations[index];
                    this.mLocations.splice(index, 1);
                    resolve(deleted);
                } else {
                    resolve(undefined);
                }
            })
            .catch((e) => reject(e));
        });
    }

    public updateFile(form: FormData, location: Location): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.updateFile(form, location)
            .then((received: ILocationData) => {
                const thisLocation = this.mLocations.find((l) => l._id === received._id);
                if (!thisLocation) {
                    reject({status: 96, message: 'location id not available'});
                } else {
                    location.path = received.path;
                    resolve(location);
                }
            })
            .catch((e: any) => reject(e));
        });
    }

    public updateName(newName: string, location: Location): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.updateName(newName, location)
            .then((received: ILocationData) => {
                const thisLocation = this.mLocations.find((l) => l._id === received._id);
                if (!thisLocation) {
                    reject({status: 96, message: 'location id not available'});
                } else {
                    location.name = received.name;
                    resolve(location);
                }
            })
            .catch((e: any) => reject(e));
        });
    }
    public updateColor(newColor: string, location: Location): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.updateColor(newColor, location)
            .then((received: ILocationData) => {
                const thisLocation = this.mLocations.find((l) => l._id === received._id);
                if (!thisLocation) {
                    reject({status: 96, message: 'location id not available'});
                } else {
                    location.color = received.color;
                    resolve(location);
                }
            })
            .catch((e: any) => reject(e));
        });
    }
    public updateSensors(newSensors: Array<Sensor | SensorProxy>, location: Location): Promise<Location> {
        this.resetError();
        log.debug('locations.updateSensors ' + JSON.stringify(newSensors));
        return new Promise ((resolve, reject) => {
            this.locationService.updateSensors(newSensors, location)
            .then((received: ILocationData) => {
                const thisLocation = this.all.find((l) => l._id === received._id);
                if (!thisLocation) {
                    reject({status: 96, message: 'location id not available'});
                } else {
                    thisLocation.sensorDesc = received.sensorDesc;
                    log.debug('locations.updateSensors.mapSensorDesc');
                    this.mapSensorDesc(thisLocation, received);
                    resolve(thisLocation);
                }

            })
            .catch((e: any) => reject(e));
        });
    }
    // public triggerMapSensorDesc() {
    //     log.debug('triggerMapSensorDesc');
    //     for (const location of this.mLocations) {
    //         this.mapSensorDesc(location);
    //     }
    // }
    private mapSensorDesc(location: Location, locationData: ILocationData) {
        log.debug('Locations.mapSensorDesc, location.sensors (length=' + location.sensors.length + ')'
            + JSON.stringify(location.sensors));
        location.sensors = []; // the for loop is not run if no sensors in location data!!!
        for (const desc of locationData.sensorDesc) {
            const mapped = location.sensors.find((s) => s.desc.SN === desc.SN && s.desc.port === desc.port);
            if (!mapped) {
                const inStoreSensor = store.sensors.find(desc);
                if (!inStoreSensor) {
                    //  Need to create a proxy for the actual sensor
                    // so we do not forgot that we want data from it.
                    log.debug('Locations.mapSensorDesc, sensor not in store, map proxy sensor to location'
                    + JSON.stringify(desc)
                    + JSON.stringify(desc));
                    const proxySensor = new SensorProxy(desc);
                    location.sensors.push(proxySensor);
                    store.sensors.all.push(proxySensor);
                } else {
                    log.debug('Locations.mapSensorDesc, sensor in store mapped to location'
                    + JSON.stringify(inStoreSensor));
                    location.sensors.push(inStoreSensor);
                }
            } else {
                log.debug('Locations.mapSensorDesc, sensor mapped already' + JSON.stringify(desc));
            }
        }
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

