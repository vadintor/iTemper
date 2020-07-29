

import { Descriptor, ISensorDesc, Sample, SensorLog} from '@/models/sensor-data';
import { Vue  } from 'vue-property-decorator';

export class SensorProxy  {
    protected mDesc: Descriptor;
    protected mSamples: Sample[];
    constructor(desc: Descriptor, samples: Sample[] = []) {
            this.mDesc = desc;
            this.mSamples = samples;
    }
    public get desc(): Descriptor {
        return this.mDesc;
    }
    public set desc(value: Descriptor) {
        Vue.set(this, 'mDesc', value);
    }
    public get samples(): Sample[] {
        return this.mSamples;
    }
    public set samples(value: Sample[]) {
        Vue.set(this, 'mSamples', value);
    }
    public get name(): string {
        return this.desc.SN + '/' + this.desc.port;
    }
    public isProxy() {
        return this instanceof SensorProxy;
    }
}
