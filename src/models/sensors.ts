export enum Category {
    IndoorTemperature,
    OutdoorTemperature,
    AbsoluteHumidity,
    RelativeHumidity,
    WindSpeed,
}

export interface Data {
    port: number; // matches Sensor.id above
    value: number;
    date?: number;
}
export class Descriptor {
    public id: string;
    public description: string;
    public category: Category;
    public accuracy?: number;
    public resolution?: number;
    public maxSampleRate?: number;
}

export interface Sensor {
    desc: Descriptor;
    samples: Data[];
}

export type SensorState = Sensor[];

const now = Date.now();
export let DefaultSensorState: SensorState = [
    { desc: {id: '0', description: 'DS18B20', category: Category.IndoorTemperature},
        samples: [ {port: 0, value: 85.0, date: now}]},
    { desc: {id: '1', description: 'DS18B20', category: Category.IndoorTemperature},
        samples: [ {port: 1, value: 85.0, date: now + 30000}]},
    { desc: {id: '3', description: 'DS18B20', category: Category.IndoorTemperature},
        samples: [ {port: 3, value: 85.0, date: now + 60000}]},
    { desc: {id: '7', description: 'DS18B20', category: Category.IndoorTemperature},
        samples: [ {port: 7, value: 85.0, date: now + 90000}]}];
