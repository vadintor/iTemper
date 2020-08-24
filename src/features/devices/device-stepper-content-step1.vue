<template>
        <v-stepper-content step="1">
        <v-card
          class="mb-12"
          color="grey lighten-1"
        >
            <div v-if="connected && isActionsDone">
                <v-card-title  class="headline">
                    <v-row>
                      <v-col cols="1"><v-icon color="blue">fab fa-bluetooth</v-icon></v-col>
                      <v-col> New device found</v-col>
                    </v-row>    
                </v-card-title>
                <v-card-text>
                    <v-icon color="green">fa-check</v-icon> You paired with a device. You can change the configuration below.
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="primary" :loading="disconnecting"  @click="disconnect">Disconnect</v-btn>
                </v-card-actions>
            </div>
            <div v-else>
                <v-card-title  class="headline">
                  <v-row>
                    <v-col cols="1"><v-icon color="blue">fab fa-bluetooth-b</v-icon></v-col>
                    <v-col>Search for devices</v-col>
                  </v-row>             
                  </v-card-title>  
                <v-card-text>
                    Turn on your iTemper device. 
                    Click Scan!
                    Please wait until the connection is complete.
                    
                    <v-list flat v-if="!disconnected && isFirstActionStarted && !isActionsDone">
                      <v-subheader>Progress</v-subheader>
                      <v-list-item-group v-model="action" color="primary">
                        <v-list-item
                          v-for="(action, i) in actions"
                          :key="i"
                        >
                          <v-list-item-icon v-if="!isActionStarted(i) || action.loading">
                            <v-progress-circular
                              :indeterminate="action.loading"
                              color="grey"
                            ></v-progress-circular>
                          </v-list-item-icon>
                          <v-list-item-icon v-if="action.done">
                            <v-icon  color="green">fa-check</v-icon>
                          </v-list-item-icon>
                          <v-list-item-icon v-if="action.error">
                            <v-icon  color="red">fa-times</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content v-if="!action.error">
                            <v-list-item-title v-text="action.text"></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-content v-else>
                            <v-list-item-title v-text="action.errorText"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>

                </v-card-text>
                <v-card-actions>
                    <v-btn :disabled="connecting" text color="primary" @click="scan()">
                      Scan
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>fa-sync</v-icon>
                        </span>
                      </template>
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card>
        <v-btn @click="cancel" text>Cancel</v-btn>
        <v-btn  :disabled="!ready" color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>
</template>

<script lang="ts">
import { ref, reactive, onBeforeUpdate, onUnmounted, onActivated } from '@vue/composition-api';
import { Vue } from 'vue-property-decorator';
import { defineComponent, onMounted, watchEffect, computed } from '@vue/composition-api';

import { SensorData, Category } from '@/models/sensor-data';
import { DeviceData, DeviceState, DeviceWiFiData, WiFiNetwork } from './device-data';

import useDeviceState from './use-device-state';
import { useBluetooth } from './use-bluetooth';
import { BtStatus } from '@/features/bluetooth-device/bluetooth-service';

import { log } from '@/services/logger';
import { error } from 'console';

enum SavedStatus { NotSaved, Saving, Saved}
type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

export default defineComponent({
  name: 'DeviceStepperContentStep1',
  components: { },

  setup(props, context) {
    const {deviceState, resetDeviceState } = useDeviceState();
    const  { btStatus, connecting, connected, connect, disconnected,
              disconnect, disconnecting, current, device, available } = useBluetooth();
    const currentAction = ref(-1);
    const action = ref(1);
    const actions = reactive([
        { text: 'Establishing Bluetooth connection',
          loading: false,
          done: false,
          error: false,
          errorText: 'Cannot establish Bluetooth connection'},
        { text: 'Retrieving device configuration',
          loading: false,
          done: false,
          error: false,
          errorText: 'Cannot retreive device configuration'},
      ]);
    const currentActionValid = () => {
      return 0 <= currentAction.value && currentAction.value  < actions.length;
    };
    const resetActions = ()  => {
      currentAction.value = -1;
      actions.forEach((i) =>  {
        i.loading = false;
        i.done = false;
        i.error = false;
      });
    };
    const startActions = () => {
      resetActions();
      nextAction();
    };
    const nextAction = () => {
      currentAction.value = currentAction.value + 1;
      actionStarted();
      log.info('device-stepper-content-step1, nextAction= ' + currentAction.value);
    };
    const actionStarted = () => {
      log.info('device-stepper-content-step1, actionStarted= %s', currentAction.value);
      actions[currentAction.value].loading = true;
      actions[currentAction.value].done = false;
      actions[currentAction.value].error = false;
    };
    const actionDone = () => {
      log.info('device-stepper-content-step1, actionDone= %s', currentAction.value);
      actions[currentAction.value].loading = false;
      actions[currentAction.value].done = true;
      actions[currentAction.value].error = false;
      if (currentAction.value < actions.length - 1) {
        nextAction();
      }
    };
    const actionError = (errorMessage: string) => {
      log.info('device-stepper-content-step1, actionError= %s', currentAction.value);
      log.error('device-stepper-content-step1, actionError, message= %s', errorMessage);
      actions[currentAction.value].errorText = errorMessage;
      actions[currentAction.value].loading = false;
      actions[currentAction.value].done = false;
      actions[currentAction.value].error = true;
    };
    const isFirstActionStarted = computed(() => {
      const firstAction = actions[0];
      return firstAction.loading || firstAction.done || firstAction.error;
    });
    const isActionsDone = computed(() => {
      let done = true;
      actions.forEach((i) => done = done && i.done);
      return done;
    });
    const isActionStarted = (index: number) => {
      const thisAction = actions[index];
      return thisAction.loading || thisAction.done || thisAction.error;
    };
    const scan = () => {
      try {
        startActions();
        watchEffect(() => {
          connect()
          .then((status: BtStatus) => {
              actionDone();
              log.debug('device-stepper-content-step1, status=' + BtStatus[status]);
              device().readValue()
              .then((deviceConfig) => {
                  log.info('device-stepper-content-step1: device data read');
                  resetDeviceState();
                  // Device data
                  deviceState.deviceData.name = deviceConfig.name;
                  deviceState.deviceData.deviceID = deviceConfig.deviceID;
                  deviceState.deviceData.key = deviceConfig.key;
                  deviceState.deviceData.color = deviceConfig.color;
                  current().readValue()
                  .then((wifi) => {
                        // current WiFi
                        deviceState.networks.current.ssid = wifi.ssid;
                        deviceState.networks.current.security = wifi.security;
                        deviceState.networks.current.quality = wifi.quality;
                        deviceState.networks.current.channel = wifi.channel;
                        available().subscribe((network: WiFiNetwork) => {
                                const found = deviceState.networks.available.find((n) =>
                                            n.ssid === network.ssid && n.channel === network.channel);
                                if (found) {
                                  found.quality = network.quality;
                                  found.security = network.security;
                                } else {
                                  deviceState.networks.available.push(reactive(
                                  {   ssid: ref(network.ssid),
                                      security: ref(network.security),
                                      quality: ref(network.quality),
                                      channel: ref(network.channel),
                                  }));
                                }
                        });
                        log.info('device-stepper-content-step1 deviceState= %s', JSON.stringify(deviceState));
                        actionDone();
                        nextStep();
                  })
                  .catch((e: Error) => {
                      log.error('device-stepper-content-step1.Received invalid wifi configuration');
                      actionError(e.message);
                  });
              })
              .catch((e) => {
                log.error('device-stepper-content-step1.Received invalid device configuration');
                actionError(e);
              });
          }).catch((e) => {
                log.info('device-stepper-content-step1 Cannot connect to BLE device');
                actionError(e);
          });
        });
      } catch {
              actionError('No devices found');
              log.info('No devices found, do something');
      }
    };

    const ready = computed(() => isActionsDone && connected);

    const cancel = () => {
      disconnect();
      resetActions();
      context.emit('cancel', deviceState);
    };
    const nextStep = () => {
      context.emit('forward', deviceState);
    };
    onMounted(() => {
      log.info('device-stepper-content-step1.mounted!');
    });
    onBeforeUpdate(() => {
      log.info('device-stepper-content-step1.onBeforeUpdate!');
    });
    onUnmounted(() => {
     log.info('device-stepper-content-step1.onUnmounted!');
    });
    onActivated(() => {
      log.info('device-stepper-content-step1.onActivated!');
    });

    return {  connecting, connected, deviceState, disconnect, disconnecting, disconnected, ready, scan,
               cancel, nextStep, action, actions, isActionsDone, isFirstActionStarted, isActionStarted };
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