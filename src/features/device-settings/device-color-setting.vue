<template>
    <v-expansion-panel @change="onChange">
        <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-icon :color="settingIconColor" v-text="settingIcon"/>
                </v-col>
                <v-col cols="7" v-text="settingName"/>
                <v-col cols="4">
                    <v-fab-transition leave-absolute v-if="!open">
                        <v-chip v-if="settingOn" :color="setting"/>
                        <span v-else v-text="settingOffValue"/>
                    </v-fab-transition>
                </v-col>
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row no-gutters>
                <v-col cols="1"></v-col>
                <v-col cols="11">
                    <v-form v-model="settingValid" ref="form">
                        <color-picker v-model="newSetting" :readonly="!open"/>
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
import ColorPicker from '@/components/color-picker.vue';
type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

export default defineComponent({
  name: 'DeviceColorSetting',
  components: { ColorPicker },

  setup(props, context) {
    const open = ref(false);
    const syncingSetting = ref(false);
    const { deviceState } = useDeviceState();
    const setting = computed(() => deviceState.deviceData.color);
    const newSetting = ref('');
    const settingIcon = ref('mdi-alpha-d-circle-outline');
    const settingName = ref('Color');
    const settingOffValue = ref('');
    const settingLabel = ref('Choose a color');
    const settingIconColor = computed(() => 'gray');
    const settingOn = computed(() => setting.value !== '');
    const settingValid = ref(false);
    const nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^[a-zA-Z0-9\-]+$/.test(v) && !!v && v.length >= 4  || 'Must be at least 4-32 characters, alphanumeric and hyphen characters allowed',
        ];
    const syncSetting = () => {
        if (deviceState.deviceData.color !== newSetting.value) {
            syncingSetting.value = true;
            setTimeout(() => {
                deviceState.deviceData.color = newSetting.value.slice();
                syncingSetting.value = false;
            }, 1500);
        }
    };
    const onChange = () => {
        open.value = !open.value;
        if (open.value) {
            newSetting.value = deviceState.deviceData.color ? deviceState.deviceData.color : '#cccccc';
        } else {
            syncSetting();
        }
    };
    log.debug('device-color-setting.setup');
    return { deviceState, nameRules, onChange, open, setting, newSetting, settingIcon, settingName, settingOffValue,
            settingLabel, settingIconColor, settingOn, settingValid,
            syncingSetting, syncSetting };
  },
});
</script>
