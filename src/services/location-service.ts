import { Location } from '@/models/location';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

export interface ILocationService {
        getLocations(): Promise<Location[]>;
        createLocation(location: Location): Promise<Location>;
        updateLocation(location: Location): Promise<Location>;
        deleteLocation(location: Location): Promise<Location>;
}

export class LocationService implements ILocationService {

    private api: IApiService;
    private path: string = '/locations';
    constructor(apiService: IApiService) {
        this.api = apiService;
    }
    public getLocations(): Promise<Location[]> {
        const method: Method = 'get';
        return this.api.request(method, this.path);
    }
    public createLocation(location: Location): Promise<Location> {
        const method: Method = 'post';
        return this.api.request(method, this.path, location);
    }
    public updateLocation(location: Location): Promise<Location> {
        const path = this.path + '/' + location.id;
        const method: Method = 'put';
        return this.api.request(method, path, location);
    }
    public deleteLocation(location: Location): Promise<Location> {
        const path = this.path + '/' + location.id;
        const method: Method = 'delete';
        return this.api.request(method, path, location);
    }
}
