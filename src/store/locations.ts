import { Location } from '@/models/location';
import { ILocationService } from '@/services/location-service';

import { log } from '@/services/logger';
export class Locations {
    public mLocations: Location[] = [];
    public mError: string = '';

    private loginService: ILocationService;

    constructor(loginService: ILocationService) {
        this.loginService = loginService;
    }
    public get all(): Location[] {
        return this.mLocations;
    }
    public getLocation(): void {
        this.resetError();
        this.loginService.getLocations()
        .then((response: Location[]) => {
            response.forEach((location) => {
                const deviceFound = this.mLocations.find((l) => l.id === location.id);
                if (!deviceFound) {
                    this.mLocations.push(location);
                }
            });
        })
        .catch((e) => this.handleError(e));
    }
    public createLocation(form: FormData): Promise<Location> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.loginService.createLocation(form)
            .then((location: Location) => {
                this.mLocations.push(location);
                resolve(location);
            })
            .catch((e) => reject(e));
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

