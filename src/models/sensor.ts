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
import {log} from '@/services/logger';
export interface Data {
    value: number;
    date: number;
}

export enum Category {
    Temperature,
}

export interface Attributes {
    model: string;
    category: string;
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
    samples: Data[];
}
export class Sensor {
    public mDeviceID: string = '';
    public mDesc: Descriptor;
    public mAttr: Attributes;
    public mSamples: Data[] = [];

    constructor(desc: Descriptor, attr: Attributes) {
       this.mDesc = desc;
       this.mAttr = attr;
    }
    public get deviceID(): string {
        return this.mDeviceID;
    }
    public get desc(): Descriptor {
        return this.mDesc;
    }

    // public set desc(desc: Descriptor) {
    //     this.mDesc = desc;
    // }

    public get attr(): Attributes {
        return this.mAttr;
    }

    // public set attr(attr: Attributes) {
    //     this.mAttr = attr;
    // }

    public get samples(): Data[] {
        return this.mSamples;
    }
    public lastValue(): string {

        if (this.hasSamples()) {
            return this.mSamples[0].value.toString();
        } else {
            return '-';
        }
    }

    public get lastTime(): string {
        log.debug('lastValue');
        if (this.hasSamples()) {
            return new Date(this.mSamples[0].date).toLocaleTimeString();
        } else {
            return '-';
        }
    }
    public get name(): string {
        log.debug('sensor.name');
        return this.mDesc.SN + '/' + this.mDesc.port;
    }
    public get category(): string {
        return this.mAttr.category;
    }
    public get model(): string {
        return this.mAttr.model;
    }
    public get accuracy(): number {
        return this.mAttr.accuracy;
    }
    public get resolution(): number {
        return this.mAttr.resolution;
    }
    public get maxSampleRate(): number {
        return this.mAttr.maxSampleRate;
    }
    public hasSamples(): boolean {
        return this.mSamples.length > 0;
    }

    public get lastSample(): Data {
        return this.mSamples[this.mSamples.length];
    }

    // public set samples(samples: Data[]) {
    //     this.mSamples = samples;
    // }
}
