interface Config {
    development: boolean;
    iTemperAPI: string;
    iTemperWS: string;
}

function configure(): Config {
    const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (development) {
        return {
            development,
            iTemperAPI: 'https://localhost:3000/',
            iTemperWS: 'wss://localhost:3000/ws',
        };
    } else {
        return {
            development,
            iTemperAPI: 'https://api.itemper.io/',
            iTemperWS: 'wss://device.itemper.io/ws',
        };
    }

}

export const config = configure();
export const iTemperAPI = config.iTemperAPI;
export const iTemperWS = config.iTemperWS;
