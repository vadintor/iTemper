<template>
        <v-expansion-panels>
            <DeviceNameSetting/>
            <DeviceColorSetting/>
            <DeviceApiKeySetting/>
            <DeviceWiFiSetting/>
        </v-expansion-panels>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import DeviceNameSetting from './device-name-setting.vue';
import DeviceColorSetting from './device-color-setting.vue';
import DeviceApiKeySetting from './device-api-key-setting.vue';
import DeviceWiFiSetting from './device-wifi-setting.vue';

export default defineComponent({
  name: 'DeviceSettingList',
  components: { DeviceNameSetting,
                DeviceColorSetting,
                DeviceApiKeySetting,
                DeviceWiFiSetting,
              },

  setup(props, context) {
    log.debug('device-settings-list.setup');
    return {};
  },
});
</script>
