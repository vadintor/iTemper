<template>
    <v-card>
        <v-container fill-height fluid :class="overlay(id)">
            <v-layout fill-height>
                <v-flex  align-end flexbox>
                    <span class="display-1">{{ name() }} </span>

                </v-flex>
            </v-layout>
        </v-container>
        <v-card-title primary-title>
            <div>

            </div>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="rows"
            disable-pagination="true"
        >
            <template v-slot:items="props">
                <td >{{ props.item.desc }}</td>
                <td >{{ props.item.category }}</td>
                <td >{{ props.item.value }}</td>
                <td >{{ props.item.time }}</td>
            </template>
        </v-data-table>


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

import { log } from '@/services/logger';

import { Sensors, sensors } from '@/store/sensors';
import { Devices, devices } from '@/store/devices';

import { Monitor } from '@/services/monitor';

@Component({})
export default class DeviceCard extends Vue {
    @Prop() device: Device;
    @Prop() id: number;

    state = Vue.$store;
    newName: string = '';
    headers = [
        {
        text: 'Givare',
        align: 'left',
        sortable: false,
        value: 'desc',
        },
        { text: 'Typ', value: 'category' },
        { text: 'Mätvärde', value: 'value' },
        { text: 'Sensast', value: 'time' }
    ];
    rows = [];
    mounted() {

    }

    overlay(id: number): string {
        return 'overlay-' + id.toString()
    }

    name(): string {
        return this.device.name;
    }

    mySensors() {
        this.rows = this.state.sensors.filterByDeviceID(this.device.deviceID).map(el => {
            return  {desc: el.desc.SN + '/' + el.desc.port,
            category: el.attr.category,
            value: el.samples[0].value,
            time: new Date(el.samples[0].date).toLocaleString()}
        });
        log.debug('DEVICECARD.mySensors='+ JSON.stringify(result));
        return result;

    }



    editName(): void {
        this.state.devices.renameDevice(this.newName, this.device)
    }

    deleteDevice() {
        this.state.devices.deleteDevice(this.device);
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
