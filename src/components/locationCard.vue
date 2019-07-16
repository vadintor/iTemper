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
            
            <v-btn flat color="orange" @click.native="showDetails = !showDetails">Historik</v-btn>
            <v-btn flat color="orange">Monitor</v-btn>
        </v-card-actions>
        <v-card-text v-show="showDetails" transition="slide-y-transition">
            <highcharts :options="options()"></highcharts>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from "vue-property-decorator"
import VueHighcharts from 'vue-highcharts'
Vue.use(VueHighcharts);
// Models
import * as locations from '@/models/locations'
import {Data, Sensor, DefaultSensors } from '@/models//sensors' 
import { DefaultGlobalSettings } from '@/models/settings'

// Services

import { log } from '@/services/logger';
//import { isIPv4 } from "net";
import * as ss from "@/services/sensor-service";
import * as settings from '@/models/settings'
import { getSensorSamples } from "@/services/sensor-service";

import KalmanFilter from 'kalmanjs';


@Component({})
export default class LocationCard extends Vue {
    @Prop() sensor: Sensor;
    @Prop() name: string;
    @Prop() image: string;
    @Prop() height: number;
    @Prop() overlay: number;

    settings = DefaultGlobalSettings;
    showDetails: boolean = false;

    // @Watch('state', {deep: true})
    // watchState(oldState: Sensor[], newState: Sensor[]) {

    // }

    getSamples():number[] {
        const samples: number[] = [];
        const lastPeriod =  Date.now() - 24*60*60*1000;
        const values: number [] = [];

        if (this.sensor)
            this.sensor.samples
                .filter((sample) => sample.date > lastPeriod)
                .map((sample)=> values.push(sample.value));

        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});
        const filteredValues = values.map((v) => kalmanFilter.filter(v))

        return filteredValues;
    }

    options(): any {

        return {
            chart:{
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                type:'spline'
            },
            title: {
                text: 'Senaste 24 timmar',
                x: -20 //center
            },
            subtitle: {
                text: 'Givare: ' + this.sensor.desc.SN + '/' + this.sensor.desc.port,
                x: -20
            },
            xAxis: {
                type:'datetime'
            },
            yAxis: {
                title: {
                text: 'Temperatur (°C)'
                },
                plotLines: [{
                value: 0,
                width: 0,
                color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                valueSuffix: '°C'
            },

            series: [{
                name: this.name,
                data: this.getData()
            }],
            time: {
                getTimezoneOffset:  function (timestamp: number): number {
                    const zone = settings.DefaultGlobalSettings.zone;
                    const timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                    return timezoneOffset; 
                }
            }
        };
    }
    getData(): number[][] {
        const oneHour = 60*60*1000;
        const firstSampleDate =  Date.now() - 24 * oneHour;
        const data: number [][] = [];
        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 0.5});

        if (this.sensor)
            this.sensor.samples
                .filter((sample) => sample.date > firstSampleDate)
                .map((sample) => 
                    data.push([sample.date, this.round(kalmanFilter.filter(sample.value), 0.01)])
                );

        return data;
    }

    unitSymbol(): string {
        return this.settings.unitSymbol
    }
    danger(): boolean {
        if (this.sensor && this.sensor.samples[0])
            return this.sensor.samples[0].value  > this.settings.limit
        else
              return false;
    }
    limit(): number {
        return this.settings.limit;
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
    isValueValid() {
        return this.sensor && this.sensor.samples.length > 0;
    }

    lastSample(): Data {
        const last = this.sensor.samples.length - 1
        const data = this.sensor.samples[last];
        return data;
    }

    firstSample(id: number): Data {
        return this.sensor.samples[0];
    }

    count(id: number): number {
        if (this.isValueValid())
            return  this.sensor.samples.length
        else
            return 0;
    }
    value(id: number): string {
        if (!this.isValueValid())
            return ""
        const multiplier = Math.pow(10, this.settings.resolution || 0);
        const value = this.lastSample().value; 
        return this.round(value, 0.5).toString().replace(".", ",")
        // Math.round( value * multiplier) / multiplier;
    }

    
    time(id: number): string {
        if (!this.isValueValid())
            return "" 
        const firstFields = new Date(this.firstSample(id).date).toLocaleString().split(' ');
        const lastFields = new Date(this.lastSample().date).toLocaleString().split(' '); 
        const timeFileds = lastFields[1].split(':')
        return lastFields[0] +', kl. ' + timeFileds[0] + ':' + timeFileds[1]
    }
    
    period(): string {
        if (!this.isValueValid())
            return "" 
        const last = new Date(this.lastSample().date); 
        return last.toLocaleDateString();
    }

    SN(): string {
        return this.sensor.desc.SN;
    }
    port(): number {
    return this.sensor.desc.port;
    }

    model(): string {
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
