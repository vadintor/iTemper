import { Location } from '@/models/location';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

export interface ILocationService {
        getLocations(): Promise<Location[]>;
        createLocation(form: FormData): Promise<Location>;
        updateFile(form: FormData, location: Location): Promise<Location>;
        updateName(newName: string, location: Location): Promise<Location>;
        updateColor(newColor: string, location: Location): Promise<Location>;
        // updateLocation(location: Location): Promise<Location>;
        // deleteLocation(location: Location): Promise<Location>;
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
    public createLocation(form: FormData): Promise<Location> {
        const method: Method = 'post';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, this.path, form, config);
    }
    public  updateFile(form: FormData, location: Location): Promise<Location> {
        const path = this.path + '/' + location._id + '/file';
        const method: Method = 'put';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, path, form, config);
    }
    public updateName(newName: string, location: Location): Promise<Location> {
        const path = this.path + '/' + location._id + '/name';
        const method: Method = 'put';
        const body = { name: newName };
        return this.api.request(method, path, body);
    }
    public updateColor(newColor: string, location: Location): Promise<Location> {
        const path = this.path + '/' + location._id + '/color';
        const method: Method = 'put';
        const body = { color: newColor };
        return this.api.request(method, path, body);
    }
    public deleteLocation(location: Location): Promise<Location> {
        const path = this.path + '/' + location._id;
        const method: Method = 'delete';
        return this.api.request(method, path, location);
    }
}
