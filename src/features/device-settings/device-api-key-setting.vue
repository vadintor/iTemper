<template>
    <device-setting name="Shared access key" :value=setting :isOn="isOn">
        <div v-if="isOn">
            <p>
                <span   class="d-inline-block text-truncate" 
                        style="max-width: 400px;">
                <v-btn text icon @click="copy">
                    <v-icon >fa-clone</v-icon>
                </v-btn>
                <span id="deviceKey">{{ setting }}</span>
                </span>
            </p>
            <p class="font-weight-medium"><span>Copy the shared access key by clicking on the icon</span>
            <v-icon >fa-clone</v-icon><span>above.</span></p>
            <error-message :message="errorMsg"/>
        </div>
    </device-setting>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from '../devices/use-device-state';
import DeviceSetting from './device-setting.vue';
import ErrorMessage from '@/components/error-message.vue';

export type DeviceSettingValue = string | number;
export type validatorFunction = (value: DeviceSettingValue) => boolean;

import {json, copyToClipboard } from '@/helpers';

const message = '';
export function useErrorMessage() {
    const errorMsg = ref(message);
    const displayError = (msg: string, ms: number = 2_000) => {
        errorMsg.value = msg;
        setTimeout(() => reset(), ms);
    };
    const reset = (): void => {
        errorMsg.value = '';
    };
    return { errorMsg , displayError };
}
export default defineComponent({
    name: 'DeviceApiKeySetting',
    components: { DeviceSetting, ErrorMessage },
    setup(props, context) {
        const { deviceState } = useDeviceState();
        const setting = computed(() => deviceState.deviceData.key);
        const isOn = computed(() => setting.value !== '');

        const { errorMsg, displayError } = useErrorMessage();

        const copy = () => {
            if (!copyToClipboard('deviceKey')) {
                   displayError('Cannot copy key to clipboard');
            }
        };
        return { isOn, setting, errorMsg };
    },
});
</script>
