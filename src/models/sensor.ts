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
import { log } from '@/services/logger';

export enum Category {
    Temperature,
}

export interface Data {
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
    samples: Data[];
}
export class Sensor {
    public mId: string = '';
    public mDeviceID: string = '';
    public mDesc: Descriptor = {SN: '', port: 0};
    public mAttr: Attributes = {model: '',
                            category: Category.Temperature, accuracy: 0, resolution: 0, maxSampleRate: 0};
    public samples: Data[] = [];

    constructor(desc: Descriptor, attr: Attributes, samples: Data[] = []) {
       this.mDesc = desc;
       this.mAttr = attr;
    }
    public get _id(): string {
        return this.mId;
    }
    public set _id(value: string) {
        this.mId = value;
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


    public get lastValue(): string {
        if (this.hasSamples()) {
            return this.samples[this.samples.length - 1].value.toString();
        } else {
            return '-';
        }
    }

    public get lastTime(): string {
        if (this.hasSamples()) {
            return new Date(this.samples[this.samples.length - 1].date).toLocaleTimeString();
        } else {
            return '-';
        }
    }
    public get name(): string {
        log.debug('sensor.name');
        return this.mDesc.SN + '/' + this.mDesc.port;
    }
    public get category(): Category {
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
        return this.samples.length > 0;
    }

    public get lastSample(): Data {
        return this.samples[this.samples.length];
    }

    // public set samples(samples: Data[]) {
    //     this.mSamples = samples;
    // }
}
