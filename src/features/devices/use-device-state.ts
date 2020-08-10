import { ref, reactive, computed, UnwrapRef } from '@vue/composition-api';
import { SensorData, Category } from '@/models/sensor-data';
import { DeviceData, DeviceState, DeviceWiFiData, WiFiData } from './device-data';
import { log } from '@/services/logger';
class UseDeviceState {
    public networks: UnwrapRef<{current: UnwrapRef<WiFiData>, available: Array<UnwrapRef<WiFiData>>}>;
    constructor(    public deviceData: UnwrapRef<DeviceData>,
                    current: UnwrapRef<WiFiData>,
                    available: Array<UnwrapRef<WiFiData>>,
                    public sensors: Array<UnwrapRef<SensorData>>) {
            this.networks = {current, available};
    }
    public addNetwork = (network: WiFiData) => {
        deviceState.networks.available.push(reactive(network));

    }
    public getNetwork = () => {
        return deviceState.networks.available[1];
    }
}

let deviceState: UseDeviceState;
const sensorsState = Array<UnwrapRef<SensorData>>();

export default function useDeviceState() {
    if (!deviceState) {
        deviceState = new UseDeviceState(
            reactive({name: ref(''), key: ref(''), deviceID: ref('')}),
            reactive({ssid: ref(''), security: ref(''), channel: ref(0), quality: ref(0)}),
            [], []);
    }
    return reactive(deviceState);
}



