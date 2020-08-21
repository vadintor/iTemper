<template>
    <div v-if="connected && isActionsDone">
        <v-card-title  class="headline">
            <v-row>
            <v-col cols="1"><v-icon color="blue">fab fa-bluetooth</v-icon></v-col>
            <v-col> New device found</v-col>
            </v-row>    
        </v-card-title>
        <v-card-text>
            <v-icon color="green">fa-check</v-icon> You paired with the device: <code>{{deviceName}}</code>. You can change the configuration below.
            <v-list dense>
            <v-list-item-group v-model="item" color="primary">
                <v-list-item>
                <v-list-item-icon>
                    <v-icon v-text="items[0].icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                        :label="items[0].label"
                        :prepend-icon="prependIcon"
                        v-model="deviceName"
                        :rules="nameRules"
                        required
                        clearable
                        ></v-text-field>
                    </v-form>
                </v-list-item-content>
                </v-list-item>
                <v-list-item>
                <v-list-item-icon>
                    <v-icon v-text="items[1].icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="items[1].text"></v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-actions>
        <v-btn text color="primary" :loading="disconnecting"  @click="disconnect">Disconnect</v-btn>
        </v-card-actions>
    </div>
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
    name: 'DeviceSetting',
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
