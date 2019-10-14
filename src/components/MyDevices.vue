<template>
<div >
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex v-for="(item,id) in state.devices.all" :key="id">
                <device-card  
                    :device="item"
                    :id="id"
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
import {Vue, Component, Watch} from 'vue-property-decorator';
// Models

import { Device } from '@/models/device';

// Services

import { log } from '@/services/logger';


// Child components
import DeviceCard from './deviceCard.vue';

@Component({
    components: {
    DeviceCard,
  },
})
export default class MyDevices extends Vue {

    public state = Vue.$store;

    public deviceCount(): number {
        return this.state.devices.all.length;
    }

    public getDevices() {
        this.state.devices.getDevices();
    }

    public created(): void {
        log.debug('MyDevices.created()');
        this.getDevices();
    }

    public name(device: Device) {
        return device.name;
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
