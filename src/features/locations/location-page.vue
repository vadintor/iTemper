<template>
        <v-row>
            <v-col v-for="(item,id) in state.locations.all" :key="id">
                <location-card  
                    :location="item"
                    :id="id"
                    :height=400
                >
                </location-card>
                <v-chip v-if="locationCount()===0" transition="scale-transition" >Det finns inga platser.</v-chip>
            </v-col>
        </v-row>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

// Store
import { Status } from '@/store/user';

// Services
import { log } from '@/services/logger';

// Child components
import LocationCard from './location-card.vue';


@Component({
    components: {
    LocationCard,
  },
})
export default class LocationPage extends Vue {

    public state = Vue.$store;

    public locationCount(): number {
        return this.state.locations.all.length;
    }
    public getLocations() {
        log.debug('location-page.getLocations');
        this.state.locations.getLocations();
    }
    public getSensorDataLast24() {
        log.debug('location-page.getSensorData, status=' + Status[this.state.user.status]);
        if (this.state.user.status === Status.LOGGED_IN) {
            this.state.sensors.getSensorsLast24h();
        }
    }
    public getAllSensors() {
        const count = 2;
        log.debug('location-page.getAllSensors, status=' + Status[this.state.user.status]);
        this.state.sensors.getSensorsSamples(count);

    }
    public created(): void {
        log.debug('location-page.created()');
        this.getAllSensors();
        this.getLocations();
        setInterval(this.getSensorDataLast24, 1000 * this.state.settings.interval);
    }
}

</script>

<style scoped>

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
