import { Location } from '@/models/location';
import { ILocationService } from '@/services/location-service';

import { log } from '@/services/logger';
export class Locations {
    public mLocations: Location[] = [];
    public mError: string = '';

    private locationService: ILocationService;

    constructor(loginService: ILocationService) {
        this.locationService = loginService;
    }
    public get all(): Location[] {
        return this.mLocations;
    }
    public getLocations(): void {
        log.debug('Locations.getLocations');
        this.resetError();
        this.locationService.getLocations()
        .then((response: Location[]) => {
            response.forEach((location) => {
                const locationFound = this.mLocations.find((l) => l._id === location._id);
                if (!locationFound) {
                    this.mLocations.push(location);
                }
            });
        })
        .catch((e) => this.handleError(e));
    }
    public createLocation(form: FormData): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.createLocation(form)
            .then((location: Location) => {
                this.mLocations.push(location);
                resolve(location);
            })
            .catch((e) => reject(e));
        });
    }

    public updateLocation(form: FormData): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.locationService.updateLocation(form)
            .then((location: Location) => {
                this.mLocations.push(location);
                resolve(location);
            })
            .catch((e: any) => reject(e));
        });
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

