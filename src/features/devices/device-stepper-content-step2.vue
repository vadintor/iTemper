<template>
        <v-stepper-content step="2">

            <v-card
            class="mb-12"
            color="grey lighten-1"
            height="400px"
            >
                  <WiFiSetting></WiFiSetting>

            </v-card>
            <v-btn text @click="stepBack">Back</v-btn>
            <v-btn  v-if="updated" color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>
</template>
<script lang="ts">
import { onMounted, onBeforeUpdate, onUnmounted, onActivated, watchEffect } from '@vue/composition-api';
import { Vue } from 'vue-property-decorator';
import { ref, reactive, defineComponent, computed, watch, toRefs, toRef } from '@vue/composition-api';

import { SensorData, Category } from '@/models/sensor-data';
import { DeviceState, WiFiNetwork } from './device-data';
import { isDeviceStateValid} from './device-data-validators';
import useDeviceState from './use-device-state';
import { useBluetooth } from './use-bluetooth';

import WiFiSetting from '@/features/device-settings/wifi-setting.vue';
import { log } from '@/services/logger';
import { error } from 'console';

export default defineComponent({
  name: 'DeviceStepperContentStep2',
  components: { WiFiSetting },

  setup(props, context) {
    const deviceState = useDeviceState();
    const { device, current } = useBluetooth();
    const select = ref({});
    const password = ref('');
    const showPassword = ref(false);
    const updated = ref(false);
    const ssids = computed(() => deviceState.networks.available);
    const networks = computed(() => deviceState.networks.current);
    const isSecure = (ssid: string): boolean => {
      const selected = deviceState?.networks?.available.find((network: WiFiNetwork) => network.ssid === ssid);
      return !!selected && selected.security !== 'Open';
    };
    const prependIcon = (ssid: string): string =>  {
       return isSecure(ssid) ? 'fa-lock' : 'fa-unlock';
    };
    const configure = () => {
        setTimeout(() => {
        // const current = deviceState?.networks?.available.find((network: WiFiData) => network.ssid === select.value);
        }, 3_000);
    };
    const hint = (network: WiFiNetwork) => {
      return 'Security: ' + network.security;
    };
    const stepBack = () => {
      log.info('device-stepper-content-step2.stepBack', JSON.stringify(deviceState));
      context.emit('backward', deviceState);
    };
    const sync = () => {
      const Wificonfig = { ssid: 'ssid', password: password.value };
      current().writeValue(Wificonfig)
      .then(() => {
        updated.value = true;
      });
    };
    const nextStep = () => {
          const Wificonfig = { ssid: select.value, password: password.value };
          context.emit('forward', Wificonfig);
    };
    onMounted(() => {
          log.info('device-stepper-content-step2.mounted, deviceState', JSON.stringify(deviceState));
    });
    onBeforeUpdate(() => {
      log.info('device-stepper-content-step2.onBeforeUpdate!');
    });
    onUnmounted(() => {
     log.info('device-stepper-content-step2.onUnmounted!');
    });
    onActivated(() => {
      log.info('device-stepper-content-step2.onActivated!');
    });
    return { deviceState, select, ssids, configure, hint, isSecure, updated,
              stepBack, nextStep, networks, password, showPassword, prependIcon };
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