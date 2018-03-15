<template>
    <v-list two-line subheader>
        <v-subheader class="title">Mina platser</v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="(item, id) in state.sensors" :key="id" @click="">
            <v-list-tile-content>
                <v-list-tile-title class="headline">{{ location(id) }}</v-list-tile-title>
                <v-list-tile-sub-title class="headline" >
                    {{ value(id) }} {{ unitSymbol() }}
                </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-icon v-if="danger(id)" :color="'red'">announcement</v-icon>
                <v-icon v-else :color="'teal'">check_circle</v-icon>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>
</template>

<script lang="ts">
import axios from 'axios';
import { iTemperAPI } from './../config';
import {Vue, Component} from "vue-property-decorator"
import * as Location from './../models/locations'
import * as Sensors from './../models//sensors' 
import * as Settings from './../models/settings'



export interface RootState {
    settings: Settings.GlobalSettings;
    locations: Location.LocationState;
    sensors: Sensors.SensorState;
}

@Component({})
export default class MyLocations extends Vue {
   
      state : RootState = { 
        settings: Settings.DefaultGlobalSettings,
        locations: Location.DefaultLocations,
        sensors: [
    { desc: {id: '0', description: 'DS18B20', category: Sensors.Category.IndoorTemperature},
        samples: [ {_port: 0, _value: 85.0, date: 1}]},
    { desc: {id: '1', description: 'DS18B20', category: Sensors.Category.IndoorTemperature},
        samples: [ {_port: 1, _value: 85.0, date: 1}]},
    { desc: {id: '3', description: 'DS18B20', category: Sensors.Category.IndoorTemperature},
        samples: [ {_port: 3, _value: 85.0, date: 1}]},
    { desc: {id: '7', description: 'DS18B20', category: Sensors.Category.IndoorTemperature},
        samples: [ {_port: 7, _value: 85.0, date: 1}]}]
    }

    getCensorData() {
        let self = this;
        axios.get(iTemperAPI)
        .then(resolve => {
                const data : Sensors.Data[] = resolve.data.slice()
                self.state.sensors[0].samples[0]._value = data[0]._value
                self.state.sensors[1].samples[0]._value = data[1]._value
                self.state.sensors[2].samples[0]._value = data[2]._value
                self.state.sensors[3].samples[0]._value = data[3]._value
        })
        .catch(error => {
               console.error('getCensorData',JSON.stringify(error))
        })
    }
    created(): void {
        console.log('created')
        this.getCensorData();
        setInterval(this.getCensorData, 1000 * this.state.settings.interval)

    }
    unitSymbol(): string {
        return this.state.settings.unitSymbol
    }
    danger(id:number):boolean {
        return this.state.sensors[id].samples[0]._value  > this.state.settings.limit
    }
    limit(id:number): number {
        return this.state.settings.limit;
    }
    value(id: number): number {
        //return this.myValue;
        let multiplier = Math.pow(10, this.state.settings.resolution || 0);
        return Math.round(this.state.sensors[id].samples[0]._value * multiplier) / multiplier;
    }
    location(id:number):string {
        switch(this.state.sensors[id].samples[0]._port) {
            case 0: return "Arbetsrum";
            case 1: return "Datacenter";
            case 3: return "Kök"; ;
            case 7: return "Sovrum"; 
        }
        return "Port " + id.toString();
    }
}   

</script>

<style>

</style>