<template>
    <v-expansion-panel @change="onChange">
        <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-icon :color="settingIconColor" v-text="settingIcon"/>
                </v-col>
                <v-col cols="9" v-text="settingName"/>
                <v-col cols="1">
                    <v-fab-transition leave-absolute v-if="!open">
                        <span v-if="settingOn" v-text="setting"/>
                        <span v-else v-text="settingOffValue"/>
                    </v-fab-transition>
                </v-col>
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row justify="left" no-gutters>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                    <v-form v-model="settingValid" ref="form">
                    <base-text-field
                        :readonly="!open"
                        :label="settingLabel"
                        :loading="syncingSetting"
                        v-model="newSetting"
                        :rules="nameRules"
                        @updated="syncSetting"
                    ></base-text-field>
                    </v-form>
                </v-col>
            </v-row>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { computed, defineComponent, ref, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from '../devices/use-device-state';
import BaseTextField from '@/components/base-text-field.vue';
type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

export default defineComponent({
  name: 'DeviceNameSetting',
  components: {BaseTextField},

  setup(props, context) {
    const open = ref(false);
    const syncingSetting = ref(false);
    const { deviceState } = useDeviceState();
    const setting = computed(() => deviceState.deviceData.name);
    const newSetting = ref('');
    const settingIcon = ref('mdi-alpha-d-circle-outline');
    const settingName = ref('Device name');
    const settingOffValue = ref('');
    const settingLabel = ref('Enter a device name');
    const settingIconColor = computed(() => 'gray');
    const settingOn = computed(() => setting.value !== '');
    const settingValid = ref(false);
    const nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^[a-zA-Z0-9\-]+$/.test(v) && !!v && v.length >= 4  || 'Must be at least 4-32 characters, alphanumeric and hyphen characters allowed',
        ];
    const syncSetting = () => {
        if (deviceState.deviceData.name !== newSetting.value) {
            syncingSetting.value = true;
            setTimeout(() => {
                deviceState.deviceData.name = newSetting.value.slice();
                syncingSetting.value = false;
            }, 1500);
        }
    };
    const onChange = () => {
        open.value = !open.value;
        if (open.value) {
            newSetting.value = deviceState.deviceData.name.slice();
        }
    };
    log.debug('device-name-setting.setup');
    return { nameRules, onChange, open, setting, newSetting, settingIcon, settingName, settingOffValue,
            settingLabel, settingIconColor, settingOn, settingValid,
            syncingSetting, syncSetting };
  },
});
</script>
