<template>
    <v-form v-model="valid" ref="device">
        <div v-if="deviceKey !== ''">
        <p>

            <span   class="d-inline-block text-truncate" 
                    style="max-width: 400px;">
            <v-btn text icon @click="copy">
                <v-icon >fa-clone</v-icon>
            </v-btn>
            <span id="deviceKey">{{ deviceKey }}</span>
            </span>

        </p>
        <p class="font-weight-medium"><span>Copy the shared access key by clicking on the icon</span>
        <v-icon >fa-clone</v-icon><span>above and store it securily. iTemper does not store the key for security reasons.</span></p>
        </div>
    </v-form>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from '../devices/use-device-state';

export type DeviceSettingValue = string | number;
export type validatorFunction = (value: DeviceSettingValue) => boolean;

export interface DeviceSetting {
    name: string;
    label: string;
    value: DeviceSettingValue;
    defaultValue: DeviceSettingValue;
    text: string;
    readonly: boolean;
    validator?: validatorFunction;
}
export default defineComponent({
    name: 'DeviceApiKeySetting',
    components: {},
    props: {
        setting: Object,

    },
    setup(props, context) {
        const setting: DeviceSetting = props.setting as DeviceSetting;
        const deviceState = useDeviceState();
    },
});
</script>
