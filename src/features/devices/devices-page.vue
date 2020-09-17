<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex v-for="(item,id) in state.devices.all" :key="id">
                <device-card  
                    :device="item"
                    :id="id"
                >
                </device-card>
            </v-flex>
            <v-chip v-if="deviceCount === 0" transition="scale-transition" >Det finns inga enheter ännu</v-chip>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import * as moment from 'moment-timezone';
import {Vue, Component, Watch} from 'vue-property-decorator';
import { computed, defineComponent, onMounted } from '@vue/composition-api';

// Store
import { useState } from '@/store/store';

// Services
import { log } from '@/services/logger';
// Child components
import DeviceCard from '@/features/devices/device-card.vue';

export default defineComponent({
  name: 'DevicesPage',
  components: { DeviceCard },

  setup(props, context) {
    const { state } = useState('device-page');

    const deviceCount = computed (() => state.devices.all.length);

    log.debug('DevicePage.setup');
    return { state, deviceCount };
  },
});
</script>
