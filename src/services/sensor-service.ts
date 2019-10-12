
import { iTemperAPI, iTemperWS } from '@/config';
import { Data, Descriptor, Sensor } from '@/models/sensor';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

import axios, { AxiosInstance } from 'axios';
export interface ISensorService {
        getSensorsSamples(samples: number): Promise<Sensor[]>;
        getSensorsFrom(from: number): Promise<Sensor[]>;
}

export class SensorService implements ISensorService {

        private api: IApiService;
        private path: string = '/sensors';
        constructor(apiService: IApiService) {
                this.api = apiService;
        }

        public getSensorsSamples(samples: number = 1): Promise<Sensor[]> {
                const path = this.path + '?samples=' + samples;
                return this.getSensors(path);
        }

        public getSensorsFrom(from: number): Promise<Sensor[]> {
                const path = this.path + '?from=' + from;
                return this.getSensors(path);
        }

        private getSensors(path: string): Promise<Sensor[]> {
                log.debug('SensorService.getSensors: url=' + path);
                const method: Method = 'get';
                return new Promise<Sensor[]> ((resolve, reject) => {
                        this.api.request(method, path)
                        .then ((response) => {
                                log.debug('SensorService.getSensors: axios - response sensors=' + json(response));
                                const data: Sensor[] = response;
                                resolve(data);
                        });
                });
        }
}
