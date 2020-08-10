import {DeviceData, DeviceWiFiData, WiFiData, DeviceState} from './device-data';
import { isObject, isSensorDataArrayValid } from '@/models/sensor-data-validators';
import { log } from '@/services/logger';


export function isDeviceDataValid(raw: unknown): boolean {
    let valid = isObject(raw);
    if (!valid) {
        log.error('device-data-validators.isDeviceDataValid - not an object');
    } else {
        const data = raw as Partial<DeviceData>;
        valid = valid
        && 'deviceID' in data && typeof data.deviceID === 'string'
        && 'name' in data && typeof data.name === 'string'
        && 'key' in data && typeof data.key === 'string';
        if (!valid) {
            log.error('device-data-validators.isDeviceDataValid - not valid');
        }
    }
    return valid;
}
export function isWiFiDataValid(raw: unknown): boolean {
    let valid = isObject(raw);
    if (!valid) {
        log.error('device-data-validators.isWiFiDataValid - not an object');
    } else {
        const data = raw as Partial<WiFiData>;
        valid = valid
        && 'ssid' in data && typeof data.ssid === 'string'
        && 'security' in data && typeof data.security === 'string'
        && 'channel' in data && typeof data.channel === 'number'
        && 'quality' in data && typeof data.quality === 'number';
        if (!valid) {
            log.error('device-data-validators.isWiFiDataValid - not valid');
        }
    }
    return valid;
}
export function isDeviceWiFiDataValid(raw: unknown): boolean {
    let valid = isObject(raw);
    if (!valid) {
        log.error('device-data-validators.isDeviceWiFiDataValid - not an object');
    } else {
        const data = raw as Partial<DeviceWiFiData>;
        if ('current' in data) {
            valid = valid && isWiFiDataValid(data.current);
        }
        valid = valid
        && 'available' in data && Array.isArray(data.available);
        if (valid) {
            data.available?.forEach((network) => valid = valid && isWiFiDataValid(network));
        }
        if (!valid) {
            log.error('device-data-validators.isDeviceWiFiDataValid - not valid');
        }
    }
    return valid;
}
export function isDeviceStateValid(raw: unknown): boolean {
    let valid = isObject(raw);
    if (!valid) {
        log.error('device-data-validators.isDeviceStateValid - not an object');
    } else {
        const data = raw as Partial<DeviceState>;
        if ('deviceData' in data) {
            valid = valid && isDeviceDataValid(data.deviceData);
        }
        valid = valid
        && 'networks' in data && isDeviceWiFiDataValid(data.networks)
        && 'sensors' in data && isSensorDataArrayValid(data.sensors);
        if (!valid) {
            log.error('device-data-validators.isDeviceStateValid - not valid');
        }
    }
    return valid;
}
