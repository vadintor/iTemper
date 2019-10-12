<template>
<div >
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 md6 lg4 v-for="(item,id) in state.sensors.all" :key="id">
                <location-card  
                    :sensor="item"
                    :name="name(item)"
                    :image="image(id)"
                    :overlay="id"
                    :height=400
                >
                </location-card>
            </v-flex>
            <v-chip v-if="sensorCount()===0" transition="scale-transition" >Det finns inga sensorer ännu</v-chip>
        </v-layout>
    </v-container>
</div>
</template>

<script lang="ts">
import * as moment from 'moment-timezone';
import {Vue, Component, Watch} from 'vue-property-decorator';
import VueHighcharts from 'vue-highcharts';

Vue.use(VueHighcharts);
// Models

import { Data, Sensor } from '@/models/sensor';
import { Settings } from '@/store/settings';

// Services

import { log } from '@/services/logger';


import KalmanFilter from 'kalmanjs';

// Child components
import LocationCard from './locationCard.vue';


@Component({
    components: {
    LocationCard,
  },
})
export default class MyLocations extends Vue {

    public state = Vue.$store;

    public sensorCount(): number {
        return this.state.sensors.all.length;
    }
    public settings(): Settings {
        return this.state.settings;
    }
    public getSensorData() {
        this.state.sensors.getSensorsLast24h();
    }

    public created(): void {
        log.debug('MyLocations.created()');
        this.getSensorData();
        setInterval(this.getSensorData, 1000 * this.state.settings.interval);
    }

    public unitSymbol(): string {
        return this.state.settings.unitSymbol;
    }

    public limit(id: number): number {
        return this.state.settings.limit;
    }
    // round(2.74, 0.1) = 2.7
    // round(2.74, 0.25) = 2.75
    // round(2.74, 0.5) = 2.5
    // round(2.74, 1.0) = 3.0
    public round(value: number, precision: number) {
        const prec = precision || (precision = 1.0);
        const inverse = 1.0 / prec;
        return Math.round(value * inverse) / inverse;
    }

    public name(sensor: Sensor) {
        return sensor.desc.SN + '/' + sensor.desc.port;
    }

    public color(id: number): string {
        return 'trans-' + id.toString();
    }

    public image(id: number): string {
            return '/img/' + 'uterum' + '.jpg';
    }

    public location(id: number): string {
            return 'En  plats';
    }
}

</script>

<style scoped>

.trans-0 {
    background-color: rgba(227, 153, 0, 0.7);
}

.trans-1 {
    background-color: rgba(153, 10, 227, 0.7);
}

.trans-2 {
    background-color: rgba(153, 0, 0, 0.7);
}

.trans-3 {
    background-color: rgba(10, 153, 227, 0.7);
}

.trans-4 {
    background-color: rgba(0, 10, 153, 0.7);
}

.trans-5 {
    background-color: rgba(0, 227, 30, 0.7);
}

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
