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
          <v-simple-table>
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">Givare</th>
                    <th class="text-left">Kategori</th>
                    <th class="text-left">Mätvärde</th>
                    <th class="text-left">Tidpunkt</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,id) in state.sensors.filterByDeviceID(device.deviceID)" :key="id" >
                    <td>{{ item.desc.SN + '/' +  item.desc.port }}</td>
                    <td>{{ item.attr.category }}</td>
                    <td>{{ lastValue(item)}}</td>
                    <td>{{ item.lastTime }}</td>
                </tr>
                </tbody>
            </template>
          </v-simple-table>
        <v-card-actions>
            <v-btn text color="orange" @click.native="editName()">Ändra</v-btn>
            <v-btn text color="orange" @click.native="deleteDEvice()">Radera</v-btn>
        </v-card-actions>

    </v-card>
</template>

<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

// Models
// import * as locations from '@/models/locations'
import { Device } from '@/models/device';
import { Sensor } from '@/models/sensor';

import { log } from '@/services/logger';

import { Monitor } from '@/services/monitor';

@Component({})
export default class DeviceCard extends Vue {
    @Prop() public device!: Device;
    @Prop() public id!: number;

    public state = Vue.$store;
    public sensors = Vue.$store.sensors;
    public newName: string = '';
    public headers = [
        {
        text: 'Givare',
        align: 'left',
        sortable: false,
        value: 'name',
        },
        { text: 'Typ', value: 'category' },
        { text: 'Mätvärde', value: 'lastValue' },
        { text: 'Sensast', value: 'lastTime' },
    ];

    public filterSensors(sensors: Sensor[], deviceID: string): Sensor[] {
        return this.sensors.filterByDeviceID(deviceID);
    }
    public overlay(id: number): string {
        return 'overlay-' + id.toString();
    }

    public name(): string {
        return this.device.name;
    }
    public lastValue(sensor: Sensor): string {
        return sensor.lastValue();
    }
    public editName(): void {
        this.state.devices.renameDevice(this.newName, this.device);
    }

    public deleteDevice() {
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
