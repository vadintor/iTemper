import { Descriptor } from './sensor';
export interface LocationData {
    _Id: string;
    name: string;
    color: string;
    path?: string;
    sensorDesc?: Descriptor[];
}
