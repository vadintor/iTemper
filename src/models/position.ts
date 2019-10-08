export class Position {
    private static unknown: number = -100;

    public mLatitude: number;
    public mLongitude: number;

    constructor(lat: number = Position.unknown, lng: number = Position.unknown) {
        this.mLatitude = lat;
        this.mLongitude = lng;
    }
    public get latitude(): number {
        return this.mLatitude ;
    }
    public set latitude(lat: number) {
        this.mLatitude = lat;
    }

    public get longitude(): number {
        return this.mLongitude;
    }

    public set longitude(lng: number) {
        this.mLongitude = lng;
    }

    public get position(): Position {
        return this;
    }

    public set position(position: Position) {
        this.mLatitude = position.mLatitude;
        this.mLongitude = position.mLongitude;
    }

    public isUnknown(): boolean {
        return this.mLatitude === Position.unknown && this.mLongitude === Position.unknown;
    }

}
