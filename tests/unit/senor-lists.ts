import { Sensor  } from '@/models/sensor';
export const SENSOR_LIST = new Sensor(
            {SN: '12348', port: 0},
            {
                model: 'Maxim Integrated - D18B20',
                category: 'Temperature',
                accuracy: 0.5,
                resolution: 1,
                maxSampleRate: 2,
            });

SENSOR_LIST.samples.push({value: 26.25, date: 1522786019778});

// ) = [{
//         mSamples: [{
//             date: 70249419,
//             value: 26.1,
//         }],
//         mAttr: ,
//         mDesc: ,
//     },
// //     {
//         mSamples: [],
//         mAttr: {
//             model: 'Maxim Integrated - D18B20',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 2,
//         },
//         mDesc: {
//             SN: '12349',
//             port: 0,
//         },
//     },
//     {
//         mSamples: [{
//             value: 26.25,
//             date: 1522786019778,
//         }],
//         mAttr: {
//             model: 'Temper Gold',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 2,
//         },
//         mDesc: {
//             SN: 'TGold',
//             port: 0,
//         },
//     },
//     {
//         mSamples: [{
//             value: 24,
//             date: 1522790347630,
//         }],
//         mAttr: {
//             model: 'TEMPer 8',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 0.2,
//         },
//         mDesc: {
//             SN: 'Temper8',
//             port: 0,
//         },
//     },
//     {
//         mSamples: [{
//             value: 22.625,
//             date: 1522790348045,
//         }],
//         mAttr: {
//             model: 'TEMPer 8',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 0.2,
//         },
//         mDesc: {
//             SN: 'Temper8',
//             port: 1,
//         },
//     },
//     {
//         mSamples: [{
//             value: 22.25,
//             date: 1522790348461,
//         }],
//         mAttr: {
//             model: 'TEMPer 8',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 0.2,
//         },
//         mDesc: {
//             SN: 'Temper8',
//             port: 3,
//         },
//     },
//     {
//         mSamples: [{
//             value: 33.6875,
//             date: 1522790348877,
//         }],
//         mAttr: {
//             model: 'TEMPer 8',
//             category: 'Temperature',
//             accuracy: 0.5,
//             resolution: 1,
//             maxSampleRate: 0.2,
//         },
//         desc: {
//             SN: 'Temper8',
//             port: 7,
//         },
//     },
// ];
// // module.exports = SENSOR_LIST;
