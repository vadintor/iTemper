<template>
<div >
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 md6 lg4 v-for="(item,id) in state.devices.all" :key="id">
                <device-card  
                    :device="item"
                    :name="name(item)"
                    :image="image(id)"
                    :overlay="id"
                    :height=400
                >
                </device-card>
            </v-flex>
            <v-chip v-if="deviceCount()===0" transition="scale-transition" >Det finns inga enheter ännu</v-chip>
        </v-layout>
    </v-container>
</div>
</template>

<script lang="ts">
import * as moment from 'moment-timezone';
import {Vue, Component, Watch} from "vue-property-decorator"
// Models

import { Device } from '@/models/device' 
import  { Settings } from '@/store/settings'

// Services

import { log } from '@/services/logger';


import KalmanFilter from 'kalmanjs';

// Child components
import DeviceCard from './deviceCard.vue'


@Component({
    components: {
    DeviceCard
  }
})
export default class MyLocations extends Vue {

    state = Vue.$store;

    deviceCount(): number {
        return this.state.devices.all.length;
    }
    settings(): Settings {
        return this.state.settings;
    }
    getDevices() {
        this.state.devices.getDevices();
    }

    created(): void {
        log.debug('MyDevices.created()')
        this.getDevices();
    }


    limit(id:number): number {
        return this.state.settings.limit;
    }
    // round(2.74, 0.1) = 2.7
    // round(2.74, 0.25) = 2.75
    // round(2.74, 0.5) = 2.5
    // round(2.74, 1.0) = 3.0
    round(value: number, precision: number) {
        precision || (precision = 1.0);
        var inverse = 1.0 / precision;
        return Math.round(value * inverse) / inverse;
    }

    name(device: Device) {
        return device.name;
    }
    
    color(id: number): string {
        return "trans-" + id.toString();
    }

    image(id: number): string {
            return "/img/" + "uterum" + ".jpg";
    }
    
    location(id:number): string {
            return "En  plats";
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
