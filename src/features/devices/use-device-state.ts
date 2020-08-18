import { ref, reactive, UnwrapRef } from '@vue/composition-api';
import { SensorData } from '@/models/sensor-data';
import { DeviceData, WiFiNetwork } from './device-data';
import { log } from '@/services/logger';
class UseDeviceState {
    public networks: UnwrapRef<{current: UnwrapRef<WiFiNetwork>, available: Array<UnwrapRef<WiFiNetwork>>}>;
    constructor(    public deviceData: UnwrapRef<DeviceData>,
                    current: UnwrapRef<WiFiNetwork>,
                    available: Array<UnwrapRef<WiFiNetwork>>,
                    public sensors: Array<UnwrapRef<SensorData>>) {
            this.networks = {current, available};
    }
    public addNetwork = (network: WiFiNetwork) => {
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
            reactive({ssid: ref(''), security: ref(''), quality: ref(0), channel: ref(0)}),
            [], []);
    }
    return reactive(deviceState);
}



