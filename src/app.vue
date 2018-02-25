
<template>
<div id="app">
    <v-app>
        <v-content>
            <v-container>
                <v-toolbar color="light-blue" dark>
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                    <v-toolbar-title>iTemper</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon>search</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>view_module</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-list two-line subheader>
                    <v-subheader>Mina Termometrar</v-subheader>
                    <v-divider></v-divider>
                    <v-list-tile v-for="(item, id) in state.sensors" :key="location(id)" @click="">
                        <v-list-tile-content>
                            <v-list-tile-title v-text="location(id)"></v-list-tile-title>
                            <v-list-tile-sub-title :color="value(id) > limit(id) ? 'red' : 'teal'">
                                {{ value(id) }} {{ unitSymbol() }}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon v-if="value(id) > limit(id)" :color="'red'">announcement</v-icon>
                            <v-icon v-else :color="'teal'">check_circle</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
        </v-container>
      </v-content>
    </v-app>
</div>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator"
import axios from 'axios';

export class Temper8SensorData {
    _port: number;
    _value: number; 
}

export interface Temper8SensorState {
   sensors: Temper8SensorData[]
}

export interface SensorSettings {

}
export interface  GlobalSettings {
    resolution: number;
    unitSymbol: string;
    limit: number;
    interval: number;
}
export interface RootState {
    settings: GlobalSettings;
    sensors: Temper8SensorData[];

}

@Component
export default class App extends Vue {
    state : RootState = { 
        settings: { resolution: 1, 
                    unitSymbol: "°C",
                    limit: 25,
                    interval: 15},
        sensors:[{"_port": 0,"_value":0.0},
                {"_port": 0,"_value": 0.0},
                {"_port": 0,"_value": 0.0},
                {"_port": 0,"_value": 0.0}]};
    
    getCensorData() {
        const prod = 'https://test.nivapro.com/itemper/api/';
        const dev = 'http://192.168.20.77/api/';
        axios.get(dev)
        .then(resolve => {
                const data : Temper8SensorData[] = resolve.data.slice();
                this.state.sensors = data;
                console.log(JSON.stringify(data))
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
    limit(id:number): number {
        return this.state.settings.limit;
    }
    value(id: number): number {
        let multiplier = Math.pow(10, this.state.settings.resolution || 0);
        return Math.round(this.state.sensors[id]._value * multiplier) / multiplier;
    }
    location(id:number):string {
        switch(this.state.sensors[id]._port) {
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