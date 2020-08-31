<template>
        <v-stepper-content step="1" transition="scroll-x-transition">
        <v-card
          class="mb-12"
          color="grey lighten-1"
        >
            <new-device
              :name="newDeviceName"
              :color="newDeviceColor"
              v-model="newDevice"
              @created="deviceCreated"/>
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
import { Device } from '@/features/devices/device';
import useDeviceState from './use-device-state';
import { useBluetooth } from './use-bluetooth';
import { BtStatus } from '@/features/bluetooth-device/bluetooth-service';

import { log } from '@/services/logger';
import { error } from 'console';

import NewDevice from './new-device.vue';
enum SavedStatus { NotSaved, Saving, Saved}
type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

export default defineComponent({
  name: 'DeviceStepperContentStep1',
  components: { NewDevice },

  setup(props, context) {
    const { deviceState, resetDeviceState } = useDeviceState();
    const  { btStatus, connecting, connected, connect, disconnected,
              disconnect, disconnecting, current, device, available } = useBluetooth();
    const newDevice = ref(false);
    const currentAction = ref(-1);
    const action = ref(1);
    const actions = reactive([
        { text: 'Connect to device',
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
    const newDeviceName = computed(() => deviceState.deviceData.name);
    const newDeviceColor = computed(() => deviceState.deviceData.color);
    const isFirstActionStarted = computed(() => {
      const firstAction = actions[0];
      return firstAction.loading || firstAction.done || firstAction.error;
    });
    const isActionsDone = computed(() => {
      let done = true;
      actions.forEach((i) => done = done && i.done);
      return done;
    });
    const deviceIDOf = (key: string) => {
      const deviceID = key.slice(0, key.indexOf(':'));
      log.info('device-stepper-content-step1.deviceIDOf=' + deviceID);
      return key.slice(0, key.indexOf(':'));
    };
    const isActionStarted = (index: number) => {
      const thisAction = actions[index];
      return thisAction.loading || thisAction.done || thisAction.error;
    };
    async function scan() {
      try {
        startActions();
        await connectDevice();
        actionDone();
        await retriveDeviceData();
        const existingDevice = Vue.$store.devices.all
        .filter((dev) => dev.deviceID === deviceState.deviceData.deviceID );
        if (existingDevice.length === 0) {
          log.info('device-stepper-content-step1.scan: - create a new device?');
          newDevice.value = true;
        } else {
          log.debug('device-stepper-content-step1.scan: retrieve network configuration for an existing device:' +
                    JSON.stringify(existingDevice));
          await retrieveCurrentWiFiNetwork();
          await retrieveAvailableWiFiNetworks();
          actionDone();
          nextStep();
        }
      } catch (e) {
        actionError(e);
        log.info('device-stepper-content-step1.scan Cannot connect to BLE device');
      }
    }
    async function connectDevice() {
        log.info('device-stepper-content-step1.connectDevice');
        const status = await connect();
    }
    async function retriveDeviceData() {
      const MaxRetries = 1;
      let retries = 0;
      let done = false;
      while (retries <= MaxRetries && !done) {
        try {
          const deviceConfig = await device().readValue();
          log.info('device-stepper-content-step1.retriveDeviceData: device data read');
          resetDeviceState();
          // Device data
          deviceState.deviceData.name = deviceConfig.name;
          deviceState.deviceData.deviceID = deviceIDOf(deviceConfig.key);
          deviceState.deviceData.key = deviceConfig.key;
          deviceState.deviceData.color = deviceConfig.color;
          done = true;
        } catch (e) {
            if (retries < MaxRetries) {
              retries = retries + 1;
              await connectDevice();
              log.info('device-stepper-content-step1.retriveDeviceData: retrying');
            } else {
              log.error('device-stepper-content-step1.retriveDeviceData: invalid device data');
              actionError(e);
              return;
            }
        }
      }
    }
    async function retrieveCurrentWiFiNetwork() {
      try {
        const wifi = await current().readValue();
        deviceState.networks.current.ssid = wifi.ssid;
        deviceState.networks.current.security = wifi.security;
        deviceState.networks.current.quality = wifi.quality;
        deviceState.networks.current.channel = wifi.channel;
        log.info('device-stepper-content-step1.retrieveCurrentWiFiNetwork deviceState= %s',
                  JSON.stringify(deviceState));
      } catch (e) {
        log.error('device-stepper-content-step1.retrieveCurrentWiFiNetwork: ' + e);
      }
    }
    async function retrieveAvailableWiFiNetworks() {
      const MaxRetries = 1;
      let retries = 0;
      let done = false;
      while (retries <= MaxRetries && !done) {
        try {
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
          done = true;
        } catch (e) {
            if (retries < MaxRetries) {
              retries += 1;
              await connect();
              log.info('device-stepper-content-step1.retrieveAvailableWiFiNetworks: retrying');
            } else {
              log.error('device-stepper-content-step1.retrieveAvailableWiFiNetworks: invalid device configuration');
              actionError(e);
            }
        }
      }
      log.info('device-stepper-content-step1 deviceState= %s', JSON.stringify(deviceState));
    }
    const writeDeviceConfiguration = () => {
      try {
        device().writeValue(deviceState.deviceData);
      } catch {
        log.error('device-stepper-content-step1: cannot write deviceData=' + JSON.stringify(deviceState.deviceData));
      }
    };
    const nextStep = () => {
      context.emit('forward', deviceState);
    };
    async function deviceCreated(event: Device) {
      deviceState.deviceData.deviceID = event.deviceID;
      deviceState.deviceData.key = event.key;
      await writeDeviceConfiguration();
      await retrieveCurrentWiFiNetwork();
      await retrieveAvailableWiFiNetworks();
      actionDone();
      nextStep();
    }
    const ready = computed(() => isActionsDone && connected);
    const cancel = () => {
      disconnect();
      resetActions();
      context.emit('cancel', deviceState);
    };

    return {  connecting, connected, deviceState, disconnect, disconnecting, disconnected, newDevice,
              ready, scan, deviceCreated, newDeviceName, newDeviceColor,
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
