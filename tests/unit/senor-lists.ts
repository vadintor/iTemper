import { Sensor  } from '@/models/sensors';
export const SENSOR_LIST: Sensor[] = [{
        samples: [{
            date: 70249419,
            value: 26.1,
        }],
        attr: {
            model: 'Maxim Integrated - D18B20',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 2,
        },
        desc: {
            SN: '12348',
            port: 0,
        },
    },
    {
        samples: [],
        attr: {
            model: 'Maxim Integrated - D18B20',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 2,
        },
        desc: {
            SN: '12349',
            port: 0,
        },
    },
    {
        samples: [{
            value: 26.25,
            date: 1522786019778,
        }],
        attr: {
            model: 'Temper Gold',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 2,
        },
        desc: {
            SN: 'TGold',
            port: 0,
        },
    },
    {
        samples: [{
            value: 24,
            date: 1522790347630,
        }],
        attr: {
            model: 'TEMPer 8',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 0.2,
        },
        desc: {
            SN: 'Temper8',
            port: 0,
        },
    },
    {
        samples: [{
            value: 22.625,
            date: 1522790348045,
        }],
        attr: {
            model: 'TEMPer 8',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 0.2,
        },
        desc: {
            SN: 'Temper8',
            port: 1,
        },
    },
    {
        samples: [{
            value: 22.25,
            date: 1522790348461,
        }],
        attr: {
            model: 'TEMPer 8',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 0.2,
        },
        desc: {
            SN: 'Temper8',
            port: 3,
        },
    },
    {
        samples: [{
            value: 33.6875,
            date: 1522790348877,
        }],
        attr: {
            model: 'TEMPer 8',
            category: 'Temperature',
            accuracy: 0.5,
            resolution: 1,
            maxSampleRate: 0.2,
        },
        desc: {
            SN: 'Temper8',
            port: 7,
        },
    },
];
// module.exports = SENSOR_LIST;
