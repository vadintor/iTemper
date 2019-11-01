<template>
    <v-simple-table v-if="sensorCount() > 0"  style="background-color: rgba(100, 100, 100, 0.1);">
        <template v-slot:default>
            <tbody>
            <tr v-for="item in sensors" :key="item._id">
                <td class="text-left display-1" >{{ sampleValue(item) }}</td>
                <td class="text-left display-1" >{{ sampleTime(item)}}</td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script lang="ts">
import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

import { Category, Sensor, SensorLog } from '@/models/sensor';

import { Settings } from '@/store/settings';

import { log } from '@/services/logger';

import * as utils from '@/helpers';

@Component({})
export default class SensorTable extends Vue {

    @Prop() public sensors!: Sensor[];

    public state = Vue.$store;
    public settings: Settings = Vue.$store.settings;
    public mysensors = Vue.$store.sensors;
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
    public mounted() {
        log.debug('locationCard.mounted');

    }
    public sensorCount(): number {
        if (!this.sensors) {
            return 0;
        } else {
            return this.sensors.length;
        }
    }
    public icon(sensor: Sensor): string {
        switch (sensor.attr.category) {
            case Category.Temperature: {
                return 'fa-thermometer-half';
            }
            case Category.Humidity: {
                return 'fa-thermometer-half';
            }
            default: {
                return sensor.attr.category;
            }
        }
        return sensor.desc.SN + '/' +  sensor.desc.port;
    }
    public unit(category: Category): string {
        return this.settings.unit(category);
    }
    public sampleValue(sensor: Sensor): string {
        log.debug('sensorTable.sampleValue:' + JSON.stringify(sensor.samples.length));
        const lastSample = sensor.samples.length;
        if (lastSample > 0) {
            const multiplier = Math.pow(10, this.settings.resolution || 0);
            const value = sensor.samples[lastSample - 1].value;
            return this.round(value, 0.5).toString().replace('.', ',') + ' ' + this.unit(sensor.attr.category);
        } else {
            return '-';
        }

    }
    public sampleTime(sensor: Sensor ) {
        log.debug('sensorTable: lastSample=' + JSON.stringify(sensor.samples.length));
        const lastSample = sensor.samples.length;
        if (lastSample > 0) {
            const date: number = sensor.samples[lastSample - 1].date;
            return utils.toTime(date);
        } else {
            return '-';
        }
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
}
</script>

