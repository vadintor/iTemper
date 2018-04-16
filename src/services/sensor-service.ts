
import { iTemperAPI } from '@/config';
import { log } from '@/services/logger';

import { Data, Descriptor, Sensor } from '@/models/sensors';

import axios from 'axios';

export function getSensors(samples: number = 1): Promise<Sensor[]> {
        return new Promise<Sensor[]> ((resolve, reject) => {
                const url = iTemperAPI + '/sensors?samples=' + samples;
                axios.get(url)
                .then((response) => {
                        const data: Sensor[] = response.data.slice();
                        // log.debug('axios - response.data: ', data);
                        resolve(data);
                });
        });
}

export function getSensorSamples(desc: Descriptor): Promise<Data[]> {
        return new Promise<Data[]> ((resolve, reject) => {
                const url = iTemperAPI + '/sensors' + '/' + desc.SN + '/' + desc.port;
                // log.debug('getTrend', url);
                axios.get(url)
                .then((response) => {
                        const data: Data[] = response.data.slice();
                        // log.debug('axios - response.data: ', data);
                        resolve(data);
                });
        });
}
