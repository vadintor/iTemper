<template>
        <v-row>
            <v-col v-for="(item,id) in state.locations.all" :key="id">
                <location-card  
                    :location="item"
                    :id="id"
                    :height=400
                >
                </location-card> 
               <v-chip v-if="locationCount === 0" transition="scale-transition" >Det finns inga platser.</v-chip>
            </v-col>
        </v-row>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, computed, watch, toRefs, toRef, onMounted, watchEffect } from '@vue/composition-api';

// Store
import { Status } from '@/store/user';

// Services
import { log } from '@/services/logger';

// Child components
import LocationCard from './location-card.vue';

import { store } from '@/store/store';

export default defineComponent({
  name: 'LocationPage',
  components: { LocationCard },

  setup(props, context) {

    const state = reactive(store);

    let timeout: NodeJS.Timeout;

    const locationCount = computed(() => state.locations.all.length);

    const getLocations = () => {
        log.debug('location-page.getLocations');
    };
    watchEffect(() => {
        log.debug('location-page, status=' + Status[state.user.status]);
        if (state.user.status === Status.LOGGED_IN) {
            const sampleCount = 2;
            // make sure we have some values from all sensors before loading locations
            state.sensors.loadSensors(sampleCount)
            .then(() => {
                state.locations.getLocations();
                state.sensors.getSensorsLast24h();
                timeout = setInterval(() => state.sensors.getSensorsSamples(sampleCount),
                            1000 * state.settings.interval);
            });
        }
    });
    watchEffect(() => {
        log.debug('location-page, status=' + Status[state.user.status]);
        if (state.user.status === Status.LOGGED_OUT) {
            if (timeout) {
                clearInterval(timeout);
            }
        }
    });
    const getAllSensors = () => {
        const count = 2;
        log.debug('location-page.getAllSensors, status=' + Status[state.user.status]);
        state.sensors.getSensorsSamples(count);

    };
    onMounted(() => {
        log.debug('location-page.onMounted()');

    });
    log.debug('device-settings.setup');
    return { state, locationCount };
  },
});

</script>
