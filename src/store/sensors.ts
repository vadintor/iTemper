// samples: [{
//     value: 33.6875,
//     date: 1522790348877,
// }],
// attr: {
//     model: 'TEMPer 8',
//     category: 'Temperature',
//     accuracy: 0.5,
//     resolution: 1,
//     maxSampleRate: 0.2,
// },
// desc: {
//     SN: 'Temper8',
//     port: 7,
// },
// },
import * as itemper from '@/services/itemper';
import { ISensorService } from '@/services/sensor-service';
import { Data, Descriptor, Sensor } from '../models/sensor';

import { store } from '@/store/store';

import { log } from '@/services/logger';

export class Sensors  {
    private mSensors: Sensor[] = [];
    private sensorService: ISensorService;
    private mError: boolean = false;
    private mErrorMessage: string = '';
    private firstTime: boolean = true;

    constructor(sensorService: ISensorService) {
        this.sensorService = sensorService;
    }

    public getSensorsFrom(from: number) {
        this.sensorService.getSensorsFrom(from)
        .then((response: Sensor[]) => {
            response.forEach((sensor) => {
                const sensorFound = this.find(sensor.desc);
                if (!sensorFound) {
                    this.push(sensor);
                }
            });
            this.mError = false;
        })
        .catch((error) => {
            this.mError = true;
            this.mErrorMessage = error;
        });
    }

    public getSensorsSamples(samples: number) {
        this.sensorService.getSensorsSamples(samples)
        .then((response: Sensor[]) => {
            response.forEach((sensor) => {
                const sensorFound = this.find(sensor.desc);
                if (!sensorFound) {
                    this.push(sensor);
                }
            });
            this.mError = false;
        })
        .catch((error) => {
            this.mError = true;
            this.mErrorMessage = error;
        });
    }
    // getSensorSamples(desc: Descriptor): Promise<Data[]>

    public find(desc: Descriptor): Sensor | undefined {
        return this.mSensors.find((sensor) => sensor.desc.SN === desc.SN && sensor.desc.port === desc.port);
    }
    public get all(): Sensor[] {
        return this.mSensors;
    }
    public filterByDeviceID(deviceID: string): Sensor[] {
        return this.mSensors.filter((sensor) => sensor.deviceID === deviceID);
    }
    public index(id: number): Sensor | undefined {
        if (0 <= id && id < this.count) {
            return this.mSensors[id];
        } else {
            return undefined;
        }
    }

    public indexOf(sensor: Sensor, fromIndex?: number): number {
        return this.mSensors.indexOf(sensor, fromIndex);
    }
    public get count() {
        return this.mSensors.length;
    }

    public get error(): boolean {
        return this.mError;
    }

    public get errorMessage(): string {
        return this.mErrorMessage;
    }

    public clearError() {
        this.mErrorMessage = '';
        this.mError = false;
    }

    public getSensorsLast24h() {
        const self = this;
        const ms = 1000;
        const period = this.firstTime ? 24 * 60 * 60 * ms : store.settings.interval * ms ;
        this.sensorService.getSensorsFrom(Date.now() - period)
        .then ((response: Sensor[]) => {

            if (this.firstTime ) {
                this.firstTime = false;
            }

            for (const sensor of response) {
                const sensorFound: Sensor | undefined =
                    self.mSensors.find((s) => s.desc.SN === sensor.desc.SN && s.desc.port === sensor.desc.port );
                if (sensorFound) {
                    for (const sample of sensor.samples) {
                        sensorFound.samples.push(sample);
                    }
                } else {
                    log.debug('NY SENSOR: ' + JSON.stringify(sensor));
                    self.mSensors.push(sensor);
                    log.debug('ANTAL SENSORER=' + JSON.stringify(self.count));
                }
            }

        })
        .catch((error: any) => {
            log.debug('getSensorData' + JSON.stringify(error));
        });
    }
    private push(sensor: Sensor) {
        this.mSensors.push(sensor);
    }

}
export const sensors = new Sensors(itemper.sensorService);
