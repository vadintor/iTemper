<template>
    <v-list two-line subheader>
        <v-subheader class="title">Mina platser</v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="(item, id) in state.sensors" :key="id" @click="onClick()">
            <v-list-tile-content>
                <v-list-tile-title class="headline">{{ location(id) }}</v-list-tile-title>
                <v-list-tile-sub-title v-if="isValueValid(id)" class="subheading" >
                    {{ value(id) }} {{ unitSymbol() }}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title v-else class="subheading" >
                    Ingen temperaturangivelse finns från den här givaren
                </v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="showDetails" class="subheading" >
                    {{time(id)}} {{model(id)}} / {{SN(id)}} / {{port(id)}}
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
import {Vue, Component, Watch} from "vue-property-decorator"

// Models
import * as locations from '@/models/locations'
import {Sensor, DefaultSensors } from '@/models//sensors' 
import * as settings from '@/models/settings'

// Services
import getSensors from '@/services/sensor-service'
import log from '@/services/logger';
import { isIPv4 } from "net";

export interface RootState {
    settings: settings.GlobalSettings;
    locations: locations.LocationState;
    sensors: Sensor[];
}

@Component({})
export default class MyLocations extends Vue {
    showDetails: boolean = false;
    state : RootState = { 
        settings: settings.DefaultGlobalSettings,
        locations: locations.DefaultLocations,
        sensors: DefaultSensors,
    }

    @Watch('state', {deep: true})
    watchState(oldState: Sensor[], newState: Sensor[]) {

    }

    getSensorData() {
        let self = this;
       getSensors()
        .then ((resolve) => {
            self.state.sensors = [];
            for (const sensor of resolve) {
                self.state.sensors.push(sensor);
            }
            // this.commit(self.state.sensors, resolve);
        })
        .catch((error: any) => {
            console.error('getSensorData',JSON.stringify(error))
        })
    }
    mounted(): void {
        console.log('MyLocations mounted')
        this.getSensorData();
        setInterval(this.getSensorData, 1000 * this.state.settings.interval)

    }
    unitSymbol(): string {
        return this.state.settings.unitSymbol
    }
    danger(id:number):boolean {
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
        return this.state.sensors[id].samples.length > 0;
    }
    value(id: number): string {
        if (!this.isValueValid(id))
            return ""
        const value = this.state.sensors[id].samples[0].value;
        let multiplier = Math.pow(10, this.state.settings.resolution || 0);
 
        return this.round(value, 0.5).toString(); 
        // Math.round( value * multiplier) / multiplier;
    }

    time(id: number): string {
        if (!this.isValueValid(id))
            return "" 
        else 
            return new Date (this.state.sensors[id].samples[0].date).toLocaleString()
    }
    location(id:number):string {

        if (!this.state.sensors[id])
            return "<no location>"
        switch(this.state.sensors[id].desc.port) {
            case 0: return "Arbetsrum";
            case 1: return "Datacenter";
            case 3: return "Kök"; ;
            case 7: return "Sovrum"; 
        }
        return this.state.sensors[id].desc.SN + '/' + this.state.sensors[id].desc.port;
    }
    SN(id:number) {
        return this.state.sensors[id].desc.SN;
    }
    port(id:number) {
    return this.state.sensors[id].desc.port;
    }

    model(id: number) {
        return this.state.sensors[id].attr.model;
    }

    onClick(): boolean {
        this.showDetails = ! this.showDetails;
        return this.showDetails;

    }
}   

</script>

<style>

</style>