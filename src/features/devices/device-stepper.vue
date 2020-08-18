<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">Connect device</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" step="2">Configure WiFi</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="saved()" step="3">Configure sensors</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <DeviceStepperContentStep1 @cancel="cancel" @backward="stepBack" @forward="nextStep"></DeviceStepperContentStep1>
      <DeviceStepperContentStep2 @cancel="cancel" @backward="stepBack" @forward="nextStep"></DeviceStepperContentStep2>
      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="400px"
        >
            <v-card-title>Network configuration:</v-card-title>
            <v-card-text v-if="ssid !== ''">
                <pre>{{ssid}}</pre>
            </v-card-text>
        </v-card>
        <v-btn text @click="stepBack">Back</v-btn>
        <v-btn color="primary" :loading="saving()" @click="submit">Save</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import { ref, computed } from '@vue/composition-api';
import { defineComponent, onMounted } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from './use-device-state';
import { DeviceState } from './device-data';
import DeviceStepperContentStep1 from './device-stepper-content-step1.vue';
import DeviceStepperContentStep2 from './device-stepper-content-step2.vue';
enum SavedStatus { NotSaved, Saving, Saved}

export default defineComponent({
  name: 'DeviceStepper',
  components: {
     DeviceStepperContentStep1,
     DeviceStepperContentStep2,
     },

  setup(props, context) {
    const step = ref(1);
    const savedStatus = ref(SavedStatus.NotSaved);
    const deviceState = useDeviceState();
    const ssid = computed(() => deviceState.networks.current.ssid);

    const submit = () => {
        savedStatus.value = SavedStatus.Saving;
        setTimeout(() => {
            savedStatus.value = SavedStatus.Saved;
        }, 1_000);
    };
    const cancel = () => {
      context.emit('close');
    };
    const stepBack = () => {
        savedStatus.value = SavedStatus.NotSaved;
        step.value--;
    };
    const nextStep = () => {
      step.value++;
    };
    const saving = () => {
        return savedStatus.value === SavedStatus.Saving;
    };
    const saved = () => {
        return savedStatus.value === SavedStatus.Saved;
    };
    return { stepBack, nextStep, saved, saving, step, submit, deviceState, ssid, cancel };
  },
});
</script>

</style>