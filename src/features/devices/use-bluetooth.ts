import { DeviceState } from './device-data';
import { log } from '@/services/logger';

import { AvailableWiFiCharacteristic} from '../bluetooth-device/available-wifi-characteristics';
import { CurrentWiFiCharacteristic} from '../bluetooth-device/current-wifi-characteristic';
import { DeviceCharacteristic} from '../bluetooth-device/device-characteristic';

import { BtCharacteristics, BtService, BtStatus } from '@/features/bluetooth-device/bluetooth-service';

import { computed, ref, watch } from '@vue/composition-api';

let service: BtService;
let characteristics: BtCharacteristics;
let status: BtStatus = BtStatus.Disconnected;

export function useBluetooth() {
    const btStatus = ref(status);
    function onChanged(newStatus: BtStatus) {
        btStatus.value = newStatus;
    }
    watch(btStatus, (val, prev) => {
        if (val !== prev) {
            btStatus.value  = val;
        }
    });
    if (!service) {
        status = BtStatus.Disconnected;
        service = new BtService(onChanged.bind(onChanged));
    }
    const connecting = computed(() => {
        return btStatus.value === BtStatus.Connecting;
    });
    const connected = computed(() => {
        return btStatus.value === BtStatus.Connected;
    });
    const disconnected = computed(() => btStatus.value === BtStatus.Disconnected);
    const disconnecting = computed(() => btStatus.value === BtStatus.Disconnecting);

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

    return { btStatus, connecting, connected, connect, disconnected, disconnect, disconnecting,
        current, device, available};

}
