<template>
        <v-expansion-panels>
        </v-expansion-panels>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from '../devices/use-device-state';
import WiFiSetting from './wifi-setting.vue';

export default defineComponent({
  name: 'DeviceSettingList',
  components: { WiFiSetting },

  setup(props, context) {

    log.debug('device-settings.setup');
    return {};
  },
});
</script>
