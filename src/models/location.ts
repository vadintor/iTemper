import { Position } from '@/models/position';
import { Sensor } from './sensor';

export class Location {
    private mName: string;
    private mPosition: Position;
    private mSensors: Sensor[] = [];

    constructor(name: string, position: Position) {
        this.mName = name;
        this.mPosition = position;
    }
    public get name(): string {
        return this.mName;
    }
    public set name(name: string) {
        this.mName = name;
    }
    public get position(): Position {
        return this.mPosition;
    }
    public set position(position: Position) {
        this.mPosition = position;
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
