<template>
    <v-card>
        <v-img class="white--text" :src="image" :height="height">
            <v-container fill-height fluid :class="'overlay-' + overlay.toString()">
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                            <span class="display-3" v-if="isValueValid()" >{{ value() }} {{ unitSymbol() }}</span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-img>
        <v-card-title primary-title>
            <div>
                <div class="headline">{{ name }}</div>
                <span class="grey--text" v-if="isValueValid()"> {{ time() }}</span>
            </div>
        </v-card-title>
        <v-card-actions>
            
            <v-btn text color="orange" @click.native="toggleHistory()">Historik</v-btn>
            <v-btn text color="orange" @click.native="toggleMonitor()">Monitor</v-btn>
        </v-card-actions>
        <v-card-text v-show="showHistory" transition="slide-y-transition">
            <highcharts :options="options()"></highcharts>
        </v-card-text>
        <v-card-text v-show="showMonitor" transition="slide-y-transition">
            <span class="display-3" v-if="isValueValid()" >{{ raw() }} {{ unitSymbol() }}</span>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';
import VueHighcharts from 'vue-highcharts';
Vue.use(VueHighcharts);

// Models
// import * as locations from '@/models/locations'
import { Sensor, SensorLog, Data } from '@/models/sensor';
import { Settings } from '@/store/settings';
// import * as messages from '@/models/messages';
// Services

import { log } from '@/services/logger';

import * as ss from '@/services/sensor-service';

import KalmanFilter from 'kalmanjs';

import { Monitor } from '@/services/monitor';

@Component({})
export default class LocationCard extends Vue {
    @Prop() public sensor!: Sensor;
    @Prop() public name!: string;
    @Prop() public image!: string;
    @Prop() public height!: number;
    @Prop() public overlay!: number;

    public settings: Settings = Vue.$store.settings;

    public showHistory: boolean = false;
    public showMonitor: boolean = false;
    public rawValue: string = '';
    public monitor!: Monitor;

    public receiveLog(l: SensorLog): void {
        this.rawValue = l.samples[0].value.toString();
    }

    public mounted() {
        this.monitor = new Monitor();
        this.monitor.SubscribeSensorLog(this.sensor.desc, this.receiveLog);
    }
    public toggleHistory() {
        this.showHistory = !this.showHistory;
        this.showMonitor = false;
    }

    public toggleMonitor() {
        this.showHistory = false;
        this.showMonitor = !this.showMonitor;
    }

    public options(): any {
        const self = this;

        return {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                type: 'spline',
            },
            title: {
                text: 'Senaste 24 timmar',
                x: -20, // center
            },
            subtitle: {
                text: 'Givare: ' + this.SN() + '/' + this.port(),
                x: -20,
            },
            xAxis: {
                type: 'datetime',
            },
            yAxis: {
                title: {
                text: 'Temperatur (°C)',
                },
                plotLines: [{
                value: 0,
                width: 0,
                color: '#808080',
                }],
            },
            legend: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                valueSuffix: '°C',
            },

            series: [{
                name: this.name,
                data: this.getData(),
            }],
            time: {
                getTimezoneOffset(timestamp: number): number {
                    const zone = self.settings.zone;
                    const timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                    return timezoneOffset;
                },
            },
        };
    }
    public getData(): number[][] {
        const oneHour = 60 * 60 * 1000;
        const firstSampleDate =  Date.now() - 24 * oneHour;
        const data: number [][] = [];
        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 0.5});

        if (this.sensor) {
            this.sensor.samples
                .filter((sample) => sample.date > firstSampleDate)
                .map((sample) =>
                    data.push([sample.date, this.round(kalmanFilter.filter(sample.value), 0.01)]));
        }
        return data;
    }

    public unitSymbol(): string {
        return this.settings.unitSymbol;
    }
    public danger(): boolean {
        if (this.sensor && this.sensor.samples[0]) {
            return this.sensor.samples[0].value  > this.settings.limit;
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
    public isValueValid(): boolean {
        return this.sensor && this.sensor.samples.length > 0;
    }

    public lastSample(): Data {
        const last = this.sensor.samples.length - 1;
        const data = this.sensor.samples[last];
        return data;
    }

    public firstSample(id: number): Data {
        return this.sensor.samples[0];
    }

    public count(): number {
        if (this.isValueValid()) {
            return  this.sensor.samples.length;
        } else {
            return 0;
        }
    }
    public value(): string {
        if (!this.isValueValid()) {
            return '';
        }
        const multiplier = Math.pow(10, this.settings.resolution || 0);
        const value = this.lastSample().value;
        return this.round(value, 0.5).toString().replace('.', ',');
        // Math.round( value * multiplier) / multiplier;
    }

    public raw(): string {
        return this.rawValue;
        // return this.isValueValid() ? this.lastSample().value.toString() : "";
    }

    public time(id: number): string {
        if (!this.isValueValid()) {
            return '';
        }

        const firstFields = new Date(this.firstSample(id).date).toLocaleString().split(' ');
        const lastFields = new Date(this.lastSample().date).toLocaleString().split(' ');
        const timeFileds = lastFields[1].split(':');
        return lastFields[0] + ', kl. ' + timeFileds[0] + ':' + timeFileds[1];
    }
    public period(): string {
        if (!this.isValueValid()) {
            return '';
        }
        const last = new Date(this.lastSample().date);
        return last.toLocaleDateString();
    }

    public SN(): string {
        if (this.sensor !== undefined) {
            return this.sensor.desc.SN;
        } else {
            return '?';
        }

    }
    public port(): number {
        if (this.sensor !== undefined) {
            return this.sensor.desc.port;
        } else {
            return -1;
        }
    }
    public model(): string {
        return this.sensor.attr.model;
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
