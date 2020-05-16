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
                            <v-container fluid>
                                <v-row>
                                    <v-col align-self="start">
                                        <v-card light v-show="editSensors">
                                            <v-card-text transition="slide-y-transition">
                                            <v-list        style="max-height: 150px" class="overflow-y-auto">
                                            <v-list-item-group 
                                                v-model="value"
                                                max="5"
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
                                                        <v-list-item-title >{{sensorName(item)}}</v-list-item-title>
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
                                                <v-btn class="ma-2" color="blue" text @click.native="submitSensors()">
                                                    Spara
                                                </v-btn>
                                                <v-btn class="ma-2" color="orange" text @click.native="cancelEditSensors()">
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
                                                        prepend-icon="fa-file-image"
                                                    ></v-file-input>
                                                </v-form>
                                            </v-card-text>

                                            <v-card-actions>
                                                <v-btn class="ma-2" :disabled="!fileFormValid" color="blue" text @click.native="submitFile()">
                                                    Spara
                                                </v-btn>
                                                <v-btn class="ma-2" color="orange" text @click.native="cancelEditFile()">
                                                    Avbryt
                                                </v-btn>                               
                                            </v-card-actions>
                                        </v-card>
                                        <v-card light v-show="editColor">
                                            <v-card-text>
                                                <v-color-picker
                                                        v-model="location.color"
                                                        hide-canvas
                                                        hide-inputs
                                                        hide-mode-switch
                                                        show-swatches
                                                        light
                                                        :swatches="swatches" 
                                                        class="mx-auto"
                                                        :disabled="submitted"
                                                >
                                                </v-color-picker>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn :disabled="submitted" class="ma-2" color="blue" text @click.native="submitColor()">
                                                    Spara
                                                </v-btn>
                                                <v-btn class="ma-2" color="orange" text @click.native="cancelEditColor()">
                                                    Avbryt
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                        <div v-show="showConfiguration && !editFile && !editColor && !editSensors">
                                            <v-btn  class="ma-2"  icon @click.native="onEditSensors()">
                                                <v-icon x-large>fa-biohazard</v-icon>
                                            </v-btn>
                                            <v-btn  class="ma-2"  icon @click.native="onEditFile()">
                                                <v-icon x-large>fa-file-image</v-icon>
                                            </v-btn>
                                            <v-btn class="ma-2"  icon @click.native="onEditColor()">
                                                <v-icon x-large>fa-fill</v-icon>
                                            </v-btn>
                                        </div>
                                        <SensorTable v-show="!editSensors" :sensors="mySensors()"></SensorTable>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-overlay>
                    </v-fade-transition>
            </v-img>
            
        </v-container>
        <v-card-title primary-title>
            <div>
                <div v-if="!showConfiguration" class="headline">{{ location.name }}</div>
                <v-text-field v-else-if="!editName"  class="headline"
                            prepend-inner-icon="fa-edit"
                            v-model="locationName"
                            :rules="nameRules"
                            dense
                            required
                            @focus="onEditName()"
                ></v-text-field>                
                <v-text-field v-else  class="headline"
                            prepend-inner-icon="fa-edit"
                            v-model="locationName"
                            :rules="nameRules"
                            dense
                            required
                            :loading="submitted"
                            append-icon="fa-check"
                            append-outer-icon="fa-times"
                            @click:append="submitName()"
                            @click:append-outer="cancelEditName()"
                ></v-text-field>
            </div>
        </v-card-title>
        <v-card-actions v-if="showConfiguration">
                <v-btn text :disabled="showConfiguration && (submitted || editSensors || editColor || editFile)" color="orange" @click.native="toggleConfiguration()">Stäng</v-btn>
                <v-spacer></v-spacer>
                <v-btn text :disabled="showConfiguration && (submitted || editSensors || editColor || editFile)" color="orange" @click.native="deleteLocation()">Radera</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
            <div>
                <v-btn text :disabled="showConfiguration && (submitted || editSensors || editColor || editFile)" color="orange" @click.native="toggleConfiguration()">Ändra</v-btn>
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
import { Sensor, SensorLog, Data, Descriptor } from '@/models/sensor';
import { Location } from '@/models/location';

import { Locations } from '@/store/locations';
import { Settings } from '@/store/settings';
import { Sensors } from '@/store/sensors';
// import * as messages from '@/models/messages';
// Services

import { log } from '@/services/logger';
import {json } from '@/helpers';

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
    public sensorDesc: Descriptor[] = [];

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
    public locations: Locations =  Vue.$store.locations;

    public showConfiguration: boolean = false;
    public editName: boolean = false;
    public editColor: boolean = false;
    public editFile: boolean = false;
    public fileFormValid: boolean = false;
    public editSensors: boolean = false;

    public locationName: string = '';
    public locationColor: string = '';
    public newImage: File = new File([''], 'current');

    public submitted: boolean = false;
    public errorMsg = '';
    public timeout: number = 2_000;

    public mySensors(): Sensor[] {
        for (const desc of this.location.sensorDesc) {
            const mapped = this.location.sensors.find((s) => s.desc.SN === desc.SN && s.desc.port === desc.port);
            if (!mapped) {
                const sensor =  this.sensors.find(desc);
                if (sensor) {
                    this.location.sensors.push(sensor);
                }
            }
        }
        return this.location.sensors;
    }
    public toggleConfiguration() {
        this.showConfiguration = !this.showConfiguration;
        if (this.showConfiguration) {
            this.locationColor = this.location.color.slice();
            this.locationName = this.location.name.slice();
        }
    }
    public fileSize(): number {
        return this.newImage.size;
    }
    public locationImage(): string {
        const path = iTemperAPI + this.location.path;
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
    public onEditName() {
        this.editName = true;
        this.locationName = this.location.name.slice();
    }
    public onEditSensors() {
        this.editSensors = true;
    }
    public cancelEditSensors() {
            this.editSensors = false;
    }
    public submitSensors() {
        log.debug('locationCard.submitSensors: update sensors');
        this.submitted = true;
        this.locations.updateSensors(this.value, this.location)
        .then((location) => {
            this.submitted = false;
            this.editSensors = false;
        })
        .catch((err: any) => {
            this.submitted = false;
            this.displayError('error (' + err.status + '): ' + err.message);
        });
    }
    public onEditFile() {
        this.editFile = true;
    }
    public cancelEditFile() {
        this.editFile = false;
    }
    public submitFile() {
        if (!this.fileFormValid) {
            this.displayError('File form not valid');
            return;
        } else {
            log.debug('locationCard.submitFile: Save file ' + json(this.newImage));
            const form = new FormData();
            form.append('locationImage', this.newImage);
            this.submitted = true;
            this.locations.updateFile(form, this.location)
            .then((location) => {
                this.submitted = false;
                this.editFile = false;
                this.location.path = location.path;
                this.newImage = new File([''], 'current');
            })
            .catch((err: any) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
        }
    }
    public cancelEditName() {
            this.locationName = this.location.name.slice();
            this.editName = false;
    }
    public submitName() {
        if (this.location.name === this.locationName) {
            log.debug('locationCard.submitName: no changes');
            return;
        } else {
            log.debug('locationCard.submitName: update location name');
            this.submitted = true;
            this.locations.updateName(this.locationName, this.location)
            .then((received) => {
                this.location.name = received.name;
                this.submitted = false;
                this.editName = false;
            })
            .catch((err) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
        }
    }
    public submitColor() {
        if (this.location.color === this.locationColor) {
            log.debug('locationCard.submitColor: no changes');
            return;
        } else {
            log.debug('locationCard.submitColor: update overlay color');
            this.submitted = true;
            this.locations.updateColor(this.location.color, this.location)
            .then((location) => {
                this.submitted = false;
                this.editColor = false;
            })
            .catch((err: any) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
            }
    }
    public onEditColor() {
        this.editColor = true;
        this.locationColor = this.location.color.slice();
    }
    public cancelEditColor() {
            this.editColor = false;
            this.location.color = this.locationColor.slice();
    }
    public deleteLocation() {
            this.locations.deleteLocation(this.location)
            .then((received) => {
                this.submitted = false;
            })
            .catch((err) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
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

    public toggleMonitor() {
        this.showConfiguration = false;
       // this.showMonitor = !this.showMonitor;
    }

    public sensorName(sensor: Sensor) {
        return sensor.desc.SN + ', port: ' + sensor.desc.port;
    }
    public error(): boolean {
        return this.errorMsg !== '';
    }
    private reset(): void {
        this.errorMsg = '';
    }
    private displayError(msg: string) {
        this.errorMsg = msg;
        this.setTimer();
    }
    private setTimer() {
        const timeout = 2_250;
        setTimeout(() => {this.reset(); }, timeout);
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

