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
    private mDeviceID: string;
    private mDesc: Descriptor;
    private mAttr: Attributes;
    private mSamples: Data[] = [];

    constructor(desc: Descriptor, attr: Attributes) {
       this.mDesc = desc;
       this.mAttr = attr;
    }
    public get DeviceID(): string {
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

    // public set samples(samples: Data[]) {
    //     this.mSamples = samples;
    // }
}
