<template>
        <v-stepper-content step="2">
            <v-card
            class="mb-12"
            color="grey lighten-1"
            height="400px"
            >
                <v-card-title  class="headline">
                  <v-row>
                    <v-col cols="1"><v-icon color="green">fa-wifi</v-icon></v-col>
                    <v-col>Configure Wireless network</v-col>
                  </v-row>
                  </v-card-title>
                <v-card-text>
                    <v-subheader>
                      Current: <v-chip color="primary">{{ deviceState.networks.current.ssid }}</v-chip>
                    </v-subheader>
                    <v-select
                          v-model="select"
                          :items="ssids"
                          item-text="ssid"
                          item-value="ssid"
                          label="Network"
                          noDataText="No network found"
                          :rules="[v => !!v || 'Network is required']"
                          return-object
                    >
                        <template v-slot:selection="{ item }">
                          <v-row>
                            <v-col>
                              {{ item.ssid }} - {{ item.security }}
                            </v-col>

                          </v-row>
                        </template>
                        <template v-slot:item="{ item }">
                         <v-row>
                            <v-col>
                              {{ item.ssid }}
                            </v-col>
                            <v-col cols="1">
                                <!-- HTML that describe how select should render selected items -->
                              <v-icon v-if="item.security === 'Open'">fa-unlock</v-icon>
                              <v-icon v-else>fa-lock</v-icon>
                            </v-col>
                          </v-row>
                        </template>
                    </v-select>
                    <v-text-field v-if="isSecure(select.ssid)"
                          label="password"
                          v-model="password"
                          prepend-icon="fa-key"
                          :type="showPassword ? 'text' : 'password'"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="showPassword = !showPassword"
                          :rules="[v => !!v || 'Password is required']"
                          required
                    ></v-text-field>
                </v-card-text>
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

import { log } from '@/services/logger';
import { error } from 'console';

export default defineComponent({
  name: 'DeviceStepperContentStep2',
  components: { },

  setup(props, context) {
    const deviceState = useDeviceState();
    const { device, current, disconnect, connect, btStatus } = useBluetooth();
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