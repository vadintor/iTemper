
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

        constructor(apiService: IApiService) {
            this.api = apiService;
        }

        public getSensorsSamples(samples: number = 1): Promise<Sensor[]> {
                const url = iTemperAPI + '/sensors?samples=' + samples;
                return this.getSensors(url);
        }

        public getSensorsFrom(from: number): Promise<Sensor[]> {
                const url = iTemperAPI + '/sensors?from=' + from;
                return this.getSensors(url);
        }

        private getSensors(url: string): Promise<Sensor[]> {
                log.debug('SensorService.getSensors: url=' + url);
                const method: Method = 'get';
                return new Promise<Sensor[]> ((resolve, reject) => {
                        if (!this.api.isLoggedIn) {
                                reject('SensorService.getSensors: user is not logged');
                        }
                        this.api.request(method, url)
                        .then ((response) => {
                                const data: Sensor[] = response.data.slice();
                                log.debug('SensorService.getSensors: axios - response sensors=' + json(data));
                                resolve(data);
                        })
                        .catch((error) => {
                                reject(error);
                        });
                });
        }
}
