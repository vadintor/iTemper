import { Descriptor } from '@/models/sensor-data';
export interface LocationData {
    _id: string;
    name: string;
    color: string;
    path: string;
    sensorDesc: Descriptor[];
}
