<template>
    <v-list two-line subheader>
        <v-subheader class="title">Inställningar</v-subheader>
        <v-divider></v-divider>
            <v-list-tile @click="">
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">Temperatur</v-list-tile-title>
                    <v-list-tile-sub-title class="subheading" >
                        Celsius, {{unitSymbol()}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="'teal'">check_circle</v-icon>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="">
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">Larm</v-list-tile-title>
                    <v-list-tile-sub-title class="subheading" >
                        Larma vid {{limit()}} grader
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="'teal'">check_circle</v-icon>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="">
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">Noggrannhet</v-list-tile-title>
                    <v-list-tile-sub-title class="subheading" >
                        Antal decimaler: {{resolution()}} decimal
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="'teal'">check_circle</v-icon>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile@click="">
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">Uppdatering</v-list-tile-title>
                    <v-list-tile-sub-title class="subheading" >
                        Hämta ny information efter {{interval()}} sekunder
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="'teal'">check_circle</v-icon>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile@click="">
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">Tidszon</v-list-tile-title>
                    <v-list-tile-sub-title class="subheading" >
                        {{zone()}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="'teal'">check_circle</v-icon>
                </v-list-tile-action>
            </v-list-tile>                           
    </v-list>
</template>

<script lang="ts">

// import axios from 'axios';
// import { iTemperAPI } from './../config';
import { Vue, Component} from "vue-property-decorator"
import * as Settings from './../models/settings'



// export interface RootState {
//     settings: Settings.GlobalSettings;
//     locations: Location.LocationState;
//     sensors: Sensors.SensorState;
// }

@Component({})
export default class MySettings extends Vue {
    state = { 
        settings: Settings.DefaultGlobalSettings,
    }
//     getSettings() {
//         let self = this;
//         // axios.get(iTemperAPI)
//         // .then(resolve => {
//         //         const data : Sensors.Data[] = resolve.data.slice()
//         //         self.state.sensors[0].samples[0].value = data[0].value
//         //         self.state.sensors[1].samples[0].value = data[1].value
//         //         self.state.sensors[2].samples[0].value = data[2].value
//         //         self.state.sensors[3].samples[0].value = data[3].value
//         // })
//         // .catch(error => {
//         //        console.error('getCensorData',JSON.stringify(error))
//         // })
//     }
//     created(): void {
//         console.log('created')
//   //       this.getSettings();
//     }
    unitSymbol(): string {
        return this.state.settings.unitSymbol
    }

    limit(): number {
        return this.state.settings.limit;
    }
    resolution(): number {
        return this.state.settings.resolution
    }

    interval(): number {
        return this.state.settings.interval
    }
    
    zone(): string {
        return this.state.settings.zone
    }
}   

</script>

<style>

</style>