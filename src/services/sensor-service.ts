
import { iTemperAPI, iTemperWS } from '@/config';
import { Sensor } from '@/models/sensor';
import { SensorData, Descriptor } from '@/models/sensor-data';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

import axios, { AxiosInstance } from 'axios';

export interface ISensorService {
        getSensorsSamples(samples: number): Promise<SensorData[]>;
        getSensorsFrom(from: number): Promise<SensorData[]>;
}

export class SensorService implements ISensorService {

        private api: IApiService;
        private path: string = '/sensors';
        constructor(apiService: IApiService) {
                this.api = apiService;
        }

        public getSensorsSamples(samples: number = 1): Promise<SensorData[]> {
                const path = this.path + '?samples=' + samples;
                return this.getSensors(path);
        }

        public getSensorsFrom(from: number): Promise<SensorData[]> {
                const path = this.path + '?from=' + from;
                return this.getSensors(path);
        }

        private getSensors(path: string): Promise<SensorData[]> {
                log.debug('SensorService.getSensors: url=' + path);
                const method: Method = 'get';
                return new Promise<SensorData[]> ((resolve, reject) => {
                        this.api.request(method, path)
                        .then ((response) => {
                                const data: SensorData[] = response;
                                log.debug('SensorService.getSensors: axios - sensors=' + json(data));
                                resolve(data);
                        });
                });
        }
}
