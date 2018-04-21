export interface  GlobalSettings {
    resolution: number;
    unitSymbol: string;
    limit: number;
    interval: number;
    zone: string;
}

export let DefaultGlobalSettings: GlobalSettings = {
                    resolution: 1,
                    unitSymbol: '°C',
                    limit: 30,
                    interval: 30,
                    zone: 'Europe/Stockholm',
};
