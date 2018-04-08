
import { iTemperAPI } from '@/config';
import { log } from '@/services/logger';

import { Sensor } from '@/models/sensors';

import axios from 'axios';

export default async function getSensors(samples: number = 1): Promise<Sensor[]> {
        return new Promise<Sensor[]> ((resolve, reject) => {
                axios.get(iTemperAPI)
                .then((sensors) => {
                        const data: Sensor[] = sensors.data.slice();
                        resolve(data);
                });
        });
    }
