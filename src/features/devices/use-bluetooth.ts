import { DeviceState } from './device-data';
import { log } from '@/services/logger';

import { AvailableWiFiCharacteristic} from '../bluetooth-device/available-wifi-characteristics';
import { CurrentWiFiCharacteristic} from '../bluetooth-device/current-wifi-characteristic';
import { DeviceCharacteristic} from '../bluetooth-device/device-characteristic';

import { BtCharacteristics, BtService } from '@/features/bluetooth-device/bluetooth-service';

import { ref } from '@vue/composition-api';
export enum BtStatus {Disconnected, Connecting, Connected, Disconnecting}

let service: BtService;
let characteristics: BtCharacteristics;
let status: BtStatus = BtStatus.Disconnected;

export function useBluetooth() {
    const btStatus = ref(status);
    const connecting = () => {
        return btStatus.value === BtStatus.Connecting;
    };
    const connected = () => {
        return btStatus.value === BtStatus.Connected;
    };
    const disconnected = () => {
        return btStatus.value === BtStatus.Disconnected;
    };
    const disconnecting = () => {
        return btStatus.value === BtStatus.Disconnecting;
    };
    const init = () => {
        status = BtStatus.Disconnected;
        if (!service) {
            service = new BtService(onDisconnected);
        }
    };
    init();

    const connect = (): Promise<BtStatus> => {
        return new Promise ((resolve) => {
            service.scan()
            .then((found) => {
                characteristics = found;
                resolve(BtStatus.Connected);
            });
        });
};
    const disconnect = () => {
        service.disconnect();
    };
    const device = (): DeviceCharacteristic => {
        return characteristics.device;
    };
    const current = (): CurrentWiFiCharacteristic => {
        return characteristics.current;
    };
    const available = (): AvailableWiFiCharacteristic => {
        return characteristics.available;
    };
    const onDisconnected = () => {
        btStatus.value = BtStatus.Disconnected;
        service = new BtService(onDisconnected);
    };
    return { btStatus, connecting, connected, connect, disconnected, disconnect, disconnecting,
        current, device, available};

}
