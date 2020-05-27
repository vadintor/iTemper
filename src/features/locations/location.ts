import { Position } from '@/models/position';
import { Descriptor } from '@/models/sensor-data';
import { Sensor } from '@/models/sensor';
import { SensorProxy} from '@/models/sensor-proxy';
import { Vue  } from 'vue-property-decorator';
export class Location  {
    public mId: string = '';
    public mName: string = '';
    public mColor: string = '';
    public mPath: string = '';
    public mSensorDesc: Descriptor[] = [];
    public mSensors: Array<Sensor | SensorProxy> = [];
    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
    public get _id(): string {
        return this.mId;
    }
    public set _id(value: string) {
        Vue.set(this, 'mId', value);
    }
    public get sensorDesc(): Descriptor[] {
        return this.mSensorDesc;
    }
    public set sensorDesc(value: Descriptor[]) {
        Vue.set(this, 'mSensorDesc', value);
    }
    public get name(): string {
        return this.mName;
    }
    public set name(value: string) {
        Vue.set(this, 'mName', value);
    }
    public get color(): string {
        return this.mColor;
    }
    public set color(value: string) {
        Vue.set(this, 'mColor', value);
    }
    public get path(): string {
        return this.mPath;
    }
    public set path(value: string) {
        Vue.set(this, 'mPath', value);
    }
    public get sensors(): Array<Sensor | SensorProxy> {
        return this.mSensors;
    }
    public set sensors(value: Array<Sensor | SensorProxy>) {
        Vue.set(this, 'mSensors', value);
    }
    public addSensorOrProxy(sensor: Sensor | SensorProxy) {
        const existing = this.sensors.find((s) => s.desc.SN === sensor.desc.SN && s.desc.port === sensor.desc.port);
        if (!existing) {
            this.sensors.push(sensor);
        }
    }
    public removeSensorOrProxy(sensor: Sensor | SensorProxy) {
        const index = this.sensors.indexOf(sensor);
        if (index >= 0) {
            this.sensors.splice(index, 1);
        }
    }
    public removeSensorOrProxyIndex(index: number) {
        if (0 <= index && index <  this.sensors.length) {
            this.sensors.splice(index, 1);
        }
    }
}
