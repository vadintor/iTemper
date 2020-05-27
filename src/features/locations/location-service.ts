import { Location, ILocationData } from '@/features/locations';
import { Sensor } from '@/models/sensor';
import { SensorProxy} from '@/models/sensor-proxy';
import { Descriptor } from '@/models/sensor-data';
import { IApiService, Method } from '@/services/api-service';
import { log } from '@/services/logger';

export interface ILocationService {
        getLocations(): Promise<ILocationData[]>;
        createLocation(form: FormData): Promise<ILocationData>;
        updateFile(form: FormData, location: Location): Promise<ILocationData>;
        updateName(newName: string, location: Location): Promise<ILocationData>;
        updateColor(newColor: string, location: Location): Promise<ILocationData>;
        updateSensors(newSensors: Array<Sensor | SensorProxy>, location: Location): Promise<ILocationData>;
        // updateLocation(location: Location): Promise<Location>;
        deleteLocation(location: Location): Promise<ILocationData>;
}
export class LocationService implements ILocationService {

    public static newLocation(response: ILocationData): Location {
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
    public getLocations(): Promise<ILocationData[]> {
        log.debug('LocationService. getLocations');
        const method: Method = 'get';
        return this.api.request(method, this.path);
    }
    public createLocation(form: FormData): Promise<ILocationData> {
        const method: Method = 'post';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, this.path, form, config);
    }
    public  updateFile(form: FormData, location: Location): Promise<ILocationData> {
        const path = this.path + '/' + location._id + '/file';
        const method: Method = 'put';
        const config = { headers: {
            'Content-Type': 'multipart/form-data',
        }};
        return this.api.request(method, path, form, config);
    }
    public updateName(newName: string, location: Location): Promise<ILocationData> {
        const path = this.path + '/' + location._id + '/name';
        const method: Method = 'put';
        const body = { name: newName };
        return this.api.request(method, path, body);
    }
    public updateColor(newColor: string, location: Location): Promise<ILocationData> {
        const path = this.path + '/' + location._id + '/color';
        const method: Method = 'put';
        const body = { color: newColor };
        return this.api.request(method, path, body);
    }
    public updateSensors(newSensors: Array<Sensor | SensorProxy>, location: Location): Promise<ILocationData> {
        const path = this.path + '/' + location._id + '/sensors';
        const method: Method = 'put';
        const sensorDesc: Descriptor[] = [];
        for (const sensor of newSensors) {
            sensorDesc.push(sensor.desc);
        }
        const body = { sensorDesc };
        return this.api.request(method, path, body);
    }
    public deleteLocation(location: Location): Promise<ILocationData> {
        const path = this.path + '/' + location._id;
        const method: Method = 'delete';
        return this.api.request(method, path, location);
    }
}
