import { DeviceState } from './device-data';
import { log } from '@/services/logger';

import { AvailableWiFiCharacteristic} from '../bluetooth-device/available-wifi-characteristics';
import { CurrentWiFiCharacteristic} from '../bluetooth-device/current-wifi-characteristic';
import { DeviceInfoCharacteristic} from '../bluetooth-device/device-info-characteristic';

import { BtCharacteristics, BtService, BtStatus } from '@/features/bluetooth-device/bluetooth-service';

import { computed, ref, watch } from '@vue/composition-api';

let service: BtService;
let characteristics: BtCharacteristics;
const status: BtStatus = BtStatus.Disconnected;
const name: string = '';

export function useBluetooth() {
    const btStatus = ref(status);
    const btName = ref(name);
    function onChanged(newStatus: BtStatus) {
        btStatus.value = newStatus;
        btName.value = service.name;
    }
    watch(btStatus, (val, prev) => {
        if (val !== prev) {
            btStatus.value  = val;
        }
    });
    const reset = () => {
        btStatus.value = BtStatus.Disconnected;
        btName.value = '';
        if (!service) {
            service = new BtService(onChanged.bind(onChanged));
        }
    };
    reset();
    const connecting = computed(() => {
        return btStatus.value === BtStatus.Connecting;
    });
    const connected = computed(() => {
        return btStatus.value === BtStatus.Connected;
    });
    const disconnected = computed(() => btStatus.value === BtStatus.Disconnected);
    const disconnecting = computed(() => btStatus.value === BtStatus.Disconnecting);

    async function connect(): Promise<BtStatus> {
        try {
            reset();
            characteristics = await service.getCharacteristics();
            btStatus.value = BtStatus.Connected;
            return btStatus.value;
        } catch (e) {
            return BtStatus.Disconnected;
        }
    }
    const disconnect = () => {
        service.disconnect();
    };
    const device = (): DeviceInfoCharacteristic => {
        return characteristics.device;
    };
    const current = (): CurrentWiFiCharacteristic => {
        return characteristics.current;
    };
    const available = (): AvailableWiFiCharacteristic => {
        return characteristics.available;
    };

    return { btStatus, btName, connecting, connected, connect, disconnected, disconnect, disconnecting,
        current, device, available};

}
