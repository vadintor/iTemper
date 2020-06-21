

import { Descriptor, ISensorDesc} from '@/models/sensor-data';
import { Vue  } from 'vue-property-decorator';

export class SensorProxy  {
    private mDesc: Descriptor = { SN: '', port: 0} ;
    constructor(desc: Descriptor) {
            this.desc = desc;
    }
    public get desc(): Descriptor {
        return this.mDesc;
    }
    public set desc(value: Descriptor) {
        Vue.set(this, 'mDesc', value);
    }
    public get name(): string {
        return this.desc.SN + '/' + this.desc.port;
    }

    public isProxy() {
        return this instanceof SensorProxy;
    }
}
