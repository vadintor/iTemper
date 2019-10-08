
import { iTemperAPI, iTemperWS } from '@/config';
import { Data, Descriptor, Sensor } from '@/models/sensor';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import {ILoginService } from '@/services/login-service';

import axios, { AxiosInstance } from 'axios';
export interface ISensorService {
        getSensorsSamples(samples: number): Promise<Sensor[]>;
        getSensorsFrom(from: number): Promise<Sensor[]>;
}

export class SensorService implements ISensorService {

        private io: AxiosInstance;
        private headers: {
                'Content-Type': 'application/json',
        };
        private loginService: ILoginService;

        constructor(loginService: ILoginService) {
                this.loginService = loginService;
                this.io = axios.create({
                        headers: {
                        'Content-Type': 'application/json',
                        },
                });
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
                return new Promise<Sensor[]> ((resolve, reject) => {
                        if (!this.loginService.isLoggedIn) {
                                reject('SensorService.getSensors: user is not logged');
                        }
                        const Authorization = {Authorization: this.loginService.Authorization().value};
                        this.io.get(url, {headers: Authorization})
                        .then (response => {
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
