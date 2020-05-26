import { Location } from '@/features/locations';
import { Sensor } from '@/models/sensor';
import { store } from '@/store/store';
import { ILocationResponse, ILocationService, LocationService } from '@/features/locations/location-service';

import { Vue  } from 'vue-property-decorator';

import { log } from '@/services/logger';
import { LogLevel } from '@/models/admin';
export class Locations {
    public mLocations: Location[] = [];
    public mError: string = '';

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
    public getLocations(): void {
        log.debug('Locations.getLocations');
        this.resetError();
        this.locationService.getLocations()
        .then((received: ILocationResponse[]) => {
            log.debug('getLocations.received=' + JSON.stringify(received));
            received.forEach((location) => {
                const locationFound = this.mLocations.find((l) => l._id === location._id);
                if (!locationFound) {
                    const newLocation = LocationService.newLocation(location);
                    this.mapSensorDesc(newLocation);
                    this.mLocations.push(newLocation);
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
            .then((received: ILocationResponse) => {
                const newLocation = LocationService.newLocation(received);
                this.mLocations.push(newLocation);
                resolve(newLocation);
            })
            .catch((e) => reject(e));
        });
    }

    public deleteLocation(location: Location): Promise<Location | undefined> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.deleteLocation(location)
            .then((received: ILocationResponse) => {
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
            .then((received: ILocationResponse) => {
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
            .then((received: ILocationResponse) => {
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
            .then((received: ILocationResponse) => {
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
    public updateSensors(newSensors: Sensor[], location: Location): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.updateSensors(newSensors, location)
            .then((received: ILocationResponse) => {
                const thisLocation = this.mLocations.find((l) => l._id === received._id);
                if (!thisLocation) {
                    reject({status: 96, message: 'location id not available'});
                } else {
                    thisLocation.sensorDesc = received.sensorDesc;
                    log.debug('updateSensors');
                    this.mapSensorDesc(thisLocation);
                    resolve(thisLocation);
                }

            })
            .catch((e: any) => reject(e));
        });
    }
    public triggerMapSensorDesc() {
        log.debug('triggerMapSensorDesc');
        for (const location of this.mLocations) {
            this.mapSensorDesc(location);
        }
    }
    private mapSensorDesc(location: Location) {
        log.debug('mapSensorDesc, location=' + JSON.stringify(location));
        Vue.set(location, 'sensors', []);
        for (const desc of location.sensorDesc) {
            const sensor = store.sensors.find(desc);
            if (sensor) {
                location.addSensor(sensor);
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

