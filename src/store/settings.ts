export class Settings {
    private mResolution: number = 1;
    private mUnitSymbol: string = '°C';
    private mLimit: number = 30;
    private mInterval: number = 60;
    private mZone: string = 'Europe/Stockholm';

    get resolution(): number {
        return this.mResolution;
    }

    set resolution(value: number) {
        this.mResolution = value;
    }

    get unitSymbol(): string {
        return this.mUnitSymbol;
    }

    set unitSymbol(value: string) {
        this.mUnitSymbol = value;
    }
    get limit(): number {
        return this.mLimit;
    }

    set limit(value: number) {
        this.mLimit = value;
    }

    get interval(): number {
        return this.mInterval;
    }

    set interval(value: number) {
        this.mInterval = value;
    }

    get zone(): string {
        return this.mZone;
    }

    set zone(value: string) {
        this.mZone = value;
    }

}

export const settings = new Settings();
