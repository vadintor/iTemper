<template>
    <v-simple-table v-if="sensorCount() > 0"  style="background-color: rgba(100, 100, 100, 0.1);">
        <template v-slot:default>
            <thead>
            <tr>
                <th class="text-left display-1">Givare</th>
                <th class="text-left display-1">Kategori</th>
                <th class="text-left display-1">Mätvärde</th>
                <th class="text-left display-1">Tidpunkt</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,id) in sensors" :key="id" >
                <td class="text-left display-1" >{{ item.desc.SN + '/' +  item.desc.port }}</td>
                <td class="text-left display-1" >{{ item.attr.category }}</td>
                <td class="text-left display-1" >{{ item.samples[0].value }}</td>
                <td class="text-left display-1" >{{ time(item.samples[0].date) }}</td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script lang="ts">
import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

import { Sensor, SensorLog, Data } from '@/models/sensor';

import { Settings } from '@/store/settings';

import { log } from '@/services/logger';

import * as utils from '@/helpers';

@Component({})
export default class SensorTable extends Vue {

    @Prop() public sensors!: Sensor[];

    public state = Vue.$store;
    public settings: Settings = Vue.$store.settings;

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
    public unitSymbol(): string {
        return this.settings.unitSymbol;
    }
    public danger(id: number): boolean {
        const sensor = this.sensors[id];
        if (sensor.hasSamples) {
            return sensor.lastSample.value  > this.settings.limit;
        } else {
              return false;
        }
    }
    public limit(): number {
        return this.settings.limit;
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
    public isValueValid(id: number): boolean {
        const sensor = this.sensors[id];
        return sensor.hasSamples();
    }
    public count(id: number): number {
        const sensor = this.sensors[id];
        return sensor.samples.length;
    }
    public value(id: number): string {
        const sensor = this.sensors[id];
        if (!sensor.hasSamples()) {
            return '';
        }
        const multiplier = Math.pow(10, this.settings.resolution || 0);
        const value = sensor.lastSample.value;
        return this.round(value, 0.5).toString().replace('.', ',');
        // Math.round( value * multiplier) / multiplier;
    }
    public period(id: number): string {
        const sensor = this.sensors[id];
        if (!sensor.hasSamples()) {
            return '';
        }
        const last = new Date(sensor.lastSample.date);
        return last.toLocaleDateString();
    }
    public time(date: number) {
        return utils.toTime(date);
    }
    public SN(id: number): string {
        const sensor = this.sensors[id];
        return sensor.desc.SN;
    }
    public port(id: number): number {
        const sensor = this.sensors[id];
        return sensor.desc.port;
    }
    public model(id: number): string {
        const sensor = this.sensors[id];
        return sensor.attr.model;
    }
}
</script>

