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
    desc: Descriptor;
    samples: Sample[];
}
export interface SensorData {
    _id: string;
   deviceID: string;
   desc: Descriptor;
   attr: Attributes;
   samples: Sample[];
}

export interface ISensorDesc {
    desc: Descriptor;
}

// deviceID: String,
// desc: {
//   SN: String,
//   port: Number
// },

// attr: {
//   model: String,
//   category: String,
//   accuracy: Number,
//   resolution: Number,
//   maxSampleRate: Number
// },

// samples: [{
//   _id: false,  // if true, Mongodb creates _id implicitly. We do not want that here
//   date: Number,
//   value: Number
// }]
