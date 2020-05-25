import {Descriptor} from '@/models/sensor-data';
export interface ILocationData {
    name: string;
    color: string;
    path: string;

    sensorDesc: Descriptor[];
}
