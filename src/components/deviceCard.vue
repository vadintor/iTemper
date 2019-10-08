<template>
    <v-card>
            <v-container fill-height fluid :class="'overlay-' + overlay.toString()">
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                            <span class="display-3" v-if="isValueValid()" >{{ value() }} </span>
                    </v-flex>
                </v-layout>
            </v-container>
        <v-card-title primary-title>
            <div>
                <div class="headline">{{ device.name }}</div>
                <span class="grey--text" v-if="isValueValid()"> {{ time() }}</span>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-btn flat color="orange" @click.native="editName()">Ändra</v-btn>
            <v-btn flat color="orange" @click.native="deleteDEvice()">Radera</v-btn>
        </v-card-actions>

    </v-card>
</template>

<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from "vue-property-decorator"

// Models
// import * as locations from '@/models/locations'
import { Device }  from '@/models/device' 
import { Settings } from '@/store/settings';
// import * as messages from '@/models/messages';
// Services

import { Devices } from '@/store/devices';
import { log } from '@/services/logger';



import { Monitor } from '@/services/monitor';

@Component({})
export default class DeviceCard extends Vue {
    @Prop() device: Device;
    @Prop() name: string;
    @Prop() image: string;
    @Prop() height: number;
    @Prop() overlay: number;

    newName: string = '';
    devices: Devices = Vue.$store.devices;

    mounted() {

    }


    editName(): void {
        this.devices.renameDevice(this.newName, this.device)
    }

    deleteDevice() {
        this.devices.deleteDevice(this.device);
    }
}   

</script>

<style scoped>

.overlay-0 {
    background-color: rgba(227, 153, 0, 0.7);
}

.overlay-1 {
    background-color: rgba(153, 10, 227, 0.7);
}

.overlay-2 {
    background-color: rgba(153, 0, 0, 0.7);
}

.overlay-3 {
    background-color: rgba(10, 153, 227, 0.7);
}

.overlay-4 {
    background-color: rgba(0, 10, 153, 0.7);
}

.overlay-5 {
    background-color: rgba(0, 227, 30, 0.7);
}

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
