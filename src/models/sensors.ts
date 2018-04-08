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

export interface Sensor {
    desc: Descriptor;
    attr: Attributes;
    samples: Data[];
}

const now = Date.now();
export let DefaultSensors: Sensor[] = [
    {
        desc: {
            SN: '12348',
            port: 0,
        },
        attr: {
            model: 'Maxim Integrated - D18B20',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 2,
        },
        samples: [{
            value: 12.3,
            date: now,
        }],
    },
    {
        desc: {
            SN: '12349',
            port: 0,
        },
        attr: {
            model: 'TEMPer 8',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 2,
        },
        samples: [{
            value: 15.3,
            date: now + 6_000,
        }],
    },
];
