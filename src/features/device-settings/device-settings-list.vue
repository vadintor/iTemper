<template>
        <v-expansion-panels>
            <DeviceNameSetting/>
            <DeviceColorSetting/>
            <WiFiSetting/>
        </v-expansion-panels>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import DeviceNameSetting from './device-name-setting.vue';
import DeviceColorSetting from './device-color-setting.vue';
import WiFiSetting from './wifi-setting.vue';

export default defineComponent({
  name: 'DeviceSettingList',
  components: { DeviceNameSetting,
                WiFiSetting,
                DeviceColorSetting,
              },

  setup(props, context) {
    log.debug('device-settings-list.setup');
    return {};
  },
});
</script>
