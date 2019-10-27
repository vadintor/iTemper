<template>
        <v-row>
            <v-col v-for="(item,id) in state.locations.all" :key="id">
                <location-card  
                    :location="item"
                    :id="id"
                    :height=400
                >
                </location-card>
                <v-chip v-if="locationCount()===0" transition="scale-transition" >Det finns inga platser ännu</v-chip>
            </v-col>
        </v-row>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

// Services
import { log } from '@/services/logger';

// Child components
import LocationCard from './locationCard.vue';


@Component({
    components: {
    LocationCard,
  },
})
export default class MyLocations extends Vue {

    public state = Vue.$store;

    public locationCount(): number {
        return this.state.locations.all.length;
    }
    public getLocations() {
        log.debug('MyLocations.getLocations');
        this.state.locations.getLocations();
    }
    public getSensorData() {
        this.state.sensors.getSensorsLast24h();
    }
    public created(): void {
        log.debug('MyLocations.created()');
        this.getSensorData();
        this.getLocations();
        setInterval(this.getSensorData, 1000 * this.state.settings.interval);
    }
}

</script>

<style scoped>

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
