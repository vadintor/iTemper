<template>
        <v-stepper-content step="2" transition="scroll-x-transition">
            <v-card
            class="mb-12"
            color="blue lighten-1"
            >
                <v-card-text>
                    <device-settings-list>
                        <DeviceNameSetting/>
                        <DeviceColorSetting 
                            :value="deviceState.deviceData.color"
                            @input="syncColor"
                        />
                        <DeviceApiKeySetting/>
                        <DeviceWiFiSetting/>
                    </device-settings-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click="stepBack">Back</v-btn>
                  <v-btn  v-if="updated" color="primary" @click="nextStep">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-stepper-content>
</template>
<script lang="ts">
import { ref, defineComponent} from '@vue/composition-api';
import { DeviceData } from './device-data';
import { useBluetooth } from './use-bluetooth';
import useDeviceState from './use-device-state';

import DeviceSettingsList from '@/features/device-settings/device-settings-list.vue';
import DeviceNameSetting from '@/features/device-settings/device-name-setting.vue';
import DeviceColorSetting from '@/features/device-settings/device-color-setting.vue';
import DeviceApiKeySetting from '@/features/device-settings/device-api-key-setting.vue';
import DeviceWiFiSetting from '@/features/device-settings/device-wifi-setting.vue';
import { log } from '@/services/logger';

export default defineComponent({
  name: 'DeviceStepperContentStep2',
  components: {
      DeviceSettingsList,
      DeviceNameSetting,
      DeviceColorSetting,
      DeviceApiKeySetting,
      DeviceWiFiSetting,
  },

  setup(props, context) {
    const { deviceState, resetDeviceState } = useDeviceState();
    const  { btStatus, connecting, connected, connect, disconnected,
              disconnect, disconnecting, current, device, available } = useBluetooth();
    const loading = ref(false);
    const updated = ref(false);

    async function syncColor(event: string) {
      const cached = deviceState.deviceData.color.slice();
      try {
            loading.value = true;
            deviceState.deviceData.color = event.slice();
            await device().writeValue(deviceState.deviceData);
        } catch {
            deviceState.deviceData.color = cached;
        } finally {
          loading.value = false;
        }
    }
    const stepBack = () => {
      log.info('device-stepper-content-step2.stepBack', JSON.stringify(deviceState));
      context.emit('backward', deviceState);
    };
    const nextStep = () => {
          available().unsubscribe();
          context.emit('forward');
    };
    return { deviceState, loading, updated, stepBack, nextStep};
  },
});
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>