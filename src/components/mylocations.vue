<template>
<div >
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs4 v-for="(item,id) in 5" :key="id">
                    <location-card  
                        :sensor="sensor(id)"
                        :name="location(id)"
                        :image="image(id)"
                        :overlay="id"
                        height=200
                    >
                    </location-card>
                </v-flex>
            </v-layout>
        </v-container>

</div>
</template>

<script lang="ts">
            // <v-card-media class="white--text" height="400px" :src="image(id)" >
            //     <v-container fill-height :class="color(id)">
            //         <v-layout fill-height fluid >
            //             <v-flex >
            //                 <span class="headline"> {{ location(id) }} </span>
            //                 <br>
            //                 <span class="headline" v-if="isValueValid(id)" >{{ value(id)}} {{ unitSymbol() }}</span>
            //                 <br>
            //                 <span class="subheading"  v-if="isValueValid(id)"> {{time(id)}}</span>
            //                 <highcharts v-if="showDetails" :options="options(id)"></highcharts>
            //             </v-flex>
            //         </v-layout>
            //     </v-container>
            // </v-card-media>
            
            // <v-card-actions>
            //     <v-btn flat color="orange">Mer</v-btn>
            // </v-card-actions>

import * as moment from 'moment-timezone';

            // <v-card v-if="showDetails" transition="fade-transition">
            //     <v-card  v-if="isValueValid(id)" >Tidpunkt: {{time(id)}}</v-card>
            //     <v-card  v-else>inget värde</v-card>
            //     <v-card> Modell: {{ model(id) }}</v-card>
            //     <v-card >Serienummer/port: {{SN(id)}}/{{ port(id) }}</v-card>
            // </v-card>
import {Vue, Component, Watch} from "vue-property-decorator"
import VueHighcharts from 'vue-highcharts'
Vue.use(VueHighcharts);
// Models
import * as locations from '@/models/locations'
import {Data, Sensor, DefaultSensors } from '@/models//sensors' 
import * as settings from '@/models/settings'

// Services

import { log } from '@/services/logger';
import { isIPv4 } from "net";
import * as ss from "@/services/sensor-service";
import { getSensorSamples } from "@/services/sensor-service";

import KalmanFilter from 'kalmanjs';

// Child components
import LocationCard from './locationCard.vue'

export interface RootState {
    settings: settings.GlobalSettings;
    locations: locations.LocationState;
    sensors: Sensor[];
}

@Component({
    components: {
    LocationCard
  }
})
export default class MyLocations extends Vue {
    showDetails: boolean = false;
    autoDrawDuration: number = 5000;
    minSampleValue: number = 0;
    maxSampleValue: number = 30;
    state : RootState = { 
        settings: settings.DefaultGlobalSettings,
        locations: locations.DefaultLocations,
        sensors: DefaultSensors,
    }

    // @Watch('state', {deep: true})
    // watchState(oldState: Sensor[], newState: Sensor[]) {

    // }
    sensor(id: number): Sensor {
        return this.state.sensors[id];
    }
    settings(): settings.GlobalSettings {
        return this.state.settings;
    }
    getSensorData() {
        let self = this;
       ss.getSensors(4000)
        .then ((resolve: Sensor[]) => {
            self.state.sensors = [];
            for (const sensor of resolve) {
                self.state.sensors.push(sensor);
            }
            
        })
        .catch((error: any) => {
            console.error('getSensorData',JSON.stringify(error))
        })
    }

    getSensorSamples(id: number): void{
        let self = this;
        if (!self.state.sensors[id])

       ss.getSensorSamples(self.state.sensors[id].desc)
        .then ((samples: Data[]) => {
            const lastFiveMin =  Date.now() - 24*60*1000;
            const data = samples.filter((sample) => sample.date >  lastFiveMin)
            self.state.sensors[id].samples = Object.assign({}, data);
        })
        .catch((error: any) => {
            console.error('getSensorData',JSON.stringify(error))
        })
    }

    getSamples(id:number):number[] {
        const samples: number[] = [];
        const lastPeriod =  Date.now() - 24*60*60*1000;
        const values: number [] = [];

        if (this.state.sensors[id])
            this.state.sensors[id].samples
                .filter((sample) => sample.date > lastPeriod)
                .map((sample)=> values.push(sample.value));

        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});
        const filteredValues = values.map((v) => kalmanFilter.filter(v))

        return filteredValues;
    }

    options(id: number): any {

        return {
            chart:{
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },
            title: {
                text: 'Temperatur',
                x: -20 //center
            },
            subtitle: {
                text: 'Källa: iTemper.io',
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
                width: 1,
                color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: this.location(id),
                data: this.getData(id)
            }],
            time: {
                getTimezoneOffset:  function (timestamp: number): number {
                    const zone = 'Europe/Stockholm';
                    const timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                    return timezoneOffset; 
                }
            }
        };
    }
    getData(id: number): number[][] {
        const oneHour = 60*60*1000;
        const firstSampleDate =  Date.now() - 24 * oneHour;
        const data: number [][] = [];
        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 0.5});

        if (this.state.sensors[id])
            this.state.sensors[id].samples
                .filter((sample) => sample.date > firstSampleDate)
                .map((sample) => 
                    data.push([sample.date, this.round(kalmanFilter.filter(sample.value), 0.01)])
                );

        return data;
    }
    created(): void {
        this.getSensorData();
        setInterval(this.getSensorData, 1000 * this.state.settings.interval)
    }

    unitSymbol(): string {
        return this.state.settings.unitSymbol
    }
    danger(id:number): boolean {
        if (this.state.sensors[id] && this.state.sensors[id].samples[0])
            return this.state.sensors[id].samples[0].value  > this.state.settings.limit
        else
              return false;
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
    isValueValid(id: number) {
        return this.state.sensors[id] && this.state.sensors[id].samples.length > 0;
    }

    lastSample(id:number): Data {
        const last = this.state.sensors[id].samples.length - 1
        const data = this.state.sensors[id].samples[last];
        return data;
    }

    firstSample(id: number): Data {
        return this.state.sensors[id].samples[0];
    }

    count(id: number): number {
        if (this.isValueValid(id))
            return  this.state.sensors[id].samples.length
        else
            return 0;
    }
    value(id: number): string {
        if (!this.isValueValid(id))
            return ""
        const multiplier = Math.pow(10, this.state.settings.resolution || 0);
        const value = this.lastSample(id).value; 
        return this.round(value, 0.5).toString().replace(".", ",")
        // Math.round( value * multiplier) / multiplier;
    }
    color(id: number): string {
        return "trans-" + id.toString();
    }

    image(id: number): string {
        return "/img/" + this.location(id).toLowerCase() + ".jpg";
    }
    
    time(id: number): string {
        if (!this.isValueValid(id))
            return "" 
        const firstFields = new Date(this.firstSample(id).date).toLocaleString().split(' ');
        const lastFields = new Date(this.lastSample(id).date).toLocaleString().split(' '); 
        const timeFileds = lastFields[1].split(':')
        return lastFields[0] +', kl. ' + timeFileds[0] + ':' + timeFileds[1]
    }
    
    period(id: number): string {
        if (!this.isValueValid(id))
            return "" 
        const last = new Date(this.lastSample(id).date); 
        return last.toLocaleDateString();
    }
    location(id:number): string {
        if (!this.state.sensors[id]) {
            return ""
        }
            
        switch(this.state.sensors[id].desc.port) {
            case 0: { return this.state.sensors[id].desc.SN === "Temper8" ? "Utomhus" : "Uterum"};
            case 1: return "Sommarstuga";
            case 3: return "Arbetsrum"; 
            case 7: return "Datacenter"; 
        }
        return this.state.sensors[id].desc.SN + '/' + this.state.sensors[id].desc.port;
    }
    SN(id:number): string {
        return this.state.sensors[id].desc.SN;
    }
    port(id:number): number {
    return this.state.sensors[id].desc.port;
    }

    model(id: number): string {
        return this.state.sensors[id].attr.model;
    }

    onClick(): boolean {
        this.showDetails = ! this.showDetails;
        return this.showDetails;
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
