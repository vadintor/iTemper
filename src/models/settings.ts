export interface  GlobalSettings {
    resolution: number;
    unitSymbol: string;
    limit: number;
    interval: number;
}

export let DefaultGlobalSettings: GlobalSettings = {
                    resolution: 2,
                    unitSymbol: '°C',
                    limit: 30,
                    interval: 5,
                    };
