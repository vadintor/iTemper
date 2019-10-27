<template>
<div>
    <v-card>
        <v-container >
            <v-img class="white--text" :src="locationImage()"  :height="height" >
                    <v-fade-transition>
                        <v-overlay
                            absolute
                            :color="location.color"
                            opacity="0.8"
                        >
                        <v-card light v-show="editSensors">
                            <v-card-text transition="slide-y-transition">
                            <v-list>
                            <v-list-item-group
                                v-model="value"
                                max="2"
                                multiple
                            >
                                <template v-for="(item, i) in sensors.all">
                                <v-divider
                                    v-if="!item"
                                    :key="`divider-${i}`"
                                ></v-divider>
                                <v-list-item
                                    v-else
                                    :key="`item-${i}`"
                                    :value="item"
                                    active-class="deep-purple--text text--accent-4"
                                >
                                    <template v-slot:default="{ active, toggle }">
                                    <v-list-item-content>
                                        <v-list-item-title >{{name(item)}}</v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-checkbox
                                        :input-value="active"
                                        :true-value="item"
                                        color="deep-purple accent-4"
                                        @click="toggle"
                                        ></v-checkbox>
                                    </v-list-item-action>
                                    </template>
                                </v-list-item>
                                </template>
                            </v-list-item-group>
                            </v-list>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn class="ma-2" color="blue" text @click.native="editSensors=!editSensors">
                                    Spara
                                </v-btn>
                                 <v-btn class="ma-2" color="orange" text @click.native="editSensors=!editSensors">
                                    Avbryt
                                </v-btn>                               
                            </v-card-actions>
                        </v-card>
                        <v-card light v-show="editFile">
                            <v-card-text>
                                <v-form v-model="fileFormValid" ref="locations">
                                    <v-file-input
                                        label="Bakgrundbild"
                                        :rules="Filerules"
                                        accept="image/png, image/jpeg"
                                        :show-size="fileSize()>0"
                                        counter chips
                                        v-model="newImage"
                                        prepend-icon="mdi-camera"
                                    ></v-file-input>
                                </v-form>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn class="ma-2" :disabled="!fileFormValid" color="blue" text @click.native="editFile=!editFile">
                                    Spara
                                </v-btn>
                                 <v-btn class="ma-2" color="orange" text @click.native="editFile=!editFile">
                                    Avbryt
                                </v-btn>                               
                            </v-card-actions>
                        </v-card>
                        <v-card light v-show="editColor">
                            <card-text>
                                <v-color-picker
                                        v-model="location.color"
                                        hide-canvas
                                        hide-inputs
                                        hide-mode-switch
                                        show-swatches
                                        light
                                        :swatches="swatches" 
                                        class="mx-auto"
                                >
                                </v-color-picker>
                            </card-text>
                            <v-card-actions>
                                <v-btn class="ma-2" color="blue" text @click.native="editColor=!editColor">
                                    Spara
                                </v-btn>
                                <v-btn class="ma-2" color="orange" text @click.native="editColor=!editColor">
                                    Avbryt
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <div v-show="showConfiguration && !editFile && !editColor && !editSensors">
                            <v-btn  class="ma-2"  icon @click.native="editSensors=!editSensors">
                                <v-icon x-large>mdi-leak</v-icon>
                            </v-btn>
                            <v-btn  class="ma-2"  icon @click.native="editFile=!editFile">
                                <v-icon x-large>mdi-camera</v-icon>
                            </v-btn>
                            <v-btn class="ma-2"  icon @click.native="editColor=!editColor">
                                <v-icon x-large>mdi-format-color-fill</v-icon>
                            </v-btn>
                        </div>
                        <SensorTable v-show="!showConfiguration" :sensors="value"></SensorTable>

                        </v-overlay>
                    </v-fade-transition>
            </v-img>
            
        </v-container>
        <v-card-title primary-title>
            <div>
                <div v-if="!showConfiguration" class="headline">{{ location.name }}</div>
                <v-text-field v-else  class="headline"
                            prepend-inner-icon="mdi-square-edit-outline"
                            v-model="location.name"
                            :rules="nameRules"
                            dense
                            required
                            :loading="submitted"
                ></v-text-field>
            </div>
        </v-card-title>
        <v-card-actions v-show="showConfiguration">
                <v-btn text :disabled="showConfiguration && (editColor || editFile)" color="blue" @click.native="toggleConfiguration()">Spara</v-btn>
                <v-btn text :disabled="showConfiguration && (editColor || editFile)" color="orange" @click.native="toggleConfiguration()">Avbryt</v-btn>
        </v-card-actions>
        
        <v-card-actions v-show="!showConfiguration">
            <div>
                <v-btn text color="orange" @click.native="toggleConfiguration()">Ändra</v-btn>
            </div>
        </v-card-actions>
    </v-card>
</div>
</template>

<script lang="ts">
import { iTemperAPI } from '@/config';
import hexToRgba from 'hex-to-rgba';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

// Models
// import * as locations from '@/models/locations'
import { Sensor, SensorLog, Data } from '@/models/sensor';
import { Location } from '@/models/location';

import { Settings } from '@/store/settings';
import { Sensors } from '@/store/sensors';
// import * as messages from '@/models/messages';
// Services

import { log } from '@/services/logger';


import SensorTable from '@/components/sensorTable.vue';
type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;
interface FileProperties {
    name: string;
    size: number;
    type: string;
}
type FileValidationFunction = (value: FileProperties) => BooleanOrString;
@Component({
    components: { SensorTable },
})
export default class LocationCard extends Vue {

    @Prop() public location!: Location;
    @Prop() public id!: number;
    @Prop() public height!: number;

    public items: string[] =  [];
    public value: Sensor[] =  [];

    public nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^[a-öA-Ö0-9]+$/.test(v) && v.length >= 4 || 'Must be at least 4 characters, no white spaces or special characters allowed',
        ];
    public Filerules: FileValidationFunction[] = [
        (v) => !v || v.size < 2_000_000 || 'File size should be less than 2 MB!',
      ];
    public swatches =  [
        ['#e39900', '#990ae3', '#990000'],
        ['#0a99e3', '#000a99', '#00e31e'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
      ];
    public state = Vue.$store;
    public settings: Settings = Vue.$store.settings;
    public sensors: Sensors = Vue.$store.sensors;
    public showConfiguration: boolean = false;
    public editColor: boolean = false;
    public editFile: boolean = false;
    public fileFormValid: boolean = false;
    public editSensors: boolean = false;
    public submitted: boolean = false;

    public savedName: string = '';
    public savedColor: string = '';
    public newImage: File = new File([''], 'current');

    public fileSize(): number {
        return this.newImage.size;
    }
    public locationImage(): string {
        const path = iTemperAPI + this.location.path;
        log.debug('locationCard locationImage path=' + path);
        return path;
    }
    public sensorNames() {
        for (const sensor of this.sensors.all) {
            if (!this.items.find((i) => i === sensor.name)) {
            this.items.push(sensor.name);
            }
        }
    }
    public locationSensors() {
        for (const sensor of this.location.sensors) {
            if (!this.value.find((i) => i.name === sensor.name)) {
            // this.value.push(sensor.name);
            }
        }
    }
    public updateLocationSensors(e: any) {
        log.debug('locationCard.updateLocationSensors ' + JSON.stringify(e));
        this.locationSensors();
    }

    public toggle(e: any) {
        log.debug('toggle' + JSON.stringify(e));
        return false;
    }
    public overlay() {
        return 'background-color: ' + hexToRgba(this.location.color, 0.3);
    }
    public mounted() {
        log.debug('locationCard.mounted');
    }
    public toggleConfiguration() {
        this.showConfiguration = !this.showConfiguration;
        // this.showMonitor = false;
    }

    public toggleMonitor() {
        this.showConfiguration = false;
       // this.showMonitor = !this.showMonitor;
    }

    public name(sensor: Sensor) {
        return sensor.desc.SN + ', port: ' + sensor.desc.port;
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

