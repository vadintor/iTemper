import { Position } from '@/models/position';
import { Sensor } from './sensor';

export class Location {
    public mId: string = '';
    public mName: string = '';
    public mColor: string = '';
    public mPath: string = '';
//    private mPosition: Position;
    public mSensors: Sensor[] = [];

    constructor(name: string, color: string) {
        this.mName = name;
        this.mColor = color;
    }
    public get _id(): string {
        return this.mId;
    }
    public set _id(value: string) {
        this.mId = value;
    }
    public get name(): string {
        return this.mName;
    }
    public set name(value: string) {
        this.mName = value;
    }
    public get color(): string {
        return this.mColor;
    }
    public set color(value: string) {
        this.mColor = value;
    }
    public get path(): string {
        return this.mPath;
    }
    public set path(value: string) {
        this.mPath = value;
    }
    // public get position(): Position {
    //     return this.mPosition;
    // }
    // public set position(position: Position) {
    //     this.mPosition = position;
    // }

    public get sensors(): Sensor[] {
        return this.mSensors;
    }
    public addSensor(sensor: Sensor) {
        const existing = this.mSensors.find((s) => s.desc.SN === sensor.desc.SN && s.desc.port === sensor.desc.port);
        if (!existing) {
            this.mSensors.push(sensor);
        }
    }
    public removeSensor(sensor: Sensor) {
        const index = this.mSensors.indexOf(sensor);
        if (index >= 0) {
            this.mSensors.splice(index, 1);
        }
    }

    public removeSensorIndex(index: number) {
        if (0 <= index && index <  this.mSensors.length) {
            this.mSensors.splice(index, 1);
        }
    }

}
