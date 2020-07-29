import { json } from '@/helpers/utils';
import { log } from '@/services/logger';
import { SensorData, Category, Sample } from '@/models/sensor-data';

export interface SensorService {
    register(listener: SensorDataListeners): void;
    getSensorsSamples(samples: number): Promise<SensorData[]>;
    getSensorsFrom(from: number): Promise<SensorData[]>;
}
export type SensorDataListeners = (data: SensorData[]) => void;
export class MockSensorService implements SensorService {
    private static listeners: Set<SensorDataListeners> = new Set();
    private sensors: SensorData[] = [{
        _id: '123',
        deviceID: '123',
        desc: { SN: 'Mocked', port: 0 },
        attr: {
            model: 'TGold',
            category: Category.Temperature,
            accuracy: 2,
            resolution: 1,
            maxSampleRate: 10,
        },
        samples: [{date: Date.now(), value: 10}],
    }];
    constructor() {
        setInterval(this.readSensors.bind(this), 10_000);
        setTimeout(() => {
            this.sensors.push(
                {
                    _id: '456',
                    deviceID: '456',
                    desc: { SN: 'Mocked', port: 1 },
                    attr: {
                        model: 'Temper8',
                        category: Category.Temperature,
                        accuracy: 2,
                        resolution: 1,
                        maxSampleRate: 5,
                    },
                    samples: [{date: Date.now(), value: 20}],
                });
        }, 25_000);
    }
    public register(listener: SensorDataListeners) {
        if (!MockSensorService.listeners.has(listener)) {
            MockSensorService.listeners.add(listener);
        }
    }
    public getSensorsSamples(samples: number): Promise<SensorData[]> {
        return new Promise<SensorData[]> ((resolve, reject) => {
            resolve(this.sensors);
        });
    }
    public getSensorsFrom(from: number): Promise<SensorData[]> {
        return new Promise<SensorData[]> ((resolve, reject) => {
            log.debug('MockSensorService.getSensorsFrom: sensors=' + json(this.sensors));
            resolve(this.sensors);
        });
    }
    private readSample(lastSample: Sample): Sample {
        const rand = Math.random();
        const span = 1;
        const delta =  rand * 2 * span;
        const newValue =  rand > 0.5 ?
        lastSample.value + delta : lastSample.value - delta;
        return {date: Date.now(), value: newValue };
    }
    private readSensor(data: SensorData) {
        const last = data.samples.length - 1;
        const lastSample = data.samples[ last];
        const newSample = this.readSample(lastSample);
        data.samples[last].date = newSample.date;
        data.samples[last].value = newSample.value;
    }
    private readSensors() {
        for (const sensor of this.sensors) {
            this.readSensor(sensor);
        }
        MockSensorService.listeners.forEach((callback: SensorDataListeners) => {
            callback(this.sensors);
        });
    }
}
