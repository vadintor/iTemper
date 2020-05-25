export enum Category {
    Temperature, Humidity,
}

export interface Sample {
    value: number;
    date: number;
}
export interface Attributes {
    model: string;
    category: Category;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;
}

export interface Descriptor {
    SN: string;
    port: number;
}
export interface SensorLog {
    desc: string;
    samples: Sample[];
}
export interface SensorData {
     _id: string;
    deviceID: string ;
    desc: Descriptor;
    attr: Attributes;
    samples: Sample[];
}
