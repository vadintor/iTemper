export interface  GlobalSettings {
    resolution: number;
    unitSymbol: string;
    limit: number;
    interval: number;
}

export let DefaultGlobalSettings: GlobalSettings = {
                    resolution: 1,
                    unitSymbol: '°C',
                    limit: 25,
                    interval: 20,
                    };
