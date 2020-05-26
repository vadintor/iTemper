import { Location } from '@/features/locations';
import { Descriptor } from '@/models/sensor-data';
import { Sensor } from '@/models/sensor';
import { IApiService, Method } from '@/services/api-service';
import { log } from '@/services/logger';

export interface ILocationResponse {
    _id: string;
    name: string;
    color: string;
    path: string;
    sensorDesc: Descriptor[];
}
export interface ILocationService {
        getLocations(): Promise<ILocationResponse[]>;
        createLocation(form: FormData): Promise<ILocationResponse>;
        updateFile(form: FormData, location: Location): Promise<ILocationResponse>;
        updateName(newName: string, location: Location): Promise<ILocationResponse>;
        updateColor(newColor: string, location: Location): Promise<ILocationResponse>;
        updateSensors(newSensors: Sensor[], location: Location): Promise<ILocationResponse>;
        // updateLocation(location: Location): Promise<Location>;
        deleteLocation(location: Location): Promise<ILocationResponse>;
}
export class LocationService implements ILocationService {

    public static newLocation(response: ILocationResponse): Location {
        const location = new Location (response.name, response.color);
        location._id = response._id;
        response.path ? location.path = response.path : response.path = '';
        response.sensorDesc ? location.sensorDesc = response.sensorDesc : response.sensorDesc = [];
        return location;
    }

    private api: IApiService;
    private path: string = '/locations';

    constructor(apiService: IApiService) {
        this.api = apiService;
    }
    public getLocations(): Promise<ILocationResponse[]> {
        log.debug('LocationService. getLocations');
        const method: Method = 'get';
        return this.api.request(method, this.path);
    }
    public createLocation(form: FormData): Promise<ILocationResponse> {
        const method: Method = 'post';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, this.path, form, config);
    }
    public  updateFile(form: FormData, location: Location): Promise<ILocationResponse> {
        const path = this.path + '/' + location._id + '/file';
        const method: Method = 'put';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, path, form, config);
    }
    public updateName(newName: string, location: Location): Promise<ILocationResponse> {
        const path = this.path + '/' + location._id + '/name';
        const method: Method = 'put';
        const body = { name: newName };
        return this.api.request(method, path, body);
    }
    public updateColor(newColor: string, location: Location): Promise<ILocationResponse> {
        const path = this.path + '/' + location._id + '/color';
        const method: Method = 'put';
        const body = { color: newColor };
        return this.api.request(method, path, body);
    }
    public updateSensors(newSensors: Sensor[], location: Location): Promise<ILocationResponse> {
        const path = this.path + '/' + location._id + '/sensors';
        const method: Method = 'put';
        const sensorDesc: Descriptor[] = [];
        for (const sensor of newSensors) {
            sensorDesc.push(sensor.desc);
        }
        const body = { sensorDesc };
        return this.api.request(method, path, body);
    }
    public deleteLocation(location: Location): Promise<ILocationResponse> {
        const path = this.path + '/' + location._id;
        const method: Method = 'delete';
        return this.api.request(method, path, location);
    }
}
